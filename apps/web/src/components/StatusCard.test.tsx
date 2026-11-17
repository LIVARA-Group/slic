import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusCard } from './StatusCard';

describe('StatusCard', () => {
  it('renders every field of the status payload', () => {
    render(
      <StatusCard
        status={{
          name: 'api',
          version: '9.9.9',
          environment: 'production',
          uptimeSeconds: 42,
          timestamp: '2026-01-01T10:00:00.000Z',
        }}
      />,
    );
    expect(screen.getByText('9.9.9')).toBeInTheDocument();
    expect(screen.getByText('production')).toBeInTheDocument();
    expect(screen.getByText('42 s')).toBeInTheDocument();
  });
});
