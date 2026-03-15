import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeMemoryMock } from '../../../_shared/__mocks__/memory.mock';
import { SearchResultCard } from '../SearchResultCard';

jest.mock('next-cloudinary', () => ({
  CldImage: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe('SearchResultCard', () => {
  it('renders memory title, message, and hashtags', () => {
    const memory = makeMemoryMock({
      title: 'Beach day',
      message: 'A short note',
      hashtags: ['summer', 'fun'],
    });
    render(<SearchResultCard memory={memory} onOpen={() => {}} />);

    expect(screen.getByRole('button')).toHaveTextContent('Beach day');
    expect(screen.getByRole('button')).toHaveTextContent('A short note');
    expect(screen.getByText('#summer')).toBeInTheDocument();
    expect(screen.getByText('#fun')).toBeInTheDocument();
  });

  it('renders the memory date in medium format', () => {
    const memory = makeMemoryMock({
      createdAt: new Date('2024-12-30T10:00:00.000-05:00'),
    });
    render(<SearchResultCard memory={memory} onOpen={() => {}} />);

    // toLocaleDateString(undefined, { dateStyle: 'medium' }) e.g. "Dec 30, 2024" (locale-dependent)
    expect(screen.getByText(/Dec 30, 2024/)).toBeInTheDocument();
  });

  it('truncates long messages with ellipsis', () => {
    const longMessage = 'a'.repeat(200);
    const memory = makeMemoryMock({ message: longMessage });
    render(<SearchResultCard memory={memory} onOpen={() => {}} />);

    expect(screen.getByRole('button')).toHaveTextContent('…');
    expect(screen.getByRole('button').textContent?.length).toBeLessThan(250);
  });

  it('calls onOpen when the card is clicked', async () => {
    const onOpen = jest.fn();
    const memory = makeMemoryMock({ title: 'Click me' });
    render(<SearchResultCard memory={memory} onOpen={onOpen} />);

    await userEvent.click(screen.getByRole('button', { name: /Click me/ }));

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('renders placeholder image when memory has no imageId', () => {
    const memory = makeMemoryMock({ imageId: null });
    render(<SearchResultCard memory={memory} onOpen={() => {}} />);

    expect(screen.getByAltText('memory placeholder')).toBeInTheDocument();
  });

  it('renders cloudinary image when memory has imageId', () => {
    const memory = makeMemoryMock({ imageId: 'test_photo' });
    render(<SearchResultCard memory={memory} onOpen={() => {}} />);

    expect(screen.getByAltText('memory image')).toBeInTheDocument();
    expect(screen.getByAltText('memory image')).toHaveAttribute('src', 'test_photo');
  });
});
