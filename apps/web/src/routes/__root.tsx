import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

// Devtools are only bundled in development.
const Devtools = import.meta.env.DEV
  ? lazy(async () => {
      const [{ TanStackRouterDevtools }, { ReactQueryDevtools }] = await Promise.all([
        import('@tanstack/react-router-devtools'),
        import('@tanstack/react-query-devtools'),
      ]);
      return {
        default: () => (
          <>
            <TanStackRouterDevtools position="bottom-right" />
            <ReactQueryDevtools buttonPosition="bottom-left" />
          </>
        ),
      };
    })
  : () => null;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
  notFoundComponent: () => (
    <main id="main">
      <h1>Page not found</h1>
      <p>
        That address does not exist. <Link to="/">Go to the start page</Link>.
      </p>
    </main>
  ),
});

function RootLayout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link to="/" className="brand" aria-label="SLIC home">
          SLIC
        </Link>
        <nav className="site-nav" aria-label="Main">
          <Link to="/" activeOptions={{ exact: true }}>
            Start
          </Link>
          <Link to="/status">API status</Link>
        </nav>
      </header>
      <Outlet />
      <Suspense fallback={null}>
        <Devtools />
      </Suspense>
    </>
  );
}
