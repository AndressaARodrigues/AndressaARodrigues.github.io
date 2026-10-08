import {
  createBrowserRouter,
  createMemoryRouter,
  Navigate,
  Outlet,
  RouterProvider,
  ScrollRestoration,
  type RouteObject,
} from 'react-router'
import { ScrollProgress } from './components/ScrollProgress/ScrollProgress'
import { SiteFooter } from './components/SiteFooter/SiteFooter'
import { SiteNav } from './components/SiteNav/SiteNav'
import { ui } from './content/ui'
import { I18nProvider } from './i18n/I18nProvider'
import { useI18n } from './i18n/useI18n'
import { About } from './pages/About/About'
import { Home } from './pages/Home/Home'

function Layout() {
  const { t } = useI18n()

  return (
    <>
      <a className="skip-link" href="#main">
        {t(ui.skipToContent)}
      </a>
      <ScrollProgress />
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
      {/*
        Each navigation gets its own saved position (so /#work scrolls to the
        section). The first page load always has the key "default", shared by
        every path, so it falls back to the path to keep pages apart.
      */}
      <ScrollRestoration getKey={(location) => (location.key === 'default' ? location.pathname : location.key)} />
    </>
  )
}

const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]

/**
 * Browser URLs by default. VITE_ROUTER=memory keeps navigation inside the
 * app, for hosts where the page's own URL can't be changed (e.g. embedded
 * previews).
 *
 * The basename follows Vite's `base`, so the site also works under a
 * sub-path such as GitHub Pages' /<repo>/ (see .github/workflows/deploy.yml).
 */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
const router =
  import.meta.env.VITE_ROUTER === 'memory' ? createMemoryRouter(routes) : createBrowserRouter(routes, { basename })

export default function App() {
  return (
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  )
}
