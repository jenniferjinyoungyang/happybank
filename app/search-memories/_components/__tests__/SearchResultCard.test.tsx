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

    expect(screen.getByText('Beach day')).toBeInTheDocument();
    expect(screen.getByText('A short note')).toBeInTheDocument();
    expect(screen.getByText('#summer')).toBeInTheDocument();
    expect(screen.getByText('#fun')).toBeInTheDocument();
  });

  it('renders the memory date in long format', () => {
    const memory = makeMemoryMock({
      createdAt: new Date('2024-12-30T10:00:00.000-05:00'),
    });
    render(<SearchResultCard memory={memory} onOpen={() => {}} />);

    expect(screen.getByText(/December 30, 2024/i)).toBeInTheDocument();
  });

  it('renders full message when fullMessage is true', () => {
    const longMessage = 'Line 1\nLine 2';
    const memory = makeMemoryMock({ message: longMessage });
    render(<SearchResultCard memory={memory} fullMessage />);

    expect(screen.getByText(/Line 1/)).toBeInTheDocument();
  });

  it('calls onOpen when the card is clicked', async () => {
    const onOpen = jest.fn();
    const memory = makeMemoryMock({ title: 'Click me' });
    render(<SearchResultCard memory={memory} onOpen={onOpen} />);

    await userEvent.click(screen.getByText('Click me'));

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('renders placeholder image when memory has no imageId', () => {
    const memory = makeMemoryMock({ imageId: null });
    render(<SearchResultCard memory={memory} onOpen={() => {}} />);

    expect(screen.getByAltText('polaroid icon')).toBeInTheDocument();
  });

  it('renders cloudinary image when memory has imageId', () => {
    const memory = makeMemoryMock({ title: 'My memory', imageId: 'test_photo' });
    render(<SearchResultCard memory={memory} onOpen={() => {}} />);

    expect(screen.getByAltText('My memory')).toBeInTheDocument();
    expect(screen.getByAltText('My memory')).toHaveAttribute('src', 'test_photo');
  });
});
