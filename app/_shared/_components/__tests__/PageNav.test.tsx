import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as NextAuthReactModule from 'next-auth/react';
import PageNav from '../PageNav';

describe('PageNav', () => {
  let signOutSpy: jest.SpyInstance<ReturnType<typeof NextAuthReactModule.signOut>>;

  beforeEach(() => {
    signOutSpy = jest.spyOn(NextAuthReactModule, 'signOut');
  });

  it('should render correct menu', async () => {
    render(<PageNav />);

    const menuButton = screen.getByRole('button', { name: 'Account' });
    await userEvent.click(menuButton);

    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument();
  });

  it('should call sign out api when log out button is clicked', async () => {
    render(<PageNav />);

    const menuButton = screen.getByRole('button', { name: 'Account' });
    await userEvent.click(menuButton);

    const logOutButton = screen.getByRole('button', { name: 'Log out' });
    await userEvent.click(logOutButton);

    expect(signOutSpy).toHaveBeenCalledTimes(1);
    expect(signOutSpy).toHaveBeenCalledWith({
      redirect: false,
      callbackUrl: '/',
    });
  });
});
