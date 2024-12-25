import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import PageNavBar from './PageNavBar';

const PageHeader: React.FC = () => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const isDashboard = pathName === '/dashboard';

  return (
    <header className="flex flex-col bg-white h-1/6 lg:px-8 border-b-neutral-200 border-2 pt-2 ">
      <PageNavBar />
      <div className="flex-1 flex items-center">
        {isDashboard && (
          <div className="text-xl">Welcome back, {session?.user?.name}</div>
        )}
        {!isDashboard && (
          <div className="text-xl">
            {`Save a special memory for ${new Date().toDateString()}`}
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
