import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryCard } from '../MemoryCard';
import { Memory } from '../../../_shared/_types/memory';

describe('MemoryCard', () => {
  const memory: Memory = {
    title: 'Summer trip',
    message: 'A long message that should be clipped until the user expands it to see the rest.',
    hashtags: ['travel', 'memory'],
    imageId: null,
    createdAt: new Date('2024-01-15T00:00:00.000Z'),
  };

  it('expands the message when the action button is pressed', () => {
    render(<MemoryCard memory={memory} />);

    expect(screen.getByText(/A long message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /show more/i }));

    expect(
      screen.getByText(/should be clipped until the user expands it to see the rest/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument();
  });
});
