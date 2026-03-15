import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeMemoryMock } from '../../../_shared/__mocks__/memory.mock';
import { SearchResultLightbox } from '../SearchResultLighbox';

jest.mock('next-cloudinary', () => ({
  CldImage: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe('SearchResultLightbox', () => {
  it('renders nothing when memory is null', () => {
    const { container } = render(<SearchResultLightbox memory={null} onClose={() => {}} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders dialog with title, message, date, and hashtags when memory is set', () => {
    const memory = makeMemoryMock({
      title: 'Lightbox memory',
      message: 'Full message here',
      createdAt: new Date('2024-12-30T10:00:00.000-05:00'),
      hashtags: ['tag1'],
    });
    render(<SearchResultLightbox memory={memory} onClose={() => {}} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Lightbox memory' })).toBeInTheDocument();
    expect(screen.getByText('Full message here')).toBeInTheDocument();
    expect(screen.getByText(/Dec 30, 2024/)).toBeInTheDocument();
    expect(screen.getByText('#tag1')).toBeInTheDocument();
  });

  it('renders a close button with z-10 and text-white for visibility', () => {
    const memory = makeMemoryMock();
    render(<SearchResultLightbox memory={memory} onClose={() => {}} />);

    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveClass('z-10');
    expect(closeButton).toHaveClass('text-white');
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = jest.fn();
    const memory = makeMemoryMock();
    render(<SearchResultLightbox memory={memory} onClose={onClose} />);

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the overlay (backdrop) is clicked', async () => {
    const onClose = jest.fn();
    const memory = makeMemoryMock();
    render(<SearchResultLightbox memory={memory} onClose={onClose} />);

    const overlay = screen.getByRole('presentation');
    await userEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when the dialog content is clicked', async () => {
    const onClose = jest.fn();
    const memory = makeMemoryMock({ title: 'Dialog title' });
    render(<SearchResultLightbox memory={memory} onClose={onClose} />);

    await userEvent.click(screen.getByRole('heading', { name: 'Dialog title' }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders memory date in medium format', () => {
    const memory = makeMemoryMock({
      createdAt: new Date('2025-03-15T12:00:00.000Z'),
    });
    render(<SearchResultLightbox memory={memory} onClose={() => {}} />);

    expect(screen.getByText(/Mar 15, 2025/)).toBeInTheDocument();
  });
});
