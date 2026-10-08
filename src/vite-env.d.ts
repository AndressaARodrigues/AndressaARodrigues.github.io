/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 'memory' keeps routing inside the app; anything else uses browser URLs. */
  readonly VITE_ROUTER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
