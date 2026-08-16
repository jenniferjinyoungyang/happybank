import { render, screen } from '@testing-library/react';
import { MemoryTitle } from '../MemoryTitle';

describe('MemoryTitle', () => {
  it('renders default h3 tag with title text', () => {
    render(<MemoryTitle title="My Memory Title" className="test-class" />);

    const heading = screen.getByRole('heading', { level: 3, name: 'My Memory Title' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('test-class');
  });

  it('renders specified HTML tag when as prop is passed', () => {
    render(<MemoryTitle title="Header 1 Title" as="h1" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Header 1 Title' })).toBeInTheDocument();
  });
});
