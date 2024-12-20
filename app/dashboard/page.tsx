'use client';

import { useSession } from 'next-auth/react';
import DashboardHeader from './_components/DashboardHeader';

const Dashboard: React.FC = () => {
  const { status, data: session } = useSession();

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session?.user.id),
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  if (status === 'unauthenticated') {
    return <a href="/">Sign in</a>;
  }

  if (status === 'loading') {
    return <>Loading your happy memories...</>;
  }

  return (
    <>
      <DashboardHeader />
      <button type="button" onClick={() => fetchMemories()}>
        Click
      </button>
    </>
  );
};

export default Dashboard;
