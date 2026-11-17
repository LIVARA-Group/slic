import type { StatusResponse } from '@repo/shared';

export function StatusCard({ status }: { status: StatusResponse }) {
  const rows: [string, string][] = [
    ['Service', status.name],
    ['Version', status.version],
    ['Environment', status.environment],
    ['Uptime', `${Math.round(status.uptimeSeconds)} s`],
    ['Server time', new Date(status.timestamp).toLocaleTimeString()],
  ];
  return (
    <dl className="facts">
      {rows.map(([term, value]) => (
        <div key={term}>
          <dt>{term}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
