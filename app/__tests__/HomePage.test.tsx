import { render, screen } from '@testing-library/react';
import HomePage from '../page';

describe('HomePage', () => {
  test('renders the component', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: 'Welcome to Happy bank!' })).toBeInTheDocument();
  });
});
