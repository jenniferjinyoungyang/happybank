import { render, screen } from '@testing-library/react';
import SignUpPage from '../page';

describe('SignUpPage', () => {
  test('should render SignUpPage', () => {
    render(<SignUpPage />);

    expect(screen.getByRole('heading', { name: 'Create an account' })).toBeInTheDocument();
  });
});
