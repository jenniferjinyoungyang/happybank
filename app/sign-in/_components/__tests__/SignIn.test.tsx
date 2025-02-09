import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as NextAuthModule from 'next-auth/react';
import SignIn from '../SignIn';

jest.mock('next-auth/react');

describe('SignIn', () => {
  let signInSpy: jest.SpyInstance<ReturnType<typeof NextAuthModule.signIn>>;

  beforeEach(() => {
    signInSpy = jest.spyOn(NextAuthModule, 'signIn');
  });

  it('renders the component', () => {
    render(<SignIn />);
    expect(screen.getByRole('heading', { name: 'Welcome to Happy bank!' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeInTheDocument();

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();

    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/sign-up');
  });

  it('calls signIn with Google provider when Google button is clicked', async () => {
    render(<SignIn />);
    await userEvent.click(screen.getByText('Continue with Google'));
    expect(signInSpy).toHaveBeenCalledWith('google', { callbackUrl: '/dashboard' });
  });

  it('calls signIn with credentials when form is submitted', async () => {
    render(<SignIn />);
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.click(screen.getByText('Sign in'));

    expect(signInSpy).toHaveBeenCalledTimes(1);
    expect(signInSpy).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      password: 'password',
      callbackUrl: '/dashboard',
    });
  });
});
