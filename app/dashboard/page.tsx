'use client';

import { useSession } from 'next-auth/react';
import DashboardHeader from './_components/DashboardHeader';

const Dashboard: React.FC = () => {
  const { status } = useSession();

  if (status === 'unauthenticated') {
    return <a href="/">Sign in</a>;
  }

  if (status === 'loading') {
    return <>Loading your happy memories...</>;
  }

  return <DashboardHeader />;
};

export default Dashboard;
