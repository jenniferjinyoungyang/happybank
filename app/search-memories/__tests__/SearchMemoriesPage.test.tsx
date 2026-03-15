import { render, screen } from '@testing-library/react';
import * as NextAuthReactModule from 'next-auth/react';
import { makeSessionMock } from '../../_shared/__mocks__/session.mock';
import SearchMemoriesPage from '../page';

describe('SearchMemoriesPage', () => {
  let useSessionSpy: jest.SpyInstance<ReturnType<typeof NextAuthReactModule.useSession>>;

  beforeEach(() => {
    useSessionSpy = jest.spyOn(NextAuthReactModule, 'useSession');
  });

  it('asks user to sign in when unauthenticated', () => {
    useSessionSpy.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });

    render(<SearchMemoriesPage />);

    expect(screen.getByText('You need to sign in to search your memories.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/sign-in');
  });

  it('shows loading spinner while session is loading', () => {
    useSessionSpy.mockReturnValue({
      data: null,
      status: 'loading',
      update: jest.fn(),
    });

    render(<SearchMemoriesPage />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders search content when authenticated', () => {
    useSessionSpy.mockReturnValue({
      data: makeSessionMock(),
      status: 'authenticated',
      update: jest.fn(),
    });

    render(<SearchMemoriesPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Search memories' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });
});
