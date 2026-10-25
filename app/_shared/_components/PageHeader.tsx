'use client';

import { Popover } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ArrowRightStartOnRectangleIcon, CameraIcon } from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { UploadPhotoModal } from './UploadPhotoModal';

const PageHeader: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const isDashboard = pathname === '/dashboard';
  const isMemories = pathname === '/search-memories';

  const userName = session?.user?.name ?? '';
  const userEmail = session?.user?.email ?? '';

  const userNameArray = userName ? userName.split(' ') : [];
  const firstNameInitial = userNameArray.at(0)?.[0].toUpperCase();
  const lastNameInitial = userNameArray.at(-1)?.[0].toUpperCase();

  const shortName = userName
    ? userNameArray[0] + (lastNameInitial ? ` ${lastNameInitial}.` : '')
    : 'HB User';

  const initials = userName ? firstNameInitial + (lastNameInitial ?? '') : 'HB';

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: '/' });
    if (data?.url) {
      router.push(data.url);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full shrink-0 border-b border-[#aeadaa]/15 bg-background/80 shadow-xl shadow-[#2e2f2d]/5 backdrop-blur-md">
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
              <span className="text-2xl font-bold tracking-tighter text-primary font-montserrat">
                Happy Bank
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                className={`font-montserrat text-sm font-medium tracking-tight pb-1 ${
                  isDashboard
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-[#2e2f2d]/70 hover:text-primary transition-colors'
                }`}
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className={`font-montserrat text-sm font-medium tracking-tight pb-1 ${
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
              {({ close }) => (
                <>
                  <Popover.Button
                    data-testid="profile-dropdown-btn"
                    className="flex items-center gap-3 p-1.5 rounded-full hover:bg-surface-container-high transition-all border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-surface-container-lowest shadow-sm group cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-full bg-surface-container-highest overflow-hidden border border-primary/30 relative flex-shrink-0 flex items-center justify-center text-xs font-semibold text-primary">
                      {session?.user?.image ? (
                        <Image
                          alt={userName ? `${userName} profile avatar` : 'User profile avatar'}
                          src={session.user.image}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          unoptimized
                        />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <span className="hidden md:block font-headline text-sm font-semibold text-on-surface pr-1">
                      {shortName}
                    </span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="w-5 h-5 text-on-surface-variant transition-transform duration-200 group-hover:translate-y-0.5 pr-1.5"
                    />
                  </Popover.Button>

                  <Popover.Panel className="absolute right-0 mt-3 w-72 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/15 p-3 z-50 transition-all bg-white text-left">
                    {/* Short Profile Summary Card with Avatar Photo Badge */}
                    <div className="p-3 bg-surface-container-low rounded-xl mb-2 flex items-center gap-3.5 bg-gray-50 border border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          close();
                          setIsUploadModalOpen(true);
                        }}
                        className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/20 flex items-center justify-center bg-surface-container-highest text-xs font-bold text-primary group/avatar cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
                        data-testid="summary-avatar-badge"
                        title="Click to upload profile photo"
                      >
                        {session?.user?.image ? (
                          <Image
                            alt={userName ? `${userName} avatar` : 'User avatar'}
                            src={session.user.image}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover group-hover/avatar:scale-105 transition-transform"
                            unoptimized
                          />
                        ) : (
                          <span>{initials}</span>
                        )}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <CameraIcon className="w-4 h-4" />
                        </div>
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="font-headline font-bold text-sm text-on-surface truncate">
                          {userName || 'HappyBank User'}
                        </p>
                        <p className="text-xs text-on-surface-variant truncate font-body text-gray-500">
                          {userEmail}
                        </p>
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3.5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                          <ArrowRightStartOnRectangleIcon className="w-4 h-4 text-rose-600" />
                        </div>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </Popover.Panel>
                </>
              )}
            </Popover>
          </div>
        </div>
      </nav>

      <UploadPhotoModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </>
  );
};

export default PageHeader;
