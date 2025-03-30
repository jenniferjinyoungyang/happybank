import { render, screen } from '@testing-library/react';
import * as NextAuthReactModule from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';
import mockRouter from 'next-router-mock';
import { makeSessionMock } from '../../__mocks__/session.mock';
import PageHeader from '../PageHeader';

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

    expect(
      screen.getAllByRole('heading', { level: 1, name: 'Welcome, Barbie Tester' }),
    ).toHaveLength(2);
  });

  it('renders create-memory page header text', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-12-30T10:00:00.000-05:00'));

    mockRouter.push('/create-memory');
    render(
      <SessionProvider>
        <PageHeader />
      </SessionProvider>,
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Save a special memory for Monday, December 30, 2024',
      }),
    ).toBeInTheDocument();

    jest.useRealTimers();
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
