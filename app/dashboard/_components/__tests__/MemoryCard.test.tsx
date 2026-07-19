import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryCard } from '../MemoryCard';
import { Memory } from '../../../_shared/_types/memory';

describe('MemoryCard', () => {
  const memory: Memory = {
    title: 'Summer trip',
    message:
      'A long message that should be clipped until the user expands it to see the rest. Adding more text here to ensure that the character count threshold is exceeded for testing expansion behavior properly.',
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

  it('resets expansion state when memory changes to a short memory', () => {
    const { rerender } = render(<MemoryCard memory={memory} />);

    fireEvent.click(screen.getByRole('button', { name: /show more/i }));
    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument();

    const shortMemory: Memory = {
      title: 'Short memory',
      message: 'Just a short note.',
      hashtags: [],
      imageId: null,
      createdAt: new Date('2024-02-01T00:00:00.000Z'),
    };

    rerender(<MemoryCard memory={shortMemory} />);

    expect(screen.getByText('Short memory')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders "Unknown date" when createdAt is an invalid date', () => {
    const invalidDateMemory: Memory = {
      ...memory,
      createdAt: 'invalid-date' as unknown as Date,
    };

    render(<MemoryCard memory={invalidDateMemory} />);

    expect(screen.getByText('Unknown date')).toBeInTheDocument();
  });
});
