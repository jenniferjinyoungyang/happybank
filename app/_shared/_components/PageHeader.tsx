'use client';

import { Popover } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { match } from 'ts-pattern';

const PageHeader: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';
  const isMemories = pathname === '/search-memories' || pathname === '/create-memory';

  const initials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((segment) => segment[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'HB';

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: '/' });
    if (data?.url) {
      router.push(data.url);
    }
  };

  const pageHeading = match(pathname)
    .with('/dashboard', () => `Welcome, ${session?.user?.name ?? 'Happy Bank'}`)
    .with('/create-memory', () => {
      const date = new Date();
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return `Save a special memory for ${formattedDate}`;
    })
    .otherwise(() => 'Cannot find the requested page');

  return (
    <>
      <nav className="sticky top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-[#aeadaa]/15 shadow-xl shadow-[#2e2f2d]/5">
        <div className="flex justify-between items-center px-8 py-4 mx-auto w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Image
                alt="Happy Bank logo"
                src="/icon.png"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="text-2xl font-bold tracking-tighter text-primary font-headline">
                Happy Bank
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                className={`font-headline text-sm font-medium tracking-tight pb-1 ${
                  isDashboard
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-[#2e2f2d]/70 hover:text-primary transition-colors'
                }`}
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className={`font-headline text-sm font-medium tracking-tight pb-1 ${
                  isMemories
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-[#2e2f2d]/70 hover:text-primary transition-colors'
                }`}
                href="/search-memories"
              >
                Memories
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Popover className="relative">
              <Popover.Button className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary/80">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/20 text-xs font-semibold text-primary/90">
                  {session?.user?.image ? (
                    <Image
                      alt={
                        session.user.name
                          ? `${session.user.name} profile avatar`
                          : 'User profile avatar'
                      }
                      src={session.user.image}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
              </Popover.Button>
              <Popover.Panel className="absolute right-0 mt-2 w-40 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </Popover.Panel>
            </Popover>
          </div>
        </div>
      </nav>
      <div className="px-8 py-4 mx-auto w-full">
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">{pageHeading}</h1>
        {isDashboard ? <h1 className="sr-only">{pageHeading}</h1> : null}
      </div>
    </>
  );
};

export default PageHeader;
