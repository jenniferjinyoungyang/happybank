import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchMemoriesEmptyState } from '../SearchMemoriesEmptyState';

describe('SearchMemoriesEmptyState', () => {
  it('renders title, description, and illustration image', () => {
    render(<SearchMemoriesEmptyState onClearFilters={jest.fn()} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Where did that joy go?' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'No memories found with these filters. Try adjusting your search to find more joy and revisit those special moments.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByAltText('Illustration of searching for memories')).toBeInTheDocument();
  });

  it('calls onClearFilters when clicking Clear all filters button', async () => {
    const handleClearFilters = jest.fn();
    render(<SearchMemoriesEmptyState onClearFilters={handleClearFilters} />);

    const clearButton = screen.getByRole('button', { name: /Clear all filters/i });
    await userEvent.click(clearButton);

    expect(handleClearFilters).toHaveBeenCalledTimes(1);
  });
});
