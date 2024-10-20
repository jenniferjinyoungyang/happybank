'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') {
    return <a href="/">Sign in</a>;
  }

  if (status === 'loading') {
    return <>Loading your happy memories...</>;
  }

  return (
    <>
      <h1>HELLO {session?.user?.name}! YOU&apos;RE SIGNED IN</h1>
      <button
        type="button"
        onClick={async () => {
          const data = await signOut({ redirect: false, callbackUrl: '/' });
          router.push(data.url);
        }}
      >
        Sign out
      </button>
    </>
  );
};

export default Dashboard;
