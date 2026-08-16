import { render, screen } from '@testing-library/react';
import { MemoryHashtags } from '../MemoryHashtags';

describe('MemoryHashtags', () => {
  it('renders null when hashtags array is empty', () => {
    const { container } = render(<MemoryHashtags hashtags={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders list of hashtags with correct text', () => {
    render(<MemoryHashtags hashtags={['happy', 'vacation']} className="custom-class" />);

    expect(screen.getByText('#happy')).toBeInTheDocument();
    expect(screen.getByText('#vacation')).toBeInTheDocument();
  });
});
