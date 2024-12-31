import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { match } from 'ts-pattern';
import PageNav from './PageNav';

const PageHeader: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header className="flex flex-col bg-white h-1/6 lg:px-8 border-b-neutral-200 border-2 pt-2 ">
      <PageNav />
      <div className="flex-1 flex items-center">
        {match(pathname)
          .with('/dashboard', () => <h1>Welcome back, {session?.user?.name}</h1>)
          .with('/create-memory', () => (
            <h1 className="text-xl">
              {`Save a special memory for ${new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}`}
            </h1>
          ))
          .otherwise(() => (
            <h1>Cannot find the requested page</h1>
          ))}
      </div>
    </header>
  );
};

export default PageHeader;
