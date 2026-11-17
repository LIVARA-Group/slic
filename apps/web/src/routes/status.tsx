import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { StatusCard } from '../components/StatusCard';
import { statusQuery } from '../lib/api';

export const Route = createFileRoute('/status')({
  // Warm the cache on navigation; the component still handles loading and errors itself.
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(statusQuery);
  },
  component: StatusPage,
});

function StatusPage() {
  const { data, error, isPending, refetch, isFetching } = useQuery(statusQuery);

  return (
    <main id="main">
      <h1>API status</h1>
      {isPending && <p role="status">Contacting the API…</p>}
      {error && (
        <div role="alert" className="notice">
          <p>
            <strong>The API did not respond.</strong> {error.message}
          </p>
          <p>
            Start it with <code>pnpm dev</code> (API on port 3000), then try again.
          </p>
        </div>
      )}
      {data && <StatusCard status={data} />}
      <button type="button" onClick={() => void refetch()} disabled={isFetching}>
        {isFetching ? 'Checking…' : 'Check again'}
      </button>
    </main>
  );
}
