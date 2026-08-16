import { render, screen } from '@testing-library/react';
import { MemoryStatsCard } from '../MemoryStatsCard';

describe('MemoryStatsCard', () => {
  it('should render stats with formatted timeline dates', () => {
    render(
      <MemoryStatsCard
        memoryCount={12}
        hashtagCount={42}
        oldestMemoryDate="2024-01-01T00:00:00.000Z"
        latestMemoryDate="2024-12-31T00:00:00.000Z"
      />,
    );

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('moments stored')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Hashtags')).toBeInTheDocument();
    expect(screen.getByText('Jan 2024')).toBeInTheDocument();
    expect(screen.getByText('Dec 2024')).toBeInTheDocument();
    expect(screen.getByText('TIMELINE')).toBeInTheDocument();
  });

  it('should render placeholder for missing dates', () => {
    render(
      <MemoryStatsCard
        memoryCount={0}
        hashtagCount={0}
        oldestMemoryDate={null}
        latestMemoryDate={null}
      />,
    );

    expect(screen.getAllByText('—')).toHaveLength(2);
    expect(screen.getByText('TIMELINE')).toBeInTheDocument();
  });

  it('should render placeholder for invalid dates', () => {
    render(
      <MemoryStatsCard
        memoryCount={0}
        hashtagCount={0}
        oldestMemoryDate="invalid-date"
        latestMemoryDate="invalid-date"
      />,
    );

    expect(screen.getAllByText('—')).toHaveLength(2);
  });
});
