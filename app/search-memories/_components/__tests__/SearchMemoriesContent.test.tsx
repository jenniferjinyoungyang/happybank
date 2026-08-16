import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiResult } from '../../../_shared/_types/apiResult';
import { Memory } from '../../../_shared/_types/memory';
import { makeMemoryMock } from '../../../_shared/__mocks__/memory.mock';
import * as SearchMemoriesApi from '../../_api/searchMemories';
import { SearchMemoriesContent } from '../SearchMemoriesContent';

jest.mock('../../_api/searchMemories');
jest.mock('next-cloudinary', () => ({
  CldImage: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe('SearchMemoriesContent', () => {
  let searchMemoriesSpy: jest.SpyInstance<ReturnType<typeof SearchMemoriesApi.searchMemories>>;

  beforeEach(() => {
    searchMemoriesSpy = jest.spyOn(SearchMemoriesApi, 'searchMemories');
    const routerMock = jest.requireActual('next-router-mock');
    routerMock.memoryRouter.setCurrentUrl('/search-memories');
  });

  it('renders header and search form', () => {
    const { container } = render(<SearchMemoriesContent />);

    expect(screen.getByRole('heading', { level: 1, name: 'Relive your joy' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. gratitude, family, weekend')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search in titles and messages')).toBeInTheDocument();
    const dateInputs = container.querySelectorAll('input[type="date"]');
    expect(dateInputs).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Reset filters' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('shows initial message before search', () => {
    render(<SearchMemoriesContent />);

    expect(screen.getByText('Run a search to see your memories here.')).toBeInTheDocument();
  });

  it('calls searchMemories with parsed params on submit', async () => {
    searchMemoriesSpy.mockResolvedValue({ isSuccess: true, data: [] });

    const { container } = render(<SearchMemoriesContent />);
    await userEvent.type(
      screen.getByPlaceholderText('e.g. gratitude, family, weekend'),
      '#tag1, tag2 , tag3',
    );
    await userEvent.type(screen.getByPlaceholderText('Search in titles and messages'), 'beach');
    const dateInputs = container.querySelectorAll('input[type="date"]');
    await userEvent.type(dateInputs[0] as HTMLInputElement, '2024-01-01');
    await userEvent.type(dateInputs[1] as HTMLInputElement, '2024-12-31');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(searchMemoriesSpy).toHaveBeenCalledWith({
      hashtags: ['tag1', 'tag2', 'tag3'],
      query: 'beach',
      from: '2024-01-01',
      to: '2024-12-31',
    });
  });

  it('shows loading state while search is in progress', async () => {
    let resolveSearch: (value: { isSuccess: true; data: Memory[] }) => void;
    const searchPromise = new Promise<{ isSuccess: true; data: typeof memories }>((resolve) => {
      resolveSearch = resolve;
    });
    const memories = [makeMemoryMock()];
    searchMemoriesSpy.mockReturnValue(searchPromise);

    render(<SearchMemoriesContent />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.getByRole('status')).toBeInTheDocument();

    resolveSearch!({ isSuccess: true, data: memories });
    await expect(screen.findByText(/Showing 1 memory/)).resolves.toBeInTheDocument();
  });

  it('shows results and count when search returns data', async () => {
    const memories = [makeMemoryMock({ title: 'First memory' })];
    searchMemoriesSpy.mockResolvedValue({ isSuccess: true, data: memories });

    render(<SearchMemoriesContent />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(await screen.findByText(/Showing 1 memory/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'First memory' })).toBeInTheDocument();
  });

  it('shows empty state when search returns no results', async () => {
    searchMemoriesSpy.mockResolvedValue({ isSuccess: true, data: [] });

    render(<SearchMemoriesContent />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(await screen.findByText(/No memories match your current filters/)).toBeInTheDocument();
  });

  it('shows error message when search fails', async () => {
    searchMemoriesSpy.mockResolvedValue({
      isSuccess: false,
      error: 'Server error',
    });

    render(<SearchMemoriesContent />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(
      await screen.findByText(/Something went wrong while searching your memories/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Server error/)).toBeInTheDocument();
  });

  it('resets form and state when Reset filters is clicked', async () => {
    searchMemoriesSpy.mockResolvedValue({ isSuccess: true, data: [] });

    render(<SearchMemoriesContent />);
    await userEvent.type(screen.getByPlaceholderText('Search in titles and messages'), 'test');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    await screen.findByText(/No memories match/);

    await userEvent.click(screen.getByRole('button', { name: 'Reset filters' }));

    expect(screen.getByText('Run a search to see your memories here.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search in titles and messages')).toHaveValue('');
  });

  it('shows carousel with prev/next when multiple results', async () => {
    const memories = [
      makeMemoryMock({ title: 'Memory one' }),
      makeMemoryMock({ title: 'Memory two' }),
    ];
    searchMemoriesSpy.mockResolvedValue({ isSuccess: true, data: memories });

    render(<SearchMemoriesContent />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(await screen.findByText(/Showing 2 memories/)).toBeInTheDocument();
    expect(screen.getByText('Memory one')).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: 'Next memory' });
    expect(nextButton).not.toBeDisabled();
    await userEvent.click(nextButton);

    expect(screen.getByText('Memory two')).toBeInTheDocument();

    const prevButton = screen.getByRole('button', { name: 'Previous memory' });
    await userEvent.click(prevButton);
  });

  it('opens lightbox when a result card is clicked and closes on close', async () => {
    const memory = makeMemoryMock({ title: 'Lightbox memory' });
    searchMemoriesSpy.mockResolvedValue({ isSuccess: true, data: [memory] });

    render(<SearchMemoriesContent />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    await screen.findByRole('heading', { level: 3, name: 'Lightbox memory' });

    await userEvent.click(screen.getByText('mock memory for testing purposes'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'Lightbox memory' })).toHaveLength(2);

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('automatically triggers search on mount when hashtags search param is present', async () => {
    const memory = makeMemoryMock({ title: 'Tag search memory' });
    searchMemoriesSpy.mockResolvedValue({ isSuccess: true, data: [memory] });

    const routerMock = jest.requireActual('next-router-mock');
    routerMock.memoryRouter.setCurrentUrl('/search-memories?hashtags=travel');

    render(<SearchMemoriesContent />);

    // Verify input gets prefilled with formatting
    const tagsInput = screen.getByPlaceholderText('e.g. gratitude, family, weekend');
    expect(tagsInput).toHaveValue('travel');

    // Verify search was triggered automatically on mount
    await screen.findByRole('heading', { level: 3, name: 'Tag search memory' });
    expect(searchMemoriesSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        hashtags: ['travel'],
      }),
    );
  });

  it('renders fallback error message when search fails without an explicit error message', async () => {
    searchMemoriesSpy.mockResolvedValue({ isSuccess: false, error: 'unknown error' } as ApiResult<
      Memory[]
    >);

    render(<SearchMemoriesContent />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(
      await screen.findByText(/Something went wrong while searching your memories\. unknown error/),
    ).toBeInTheDocument();
  });

  it('calls scrollBy on carousel container when clicking prev and next', async () => {
    const memories = [
      makeMemoryMock({ title: 'Memory one' }),
      makeMemoryMock({ title: 'Memory two' }),
    ];
    searchMemoriesSpy.mockResolvedValue({ isSuccess: true, data: memories });

    const scrollByMock = jest.fn();
    const originalQuerySelector = HTMLElement.prototype.querySelector;
    // Mock scrollBy on elements
    HTMLElement.prototype.scrollBy = scrollByMock;

    render(<SearchMemoriesContent />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    await screen.findByText(/Showing 2 memories/);

    const nextButton = screen.getByRole('button', { name: 'Next memory' });
    await userEvent.click(nextButton);
    expect(scrollByMock).toHaveBeenCalledWith({ left: 420, behavior: 'smooth' });

    const prevButton = screen.getByRole('button', { name: 'Previous memory' });
    await userEvent.click(prevButton);
    expect(scrollByMock).toHaveBeenCalledWith({ left: -420, behavior: 'smooth' });

    delete (HTMLElement.prototype as Partial<HTMLElement>).scrollBy;
    HTMLElement.prototype.querySelector = originalQuerySelector;
  });

  it('handles spaces and empty tag input correctly', async () => {
    searchMemoriesSpy.mockResolvedValue({ isSuccess: true, data: [] });

    render(<SearchMemoriesContent />);
    await userEvent.type(screen.getByPlaceholderText('e.g. gratitude, family, weekend'), ' ,  , ');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(searchMemoriesSpy).toHaveBeenCalledWith({
      hashtags: [],
      query: undefined,
      from: undefined,
      to: undefined,
    });
  });

  it('handles null data in search status gracefully', async () => {
    searchMemoriesSpy.mockResolvedValue({ isSuccess: true, data: null as unknown as Memory[] });

    render(<SearchMemoriesContent />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(await screen.findByText(/No memories match your current filters/)).toBeInTheDocument();
  });

  it('handles empty string error gracefully', async () => {
    searchMemoriesSpy.mockResolvedValue({ isSuccess: false, error: '' });

    render(<SearchMemoriesContent />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    const errorMsg = await screen.findByText(/Something went wrong while searching your memories/);
    expect(errorMsg).toBeInTheDocument();
  });

  it('uses default fallback "unknown error" when error field is undefined', async () => {
    searchMemoriesSpy.mockResolvedValue({ isSuccess: false } as unknown as ApiResult<Memory[]>);

    render(<SearchMemoriesContent />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(
      await screen.findByText(/Something went wrong while searching your memories\. unknown error/),
    ).toBeInTheDocument();
  });
});
