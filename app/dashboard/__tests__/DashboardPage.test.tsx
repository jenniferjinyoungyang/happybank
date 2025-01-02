import { render, screen } from '@testing-library/react';
import * as NextAuthReactModule from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';
import mockRouter from 'next-router-mock';
import { makeSessionMock } from '../../_shared/__mocks__/session.mock';
import DashboardPage from '../page';

describe('DashboardPage', () => {
  let useSessionSpy: jest.SpyInstance<ReturnType<typeof NextAuthReactModule.useSession>>;

  beforeEach(() => {
    useSessionSpy = jest.spyOn(NextAuthReactModule, 'useSession');
  });

  it('should ask user to sign in if unauthenticated', () => {
    useSessionSpy.mockReturnValueOnce({ data: null, status: 'unauthenticated', update: jest.fn() });

    render(<DashboardPage />);
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should display loading message while authenticating', () => {
    useSessionSpy.mockReturnValueOnce({ data: null, status: 'loading', update: jest.fn() });

    render(<DashboardPage />);
    expect(screen.getByText('Loading your happy memories...')).toBeInTheDocument();
  });

  it('should load correct title when successfully authenticated', () => {
    useSessionSpy.mockReturnValue({
      data: makeSessionMock(),
      status: 'authenticated',
      update: jest.fn(),
    });

    mockRouter.push('/dashboard');

    render(
      <SessionProvider>
        <DashboardPage />
      </SessionProvider>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Welcome back, Barbie Tester',
    );
  });

  it('should render a footer', () => {
    useSessionSpy.mockReturnValueOnce({ data: null, status: 'unauthenticated', update: jest.fn() });

    render(<DashboardPage />);
    expect(screen.getByRole('contentinfo')).toHaveTextContent('HappyBank');
  });
});
