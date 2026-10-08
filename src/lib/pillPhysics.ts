import Matter from 'matter-js'

const { Engine, Bodies, Body, Composite, Constraint, Sleeping } = Matter

/** Fixed simulation step (ms): the same seed always produces the same pile. */
const STEP = 1000 / 60
/** Upper bound of steps used to settle a pile (≈ 10 s of simulated time). */
const SETTLE_STEPS = 600
/** Seeds tried before giving up and using the best pile found. */
const MAX_ATTEMPTS = 8
const WALL_THICKNESS = 400
/** Share of each row that pills may fill (the rest is breathing room). */
const ROW_FILL = 0.9
/** Spacing counted between pills when filling the row budget (px). */
const PILL_SPACING = 16
/** Largest gap between neighbouring pills when a row is dropped (px). */
const ROW_GAP_MAX = 14
/** Space kept between the `keepClear` element and the pile (px). */
const CLEAR_MARGIN = 12

/*
 * Low-ish friction: pills can lean on each other, but tall leaning stacks
 * tend to slide down instead of freezing in place.
 */
const BODY_OPTIONS: Matter.IChamferableBodyDefinition = {
  restitution: 0.12,
  friction: 0.22,
  frictionStatic: 0.35,
  frictionAir: 0.012,
  density: 0.0015,
  sleepThreshold: 45,
}

interface Entry {
  el: HTMLElement
  body: Matter.Body
  width: number
  height: number
}

interface Measured {
  el: HTMLElement
  w: number
  h: number
}

interface World {
  engine: Matter.Engine
  walls: Matter.Body[]
  entries: Entry[]
}

export interface PillSceneOptions {
  /** Skip the falling animation and dragging; render an already-settled pile. */
  reducedMotion: boolean
  /** First seed tried for spawn positions (the pile looks the same on every visit). */
  seed?: number
  /** Element the settled pile must not cover (the hero text block). */
  keepClear?: HTMLElement | null
}

/** Small seeded PRNG (mulberry32). */
function createRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max))

/** Lets the browser handle input and paint between expensive chunks. */
const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

/**
 * Drops DOM pills into a Matter.js world sized to `container` and keeps each
 * element's transform in sync with its body. Elements stay real DOM nodes, so
 * text and icons render crisply and the design tokens keep working.
 *
 * Because the simulation uses a fixed step, a drop is fully determined by its
 * seed. Before anything is shown, candidate seeds are simulated off-screen
 * (one per task, so the main thread stays responsive) and the first one whose
 * pile stays clear of `keepClear` is replayed live.
 *
 * Returns `ready` (resolves once the first drop is placed), `refresh`
 * (re-drop after content changes) and `destroy`.
 */
export function createPillScene(container: HTMLElement, elements: HTMLElement[], options: PillSceneOptions) {
  const baseSeed = options.seed ?? 11
  let width = container.clientWidth
  let height = container.clientHeight
  let live: World | null = null
  let dropToken = 0
  let destroyed = false
  let inView = false
  let frameId = 0
  let running = false
  let lastTime = 0
  let accumulator = 0
  let drag: { constraint: Matter.Constraint; pointerId: number; entry: Entry } | null = null

  // ---- Building worlds ----------------------------------------------------

  function createWalls() {
    const tall = height * 8
    const half = WALL_THICKNESS / 2
    return [
      Bodies.rectangle(width / 2, height + half, width + WALL_THICKNESS * 2, WALL_THICKNESS, { isStatic: true }),
      Bodies.rectangle(-half, height - tall / 2, WALL_THICKNESS, tall, { isStatic: true }),
      Bodies.rectangle(width + half, height - tall / 2, WALL_THICKNESS, tall, { isStatic: true }),
    ]
  }

  /** The text block's box in container coordinates, padded by CLEAR_MARGIN. */
  function clearZone() {
    if (!options.keepClear) return null
    const box = options.keepClear.getBoundingClientRect()
    const origin = container.getBoundingClientRect()
    return {
      left: box.left - origin.left - CLEAR_MARGIN,
      right: box.right - origin.left + CLEAR_MARGIN,
      bottom: box.bottom - origin.top + CLEAR_MARGIN,
    }
  }

  /**
   * Picks the pills that fit (elements are in priority order): at most
   * `--pills-max-rows` rows, and only as many whole rows as the space below
   * the text allows. The rest are flagged with data-overflow and left out.
   */
  function measure(): Measured[] {
    const maxRows = Number.parseFloat(getComputedStyle(container).getPropertyValue('--pills-max-rows')) || 2
    const pillHeight = elements.find((el) => el.offsetHeight > 0)?.offsetHeight ?? 0
    const zone = clearZone()
    const rows = zone && pillHeight ? clamp(Math.floor((height - zone.bottom) / pillHeight), 1, maxRows) : maxRows
    const budget = rows * width * ROW_FILL

    let used = 0
    const visible: Measured[] = []
    for (const el of elements) {
      const w = el.offsetWidth
      const h = el.offsetHeight
      const fits = w > 0 && h > 0 && used + w <= budget
      if (fits) {
        used += w + PILL_SPACING
        visible.push({ el, w, h })
      }
      el.dataset.overflow = String(!fits)
    }
    return visible
  }

  /**
   * Builds a world with the pills waiting above the container. They are
   * shuffled and packed into rows as wide as the container; each row is a
   * compact block (gaps narrower than a pill let the pills above wedge in on
   * their edge), upper rows land on the bottom row's span, and each row drops
   * after the one below it. About a third start upside down, like in the
   * reference layout.
   */
  function buildWorld(seed: number, visible: Measured[]): World {
    const random = createRandom(seed)
    const engine = Engine.create({ enableSleeping: true })
    const walls = createWalls()
    const entries: Entry[] = []

    const order = visible.map((_, index) => index)
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }

    const rows: number[][] = [[]]
    let rowWidth = 0
    for (const index of order) {
      const { w } = visible[index]
      if (rowWidth + w > width && rows[rows.length - 1].length > 0) {
        rows.push([])
        rowWidth = 0
      }
      rows[rows.length - 1].push(index)
      rowWidth += w
    }

    let baseStart = 0
    let baseEnd = width
    rows.forEach((row, rowIndex) => {
      const pillsWidth = row.reduce((sum, index) => sum + visible[index].w, 0)
      const gap = row.length > 1 ? Math.min(ROW_GAP_MAX, Math.max(0, width - pillsWidth) / (row.length - 1)) : 0
      const blockWidth = pillsWidth + gap * (row.length - 1)
      const [spanStart, spanEnd] = rowIndex === 0 ? [0, width] : [baseStart, baseEnd]
      let cursor = spanStart + random() * Math.max(0, spanEnd - spanStart - blockWidth)
      if (rowIndex === 0) {
        baseStart = cursor
        baseEnd = cursor + blockWidth
      }

      for (const index of row) {
        const { el, w, h } = visible[index]
        const upsideDown = random() < 0.3
        const tilt = rowIndex === 0 ? 1.4 : 0.6
        const x = clamp(cursor + w / 2, w / 2, width - w / 2)
        const y = -h - rowIndex * h * 2.4 - random() * h * 0.8
        const body =
          Math.abs(w - h) < 2
            ? Bodies.circle(x, y, w / 2, BODY_OPTIONS)
            : Bodies.rectangle(x, y, w, h, { ...BODY_OPTIONS, chamfer: { radius: h / 2 - 1 } })
        Body.setAngle(body, (upsideDown ? Math.PI : 0) + (random() - 0.5) * tilt)
        Body.setAngularVelocity(body, (random() - 0.5) * 0.06)
        entries.push({ el, body, width: w, height: h })
        cursor += w + gap * (0.4 + random() * 0.6)
      }
    })

    Composite.add(engine.world, [...walls, ...entries.map((entry) => entry.body)])
    return { engine, walls, entries }
  }

  function disposeWorld(world: World) {
    Composite.clear(world.engine.world, false)
    Engine.clear(world.engine)
  }

  /** Runs a world until every pill is asleep (or SETTLE_STEPS pass). */
  function settle(world: World) {
    for (let i = 1; i <= SETTLE_STEPS; i += 1) {
      Engine.update(world.engine, STEP)
      if (i % 20 === 0 && world.entries.every(({ body }) => body.isSleeping)) return
    }
  }

  /** How far (px) the highest pill over the text block reaches into it. */
  function intrusion(world: World) {
    const zone = clearZone()
    if (!zone) return 0
    let worst = 0
    for (const { body } of world.entries) {
      const { min, max } = body.bounds
      if (max.x > zone.left && min.x < zone.right) worst = Math.max(worst, zone.bottom - min.y)
    }
    return worst
  }

  /** Drops the pills, using the first seed whose pile stays clear of the text. */
  async function drop() {
    const token = (dropToken += 1)
    const visible = measure()

    let bestSeed = baseSeed
    if (options.keepClear && visible.length > 0) {
      let bestScore = Number.POSITIVE_INFINITY
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
        if (attempt > 0) {
          await yieldToMain()
          if (destroyed || token !== dropToken) return
        }
        const seed = baseSeed + attempt
        const candidate = buildWorld(seed, visible)
        settle(candidate)
        const score = intrusion(candidate)
        disposeWorld(candidate)
        if (score < bestScore) {
          bestScore = score
          bestSeed = seed
        }
        if (score <= 0) break
      }
    }

    if (live) disposeWorld(live)
    drag = null
    live = buildWorld(bestSeed, visible)
    if (options.reducedMotion) settle(live)
    render()
    wake()
  }

  function render() {
    if (!live) return
    for (const { el, body, width: w, height: h } of live.entries) {
      el.style.transform = `translate3d(${body.position.x - w / 2}px, ${body.position.y - h / 2}px, 0) rotate(${body.angle}rad)`
    }
  }

  // ---- Animation loop -----------------------------------------------------

  function frame(now: number) {
    if (!running) return
    accumulator += Math.min(now - lastTime, 100)
    lastTime = now
    let steps = 0
    while (live && accumulator >= STEP && steps < 4) {
      Engine.update(live.engine, STEP)
      accumulator -= STEP
      steps += 1
    }
    render()
    // Nothing left to animate: stop until a drag, resize or re-drop wakes it.
    if (live && !drag && live.entries.every(({ body }) => body.isSleeping)) {
      stop()
      return
    }
    frameId = requestAnimationFrame(frame)
  }

  /** Restarts the loop if the scene is on screen. */
  function wake() {
    if (inView && !document.hidden) start()
  }

  function start() {
    if (running || options.reducedMotion) return
    running = true
    lastTime = performance.now()
    accumulator = 0
    frameId = requestAnimationFrame(frame)
  }

  function stop() {
    running = false
    cancelAnimationFrame(frameId)
  }

  // ---- Dragging -----------------------------------------------------------

  function toLocal(event: PointerEvent) {
    const rect = container.getBoundingClientRect()
    return {
      x: clamp(event.clientX - rect.left, 0, width),
      y: Math.min(event.clientY - rect.top, height),
    }
  }

  function onPointerDown(event: PointerEvent) {
    if (!live || drag || event.button !== 0) return
    const entry = live.entries.find((item) => item.el === event.currentTarget)
    if (!entry) return
    event.preventDefault()

    const point = toLocal(event)
    Sleeping.set(entry.body, false)
    wake()
    const constraint = Constraint.create({
      pointA: point,
      bodyB: entry.body,
      pointB: { x: point.x - entry.body.position.x, y: point.y - entry.body.position.y },
      stiffness: 0.2,
      damping: 0.1,
      length: 0.01,
    })
    Composite.add(live.engine.world, constraint)
    entry.el.setPointerCapture(event.pointerId)
    entry.el.dataset.dragging = 'true'
    drag = { constraint, pointerId: event.pointerId, entry }
  }

  function onPointerMove(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointerId) return
    drag.constraint.pointA = toLocal(event)
    Sleeping.set(drag.entry.body, false)
  }

  function endDrag(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointerId) return
    if (live) Composite.remove(live.engine.world, drag.constraint)
    delete drag.entry.el.dataset.dragging
    drag = null
  }

  if (!options.reducedMotion) {
    for (const el of elements) {
      el.addEventListener('pointerdown', onPointerDown)
      el.addEventListener('pointermove', onPointerMove)
      el.addEventListener('pointerup', endDrag)
      el.addEventListener('pointercancel', endDrag)
    }
  }

  // ---- Lifecycle ----------------------------------------------------------

  const ready = drop()

  // A width change re-drops the pile (pill sizes and the row budget depend on
  // it); a height-only change just moves the floor and wakes the pills.
  let resizeTimer = 0
  const resizeObserver = new ResizeObserver(() => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      const nextWidth = container.clientWidth
      const nextHeight = container.clientHeight
      if (!nextWidth || !nextHeight || (nextWidth === width && nextHeight === height)) return
      const widthChanged = nextWidth !== width
      width = nextWidth
      height = nextHeight
      if (widthChanged || !live) {
        void drop()
        return
      }
      Composite.remove(live.engine.world, live.walls)
      live.walls = createWalls()
      Composite.add(live.engine.world, live.walls)
      live.entries.forEach(({ body }) => Sleeping.set(body, false))
      wake()
      if (options.reducedMotion) {
        settle(live)
        render()
      }
    }, 150)
  })
  resizeObserver.observe(container)

  // Only simulate while the hero is on screen and the tab is visible.
  const updateRunning = () => (inView && !document.hidden ? start() : stop())
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    updateRunning()
  })
  intersectionObserver.observe(container)
  document.addEventListener('visibilitychange', updateRunning)

  /** Re-drops the pills after their content changed (e.g. language switch). */
  function refresh() {
    return drop()
  }

  function destroy() {
    destroyed = true
    stop()
    window.clearTimeout(resizeTimer)
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    document.removeEventListener('visibilitychange', updateRunning)
    for (const el of elements) {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', endDrag)
      el.removeEventListener('pointercancel', endDrag)
      el.style.transform = ''
      delete el.dataset.dragging
      delete el.dataset.overflow
    }
    if (live) disposeWorld(live)
    live = null
  }

  return { ready, refresh, destroy }
}

export type PillScene = ReturnType<typeof createPillScene>
