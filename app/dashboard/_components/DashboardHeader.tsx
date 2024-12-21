import { useSession } from 'next-auth/react';
import DashboardNavBar from './DashboardNavBar';

const DashboardHeader: React.FC = () => {
  const { data: session } = useSession();

  return (
    <header className="flex flex-col bg-white h-1/6 lg:px-8 border-b-neutral-200 border-2 pt-2 ">
      <DashboardNavBar />
      <div className="flex-1 flex items-center">
        <div className="text-xl">Welcome back, {session?.user?.name}</div>
      </div>
    </header>
  );
};

export default DashboardHeader;
