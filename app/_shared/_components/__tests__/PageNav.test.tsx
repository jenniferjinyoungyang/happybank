import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as NextAuthReactModule from 'next-auth/react';
import mockRouter from 'next-router-mock';
import PageNav from '../PageNav';

describe('PageNav', () => {
  let signOutSpy: jest.SpyInstance<ReturnType<typeof NextAuthReactModule.signOut>>;

  beforeEach(() => {
    signOutSpy = jest
      .spyOn(NextAuthReactModule, 'signOut')
      .mockResolvedValue({ url: 'some-random-url' });
  });

  it('should render correct menu', async () => {
    render(<PageNav />);

    const menuButton = screen.getByRole('button', { name: 'Account' });
    await userEvent.click(menuButton);

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

    expect(mockRouter).toMatchObject({
      pathname: '/some-random-url',
    });
  });

  it('should open mobile menu when hamberger menu button icon is clicked on mobile view', async () => {
    render(<PageNav />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByTestId('mobile-hamberger-menu-button'));

    const withinDialog = within(screen.getByRole('dialog'));

    expect(withinDialog.getByRole('button', { name: 'Account' })).toBeInTheDocument();
  });

  it('should close mobile menu when close menu button is clicked on mobile view', async () => {
    render(<PageNav />);

    await userEvent.click(screen.getByTestId('mobile-hamberger-menu-button'));

    const withinDialog = within(screen.getByRole('dialog'));

    await userEvent.click(withinDialog.getByTestId('close-mobile-menu-button'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
