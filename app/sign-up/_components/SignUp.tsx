'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '../../_shared/_components/Button';
import { GoogleLogo } from '../../_shared/_components/icons/GoogleLogo';
import { HappyBankLogo } from '../../_shared/_components/icons/HappyBankLogo';

export const SignUp: React.FC = () => {
  const { register } = useForm();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="m-0 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div className="w-full bg-contain bg-center bg-no-repeat bg-cover bg-login-image" />
        </div>
        <div className="h-screen flex w-1/2 p-6 sm:p-12">
          <div className="flex flex-col items-center inline-block align-middle w-2/3 m-auto">
            <HappyBankLogo />
            <h2 className="my-16">Create an account</h2>
            <div className="max-w-lg w-full flex-1 my-8">
              <div className="w-3/4 mx-auto">
                <form>
                  <div className="relative">
                    <input
                      className="block p-4 w-full text-sm text-gray-900 bg-gray-100 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-0 peer"
                      {...register('fullName')}
                      type="full-name"
                      id="full-name-sign-up"
                      placeholder=""
                    />
                    <label
                      htmlFor="full-name-sign-up"
                      className="absolute text-sm text-gray-500 font-medium duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:px-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                      Full Name
                    </label>
                  </div>
                  <div className="relative mt-5">
                    <input
                      className="block p-4 w-full text-sm text-gray-900 bg-gray-100 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-0 peer"
                      {...register('email')}
                      type="email"
                      id="email-sign-up"
                      placeholder=""
                    />
                    <label
                      htmlFor="email-sign-up"
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
                      id="password-sign-up"
                      placeholder=""
                    />
                    <label
                      htmlFor="password-sign-up"
                      className="absolute text-sm text-gray-500 font-medium duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:px-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                      Password
                    </label>
                  </div>
                  <Button type="submit" label="Create an account" cssWrapper="w-full mt-16" />
                </form>
              </div>

              <div className="flex flex-col items-center w-3/4 m-auto">
                <div className="w-full mt-6 mb-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Or
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                  className="w-full inline-flex items-center justify-center py-4 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-200"
                >
                  <GoogleLogo />
                  Continue with Google
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Already have an account?
                  <Link href="/sign-in" className="ml-1 border-b border-gray-500 border-dotted">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
