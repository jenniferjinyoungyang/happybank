import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SignOutResponse } from 'next-auth/react';
import * as NextAuthReactModule from 'next-auth/react';
import mockRouter from 'next-router-mock';
import { makeSessionMock } from '../../__mocks__/session.mock';
import PageHeader from '../PageHeader';

jest.mock('next-cloudinary', () => ({
  CldUploadButton: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="cld-upload-btn">{children}</button>
  ),
}));

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

  it('renders the user profile image and short name when one exists', () => {
    const sessionWithImage = {
      ...makeSessionMock(),
      user: {
        ...makeSessionMock().user,
        name: 'Sarah Jenkins',
        image: 'https://example.com/avatar.jpg',
      },
    };

    jest
      .spyOn(NextAuthReactModule, 'useSession')
      .mockReturnValue({ data: sessionWithImage, status: 'authenticated', update: jest.fn() });

    mockRouter.push('/dashboard');
    render(<PageHeader />);

    expect(screen.getByRole('img', { name: 'Sarah Jenkins profile avatar' })).toBeInTheDocument();
    expect(screen.getByText('Sarah J.')).toBeInTheDocument();
    expect(screen.queryByText('SJ')).not.toBeInTheDocument();
  });

  it('renders single word name without initial suffix', () => {
    const sessionSingleName = {
      ...makeSessionMock(),
      user: {
        ...makeSessionMock().user,
        name: 'Sarah',
        image: null,
      },
    };

    jest
      .spyOn(NextAuthReactModule, 'useSession')
      .mockReturnValue({ data: sessionSingleName, status: 'authenticated', update: jest.fn() });

    render(<PageHeader />);

    expect(screen.getByText('Sarah')).toBeInTheDocument();
  });

  it('renders fallback initials and HB User when the user has no name', () => {
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

    expect(screen.getByText('HB User')).toBeInTheDocument();
    expect(screen.getByText('HB')).toBeInTheDocument();
  });

  it('handles user with undefined email', async () => {
    const sessionWithoutEmail = {
      ...makeSessionMock(),
      user: {
        ...makeSessionMock().user,
        email: undefined,
      },
    };

    jest
      .spyOn(NextAuthReactModule, 'useSession')
      .mockReturnValue({ data: sessionWithoutEmail, status: 'authenticated', update: jest.fn() });

    mockRouter.push('/dashboard');
    render(<PageHeader />);

    const profileButton = screen.getByTestId('profile-dropdown-btn');
    await userEvent.click(profileButton);

    expect(screen.getByTestId('summary-avatar-badge')).toBeInTheDocument();
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
  });

  it('calls signOut and navigates when the user signs out from dropdown', async () => {
    const signOutMock = jest
      .spyOn(NextAuthReactModule, 'signOut')
      .mockResolvedValue({ url: '/' } as SignOutResponse);

    mockRouter.push('/dashboard');
    render(<PageHeader />);

    const profileButton = screen.getByTestId('profile-dropdown-btn');
    await userEvent.click(profileButton);

    const signOutButton = await screen.findByRole('button', { name: /Sign Out/i });
    await userEvent.click(signOutButton);

    expect(signOutMock).toHaveBeenCalledWith({ redirect: false, callbackUrl: '/' });
    expect(mockRouter.pathname).toBe('/');
  });

  it('opens UploadPhotoModal pop-up when summary avatar badge is clicked in dropdown and handles close', async () => {
    render(<PageHeader />);

    const avatarButton = screen.getByTestId('profile-dropdown-btn');
    await userEvent.click(avatarButton);

    const uploadPhotoBtn = await screen.findByTestId('summary-avatar-badge');
    await userEvent.click(uploadPhotoBtn);

    const modalTitle = await screen.findByRole('heading', { name: /Upload Profile Photo/i });
    expect(modalTitle).toBeInTheDocument();

    const closeBtn = screen.getByTestId('close-upload-photo-modal');
    await userEvent.click(closeBtn);

    expect(
      screen.queryByRole('heading', { name: /Upload Profile Photo/i }),
    ).not.toBeInTheDocument();
  });
});
