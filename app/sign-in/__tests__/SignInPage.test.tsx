import { render, screen } from '@testing-library/react';
import SignInPage from '../page';

describe('SignInPage', () => {
  test('renders the component', () => {
    render(<SignInPage />);
    expect(screen.getByRole('heading', { name: 'Welcome to Happy bank!' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });
});
