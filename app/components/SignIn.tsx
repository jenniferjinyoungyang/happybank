// mark as client component
'use client';

// importing necessary functions
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

const SignIn: React.FC = () => {
  // extracting data from usesession as session
  const { data: session } = useSession();

  // checking if sessions exists
  if (session) {
    // rendering components for logged in users
    return (
      <>
        <p>Welcome {session.user?.name}. Signed In As</p>
        <p>{session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  // rendering components for not log
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="m-0 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div className="w-full bg-contain bg-center bg-no-repeat bg-cover bg-login-image" />
        </div>
        <div className="h-screen flex w-1/2 p-6 sm:p-12">
          <div className="flex flex-col items-center inline-block align-middle m-auto">
            <svg
              width="176.35974827808292"
              height="154.915625"
              viewBox="0 0 250.00000000000003 322.51221625229886"
              className="looka-1j8o68f"
            >
              <defs id="SvgjsDefs6021"></defs>
              <g
                id="SvgjsG6022"
                transform="matrix(6.2507570706825035,0,0,6.2507570706825035,24.9734339724679,-15.640047524963064)"
                fill="#6366f1"
              >
                <g xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="#6366f1"
                    d="M29.193,5.265c-3.629-3.596-9.432-3.671-13.191-0.288   C12.242,1.594,6.441,1.669,2.81,5.265c-3.741,3.704-3.741,9.709,0,13.415c1.069,1.059,11.053,10.941,11.053,10.941   c1.183,1.172,3.096,1.172,4.278,0c0,0,10.932-10.822,11.053-10.941C32.936,14.974,32.936,8.969,29.193,5.265z M27.768,17.268   L16.715,28.209c-0.393,0.391-1.034,0.391-1.425,0L4.237,17.268c-2.95-2.92-2.95-7.671,0-10.591   c2.844-2.815,7.416-2.914,10.409-0.222l1.356,1.22l1.355-1.22c2.994-2.692,7.566-2.594,10.41,0.222   C30.717,9.596,30.717,14.347,27.768,17.268z"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="#6366f1"
                    d="M9.253,7.501c-0.002,0-0.002,0.001-0.004,0.001   c-2.345,0.002-4.246,1.903-4.246,4.249l0,0c0,0.276,0.224,0.5,0.5,0.5s0.5-0.224,0.5-0.5V11.75c0-1.794,1.455-3.249,3.249-3.249   h0.001c0.276,0,0.5-0.224,0.5-0.5S9.53,7.501,9.253,7.501z"
                  ></path>
                </g>
              </g>
              <g
                id="SvgjsG6023"
                transform="matrix(3.766194359903271,0,0,3.766194359903271,-6.025912412534366,172.478157655944)"
                fill="#d2d3fc"
              >
                <path d="M9.96 6.140000000000001 l3.12 0 l0 13.86 l-3.12 0 l0 -5.88 l-5.24 0 l0 5.88 l-3.12 0 l0 -13.86 l3.12 0 l0 5.3 l5.24 0 l0 -5.3 z M25.560000000000002 20 q-0.22 -0.72 -0.49 -1.48 t-0.53 -1.52 l-5.4 0 q-0.26 0.76 -0.53 1.52 t-0.49 1.48 l-3.24 0 q0.78 -2.24 1.48 -4.14 t1.37 -3.58 t1.32 -3.19 t1.35 -2.95 l2.98 0 q0.68 1.44 1.34 2.95 t1.33 3.19 t1.37 3.58 t1.48 4.14 l-3.34 0 z M21.82 9.28 q-0.1 0.3 -0.3 0.82 t-0.46 1.2 t-0.57 1.5 t-0.63 1.72 l3.94 0 q-0.32 -0.9 -0.62 -1.72 t-0.57 -1.5 t-0.47 -1.2 t-0.32 -0.82 z M34.86 5.98 q3.1 0 4.76 1.09 t1.66 3.57 q0 2.5 -1.68 3.61 t-4.8 1.11 l-0.98 0 l0 4.64 l-3.12 0 l0 -13.66 q1.02 -0.2 2.16 -0.28 t2 -0.08 z M35.06 8.64 q-0.34 0 -0.67 0.02 t-0.57 0.04 l0 4 l0.98 0 q1.62 0 2.44 -0.44 t0.82 -1.64 q0 -0.58 -0.21 -0.96 t-0.6 -0.61 t-0.95 -0.32 t-1.24 -0.09 z M47.74 5.98 q3.1 0 4.76 1.09 t1.66 3.57 q0 2.5 -1.68 3.61 t-4.8 1.11 l-0.98 0 l0 4.64 l-3.12 0 l0 -13.66 q1.02 -0.2 2.16 -0.28 t2 -0.08 z M47.940000000000005 8.64 q-0.34 0 -0.67 0.02 t-0.57 0.04 l0 4 l0.98 0 q1.62 0 2.44 -0.44 t0.82 -1.64 q0 -0.58 -0.21 -0.96 t-0.6 -0.61 t-0.95 -0.32 t-1.24 -0.09 z M61.540000000000006 11.84 q0.84 -1.42 1.6 -2.84 t1.4 -2.86 l3.44 0 q-1.14 2.24 -2.36 4.34 t-2.58 4.22 l0 5.3 l-3.12 0 l0 -5.26 q-1.36 -2.12 -2.59 -4.24 t-2.37 -4.36 l3.62 0 q0.64 1.44 1.38 2.86 t1.58 2.84 z"></path>
              </g>
              <g
                id="SvgjsG6024"
                transform="matrix(4.557053952512099,0,0,4.557053952512099,-7.291285889424827,230.74881293111343)"
                fill="#d2d3fc"
              >
                <path d="M6.22 20.18 q-1.14 0 -2.27 -0.07 t-2.35 -0.33 l0 -13.44 q0.96 -0.18 2.1 -0.27 t2.12 -0.09 q1.32 0 2.43 0.19 t1.91 0.65 t1.25 1.21 t0.45 1.85 q0 1.66 -1.6 2.62 q1.32 0.5 1.8 1.36 t0.48 1.94 q0 2.18 -1.59 3.28 t-4.73 1.1 z M4.64 13.96 l0 3.58 q0.34 0.04 0.74 0.06 t0.88 0.02 q1.4 0 2.26 -0.4 t0.86 -1.48 q0 -0.96 -0.72 -1.37 t-2.06 -0.41 l-1.96 0 z M4.64 11.58 l1.52 0 q1.44 0 2.06 -0.37 t0.62 -1.19 q0 -0.84 -0.64 -1.18 t-1.88 -0.34 q-0.4 0 -0.86 0.01 t-0.82 0.05 l0 3.02 z M24.32 20 q-0.22 -0.72 -0.49 -1.48 t-0.53 -1.52 l-5.4 0 q-0.26 0.76 -0.53 1.52 t-0.49 1.48 l-3.24 0 q0.78 -2.24 1.48 -4.14 t1.37 -3.58 t1.32 -3.19 t1.35 -2.95 l2.98 0 q0.68 1.44 1.34 2.95 t1.33 3.19 t1.37 3.58 t1.48 4.14 l-3.34 0 z M20.58 9.28 q-0.1 0.3 -0.3 0.82 t-0.46 1.2 t-0.57 1.5 t-0.63 1.72 l3.94 0 q-0.32 -0.9 -0.62 -1.72 t-0.57 -1.5 t-0.47 -1.2 t-0.32 -0.82 z M38.76 20 q-1.34 -2.38 -2.9 -4.7 t-3.32 -4.38 l0 9.08 l-3.08 0 l0 -13.86 l2.54 0 q0.66 0.66 1.46 1.62 t1.63 2.05 t1.65 2.26 t1.54 2.25 l0 -8.18 l3.1 0 l0 13.86 l-2.62 0 z M52.760000000000005 20 q-0.42 -0.68 -0.99 -1.47 t-1.24 -1.58 t-1.39 -1.52 t-1.44 -1.29 l0 5.86 l-3.12 0 l0 -13.86 l3.12 0 l0 5.24 q1.22 -1.28 2.45 -2.67 t2.29 -2.57 l3.7 0 q-1.42 1.68 -2.85 3.24 t-3.01 3.14 q1.66 1.38 3.21 3.28 t2.97 4.2 l-3.7 0 z"></path>
              </g>
            </svg>
            <h1 className="mt-16 text-2xl xl:text-3xl font-bold">
              Welcome back to Happy bank!
            </h1>
            <div className="w-full flex-1 my-8">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => signIn('google')}
                  className="w-3/4 inline-flex items-center justify-center py-4 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_13183_10121)">
                      <path
                        d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z"
                        fill="#3F83F8"
                      ></path>
                      <path
                        d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z"
                        fill="#34A853"
                      ></path>
                      <path
                        d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z"
                        fill="#FBBC04"
                      ></path>
                      <path
                        d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z"
                        fill="#EA4335"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_13183_10121">
                        <rect
                          width="20"
                          height="20"
                          fill="white"
                          transform="translate(0.5)"
                        ></rect>
                      </clipPath>
                    </defs>
                  </svg>
                  Continue with Google
                </button>
              </div>

              <div className="mt-6 mb-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or
                </div>
              </div>

              <div className="w-3/4 mx-auto">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Email"
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                />
                <p className="mt-2 text-xs text-gray-600 text-right">
                  <a
                    href="#"
                    className="ml-1 border-b border-gray-500 border-dotted"
                  >
                    Forgot your password?
                  </a>
                </p>
                <button className="mt-16 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                  <span className="ml-3">Sign in</span>
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Don't have an acount?
                  <a
                    href="#"
                    className="ml-1 border-b border-gray-500 border-dotted"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
