import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockRouter from 'next-router-mock';
import { makeApiSuccessMock } from '../../../../test-helper/makeMock';
import * as CreateUserModule from '../../_api/createUser';
import { SignUp } from '../SignUp';

jest.mock('../../_api/createUser');

describe('SignUp', () => {
  let createUserSpy: jest.SpyInstance<ReturnType<typeof CreateUserModule.createUser>>;

  beforeEach(() => {
    createUserSpy = jest
      .spyOn(CreateUserModule, 'createUser')
      .mockResolvedValue(makeApiSuccessMock(null));
  });

  test('renders SignUp', () => {
    render(<SignUp />);

    expect(screen.getByRole('heading', { name: 'Create an account' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create an account' })).toBeInTheDocument();

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('allows user to type in input fields and submit the form', async () => {
    render(<SignUp />);
    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    await userEvent.type(fullNameInput, 'test user');
    await userEvent.type(emailInput, 'testuser@example.com');
    await userEvent.type(passwordInput, 'password123!');

    expect(fullNameInput).toHaveValue('test user');
    expect(emailInput).toHaveValue('testuser@example.com');
    expect(passwordInput).toHaveValue('password123!');

    const submitButton = screen.getByRole('button', { name: 'Create an account' });

    await userEvent.click(submitButton);

    expect(createUserSpy).toHaveBeenCalledTimes(1);
    expect(createUserSpy).toHaveBeenCalledWith({
      name: 'test user',
      email: 'testuser@example.com',
      password: 'password123!',
    });

    expect(mockRouter).toMatchObject({
      pathname: '/sign-in',
    });
  });

  test('shows error message when create user fails', async () => {
    createUserSpy.mockResolvedValueOnce({
      isSuccess: false,
      error: 'User already exists',
    });

    render(<SignUp />);
    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    await userEvent.type(fullNameInput, 'test user');
    await userEvent.type(emailInput, 'testuser@example.com');
    await userEvent.type(passwordInput, 'password123!');

    const submitButton = screen.getByRole('button', { name: 'Create an account' });
    await userEvent.click(submitButton);

    expect(createUserSpy).toHaveBeenCalledTimes(1);
    expect(createUserSpy).toHaveBeenCalledWith({
      name: 'test user',
      email: 'testuser@example.com',
      password: 'password123!',
    });

    expect(screen.getByText('User already exists')).toBeInTheDocument();
  });
  test('shows validation errors for empty fields', async () => {
    render(<SignUp />);
    const submitButton = screen.getByRole('button', { name: 'Create an account' });

    await userEvent.click(submitButton);

    expect(screen.getByTestId('name-input-validation-error')).toHaveTextContent(
      'This field is required.',
    );
    expect(screen.getByTestId('email-input-validation-error')).toHaveTextContent(
      'This field is required.',
    );
    expect(screen.getByTestId('name-input-validation-error')).toHaveTextContent(
      'This field is required.',
    );
  });

  test('shows validation error for invalid email', async () => {
    render(<SignUp />);
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Create an account' });

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.click(submitButton);

    expect(screen.getByTestId('email-input-validation-error')).toHaveTextContent(
      'Please enter a valid email.',
    );
  });

  test('shows validation error for invalid password', async () => {
    render(<SignUp />);
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Create an account' });

    await userEvent.type(passwordInput, 'short');
    await userEvent.click(submitButton);

    expect(screen.getByTestId('password-input-validation-error')).toHaveTextContent(
      'Password must be at least 6 characters long and include at least one special character and one number.',
    );

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'longbutnospecialchar123');
    await userEvent.click(submitButton);

    expect(screen.getByTestId('password-input-validation-error')).toHaveTextContent(
      'Password must be at least 6 characters long and include at least one special character and one number.',
    );

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'longbutnonumber!');
    await userEvent.click(submitButton);

    expect(screen.getByTestId('password-input-validation-error')).toHaveTextContent(
      'Password must be at least 6 characters long and include at least one special character and one number.',
    );
  });
});
