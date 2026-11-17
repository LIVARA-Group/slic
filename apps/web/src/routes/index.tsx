import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <main id="main">
      <h1>Your monorepo is running</h1>
      <p>
        This page is served by Vite and the data on the status page comes from the NestJS API
        through the same-origin <code>/api</code> proxy.
      </p>
      <ul className="steps">
        <li>
          Add pages as files in <code>apps/web/src/routes</code>; the route tree regenerates itself.
        </li>
        <li>
          Add endpoints as modules in <code>apps/api/src</code> and share their contracts through{' '}
          <code>packages/shared</code>.
        </li>
        <li>
          Check that both halves talk to each other on the <Link to="/status">API status</Link>{' '}
          page.
        </li>
      </ul>
    </main>
  );
}
