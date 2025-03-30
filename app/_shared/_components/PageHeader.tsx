import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { match } from 'ts-pattern';
import PageNav from './PageNav';

const PageHeader: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header className="flex flex-col bg-white h-12 lg:h-28 px-4 lg:px-8 border-b-neutral-200 border-2 pt-2">
      <PageNav>
        {match(pathname)
          .with('/dashboard', () => (
            <h1 className="block lg:hidden text-xl">Welcome, {session?.user?.name}</h1>
          ))
          .with('/create-memory', () => (
            <h1 className="block lg:hidden text-xl">
              {`${new Date().toLocaleDateString(undefined, {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}`}
            </h1>
          ))
          .otherwise(() => null)}
      </PageNav>
      <div className="flex-1 flex items-center">
        {match(pathname)
          .with('/dashboard', () => (
            <h1 className="hidden lg:block">Welcome, {session?.user?.name}</h1>
          ))
          .with('/create-memory', () => (
            <h1 className="hidden lg:block text-xl">
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
