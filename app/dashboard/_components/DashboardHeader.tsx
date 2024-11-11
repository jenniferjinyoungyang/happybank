import { useSession } from 'next-auth/react';
import DashboardNavBar from './DashboardNavBar';

const DashboardHeader: React.FC = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-white mx-auto p-6 lg:px-8">
      <DashboardNavBar />
      <h1 className="py-10">Welcome back, {session?.user?.name}</h1>
    </header>
  );
};

export default DashboardHeader;
