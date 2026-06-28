import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SignOutResponse } from 'next-auth/react';
import * as NextAuthReactModule from 'next-auth/react';
import mockRouter from 'next-router-mock';
import { makeSessionMock } from '../../__mocks__/session.mock';
import PageHeader from '../PageHeader';

describe('PageHeader', () => {
  beforeEach(() => {
    jest
      .spyOn(NextAuthReactModule, 'useSession')
      .mockReturnValue({ data: makeSessionMock(), status: 'authenticated', update: jest.fn() });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('highlights the memories nav link on memory-related routes', () => {
    mockRouter.push('/search-memories');
    render(<PageHeader />);

    const memoriesLink = screen.getByRole('link', { name: 'Memories' });
    const dashboardLink = screen.getByRole('link', { name: 'Dashboard' });

    expect(memoriesLink).toHaveClass('border-b-2', 'border-primary');
    expect(dashboardLink).not.toHaveClass('border-b-2');
  });

  it('renders the user profile image when one exists', () => {
    const sessionWithImage = {
      ...makeSessionMock(),
      user: {
        ...makeSessionMock().user,
        image: 'https://example.com/avatar.jpg',
      },
    };

    jest
      .spyOn(NextAuthReactModule, 'useSession')
      .mockReturnValue({ data: sessionWithImage, status: 'authenticated', update: jest.fn() });

    mockRouter.push('/dashboard');
    render(<PageHeader />);

    expect(screen.getByRole('img', { name: 'Barbie Tester profile avatar' })).toBeInTheDocument();
    expect(screen.queryByText('BT')).not.toBeInTheDocument();
  });

  it('renders fallback initials when the user has no name', () => {
    const sessionWithoutName = {
      ...makeSessionMock(),
      user: {
        ...makeSessionMock().user,
        name: undefined,
      },
    };

    jest
      .spyOn(NextAuthReactModule, 'useSession')
      .mockReturnValue({ data: sessionWithoutName, status: 'authenticated', update: jest.fn() });

    mockRouter.push('/dashboard');
    render(<PageHeader />);

    expect(screen.getByText('HB')).toBeInTheDocument();
  });

  it('renders a fallback image alt when the user has no name', () => {
    const sessionWithoutNameImage = {
      ...makeSessionMock(),
      user: {
        ...makeSessionMock().user,
        name: undefined,
        image: 'https://example.com/avatar.jpg',
      },
    };

    jest.spyOn(NextAuthReactModule, 'useSession').mockReturnValue({
      data: sessionWithoutNameImage,
      status: 'authenticated',
      update: jest.fn(),
    });

    mockRouter.push('/dashboard');
    render(<PageHeader />);

    expect(screen.getByRole('img', { name: 'User profile avatar' })).toBeInTheDocument();
    expect(screen.queryByText('HB')).not.toBeInTheDocument();
  });

  it('calls signOut and navigates when the user signs out', async () => {
    const signOutMock = jest
      .spyOn(NextAuthReactModule, 'signOut')
      .mockResolvedValue({ url: '/' } as SignOutResponse);

    mockRouter.push('/dashboard');
    render(<PageHeader />);

    const profileButton = screen.getByRole('button', { name: 'BT' });
    await userEvent.click(profileButton);

    const signOutButton = await screen.findByRole('button', { name: 'Sign out' });
    await userEvent.click(signOutButton);

    expect(signOutMock).toHaveBeenCalledWith({ redirect: false, callbackUrl: '/' });
    expect(mockRouter.pathname).toBe('/');
  });
});
