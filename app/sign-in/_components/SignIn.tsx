'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { demoUserEmail, demoUserPassword } from '../../../test-helper/demoUser';
import { Button } from '../../_shared/_components/Button';
import { GoogleLogo } from '../../_shared/_components/icons/GoogleLogo';
import { HappyBankHeartLogo } from '../../_shared/_components/icons/HappyBankHeartLogo';
import { HappyBankLogo } from '../../_shared/_components/icons/HappyBankLogo';

const SignIn: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm();

  const inputDemoUser = useCallback(() => {
    setValue('email', demoUserEmail);
    setValue('password', demoUserPassword);
  }, [setValue]);

  return (
    <div className="bg-gray-100 text-gray-900 flex justify-center">
      <div className="m-0 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div className="w-full bg-contain bg-center bg-no-repeat bg-cover bg-login-image" />
        </div>
        <div className="h-screen flex p-6 sm:p-12 lg:w-1/2">
          <div className="flex flex-col items-center inline-block align-middle w-full m-auto">
            <div className="hidden h-lg:block">
              <HappyBankLogo />
            </div>
            <div className="flex gap-4 mt-8">
              <div className="block h-lg:hidden">
                <HappyBankHeartLogo />
              </div>
              <h2 className="text-center h-sm:text-xl h-md:text-xl">Welcome to Happy bank!</h2>
            </div>
            <div className="max-w-lg w-full flex-1 mt-8">
              <div className="flex flex-col items-center w-3/4 m-auto">
                <button
                  type="button"
                  onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                  className="w-full inline-flex items-center justify-center py-4 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-200"
                >
                  <GoogleLogo />
                  Continue with Google
                </button>

                <div className="w-full mb-6 h-lg:mt-6 h-lg:mb-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Or
                  </div>
                </div>
              </div>

              <div className="w-3/4 mx-auto">
                <form
                  onSubmit={handleSubmit(async ({ email, password }) => {
                    signIn('credentials', {
                      email,
                      password,
                      callbackUrl: '/dashboard',
                    });
                  })}
                >
                  <div className="relative">
                    <input
                      className="block p-4 w-full text-sm text-gray-900 bg-gray-100 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-0 peer"
                      {...register('email')}
                      type="email"
                      id="email-sign-in"
                      placeholder=""
                    />
                    <label
                      htmlFor="email-sign-in"
                      className="absolute text-sm text-gray-500 font-medium duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:px-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                      Email
                    </label>
                  </div>

                  <div className="relative mt-5">
                    <input
                      className="block p-4 w-full text-sm text-gray-900 bg-gray-100 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-0 peer"
                      {...register('password')}
                      type="password"
                      id="password-sign-in"
                      placeholder=""
                    />
                    <label
                      htmlFor="password-sign-in"
                      className="absolute text-sm text-gray-500 font-medium duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:px-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                      Password
                    </label>
                  </div>
                  <Button type="submit" label="Sign in" cssWrapper="w-full mt-8 h-lg:mt-16" />
                </form>

                <p className="mt-6 text-xs text-gray-600 text-center">
                  Don&apos;t have an account?
                  <Link href="/sign-up" className="ml-1 border-b border-gray-500 border-dotted">
                    Sign up
                  </Link>
                </p>
              </div>
              <div className="flex justify-center">
                <Button
                  type="button"
                  label="Try as a demo user"
                  cssWrapper="mt-8 h-lg:mt-16 bg-transparent text-s text-indigo-500 text-cente outline-none hover:bg-transparent hover:text-red-500"
                  onClick={inputDemoUser}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
