import { render, screen } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import CreateMemoryPage from '../page';

describe('CreateMemoryPage', () => {
  it('should render create memory panel and footer', () => {
    render(
      <SessionProvider>
        <CreateMemoryPage />
      </SessionProvider>,
    );

    expect(screen.getByRole('form', { name: 'create-memory-form' })).toBeInTheDocument();

    expect(screen.getByRole('contentinfo')).toHaveTextContent('HappyBank');
  });
});
