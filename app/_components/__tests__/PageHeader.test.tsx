import { render, screen } from '@testing-library/react';
import * as NextAuthReactModule from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';
import mockRouter from 'next-router-mock';
import PageHeader from '../PageHeader';
import { makeSessionMock } from '../__mocks__/sessionMock';

describe('PageHeader', () => {
  beforeEach(() => {
    jest
      .spyOn(NextAuthReactModule, 'useSession')
      .mockReturnValue({ data: makeSessionMock(), status: 'authenticated', update: jest.fn() });
  });

  it('renders dashboard page header text', () => {
    mockRouter.push('/dashboard');
    render(
      <SessionProvider>
        <PageHeader />
      </SessionProvider>,
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Welcome back, Barbie Tester',
    );
  });

  it('renders create-memory page header text', () => {
    mockRouter.push('/create-memory');
    render(
      <SessionProvider>
        <PageHeader />
      </SessionProvider>,
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Save a special memory for Monday, December 30, 2024',
    );
  });

  it('renders unknown page header text', () => {
    mockRouter.push('/some-random-pathname');
    render(
      <SessionProvider>
        <PageHeader />
      </SessionProvider>,
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Cannot find the requested page',
    );
  });
});
