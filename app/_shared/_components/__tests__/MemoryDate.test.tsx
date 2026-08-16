import { render, screen } from '@testing-library/react';
import { MemoryDate } from '../MemoryDate';

describe('MemoryDate', () => {
  it('renders formatted date string for valid date string', () => {
    render(<MemoryDate date="2025-06-15T12:00:00.000Z" className="my-2" />);

    expect(screen.getByText(/June 15, 2025/i)).toBeInTheDocument();
  });

  it('renders formatted date string for valid Date object', () => {
    render(<MemoryDate date={new Date(2024, 11, 25)} />);

    expect(screen.getByText(/December 25, 2024/i)).toBeInTheDocument();
  });

  it('renders Unknown date for invalid date value', () => {
    render(<MemoryDate date="invalid-date-string" />);

    expect(screen.getByText(/Unknown date/i)).toBeInTheDocument();
  });
});
