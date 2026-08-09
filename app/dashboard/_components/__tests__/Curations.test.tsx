import { render, screen } from '@testing-library/react';
import { Curations } from '../Curations';
import { TopHashtag } from '../../_api/getCurations';

// Mock next-cloudinary CldImage component to render a simple img element in tests
jest.mock('next-cloudinary', () => ({
  CldImage: ({ src, alt }: { src: string; alt: string }) => (
    <img src={`cloudinary://${src}`} alt={alt} />
  ),
}));

describe('Curations', () => {
  it('should render nothing when curations is empty', () => {
    const { container } = render(<Curations curations={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render curations list with correct names and counts', () => {
    const curations: TopHashtag[] = [
      { id: 1, name: 'VietnamTrip', count: 15, imageId: null },
      { id: 2, name: 'MountainHike', count: 5, imageId: 'mountain-img' },
    ];

    render(<Curations curations={curations} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Curations' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View All' })).toBeInTheDocument();

    // Verification of formatted names
    expect(screen.getByText('#VietnamTrip')).toBeInTheDocument();
    expect(screen.getByText('15 memories')).toBeInTheDocument();

    expect(screen.getByText('#MountainHike')).toBeInTheDocument();
    expect(screen.getByText('5 memories')).toBeInTheDocument();

    // Check images
    // For id 1 (imageId: null), should show fallback polaroid image
    const fallbackImage = screen.getByAltText('polaroid icon');
    expect(fallbackImage).toBeInTheDocument();

    // For id 2 (imageId: 'mountain-img'), should show CldImage mock
    const cldImage = screen.getByAltText('MountainHike');
    expect(cldImage).toHaveAttribute('src', 'cloudinary://mountain-img');

    // Check link hrefs
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/search-memories');
    expect(links[1]).toHaveAttribute('href', '/search-memories?hashtags=VietnamTrip');
    expect(links[2]).toHaveAttribute('href', '/search-memories?hashtags=MountainHike');
  });

  it('renders correct count label for single memory count', () => {
    const curations: TopHashtag[] = [{ id: 1, name: 'solitude', count: 1, imageId: null }];

    render(<Curations curations={curations} />);

    expect(screen.getByText('#solitude')).toBeInTheDocument();
    expect(screen.getByText('1 memory')).toBeInTheDocument();
  });
});
