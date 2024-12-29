'use client';

import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  Cog6ToothIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { SvgIcon } from '../_types/svgIcon';
import { HappyBankHeartLogo } from './icons/HappyBankHeartLogo';

type AccountMenuItem = {
  readonly name: 'Profile' | 'Settings' | 'Log out';
  readonly icon: SvgIcon;
  readonly onClick: () => void;
};

const PageNavBar: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const accountMenuItems: AccountMenuItem[] = useMemo(
    () => [
      {
        name: 'Profile',
        icon: UserIcon,
        onClick: () => undefined,
      },
      {
        name: 'Settings',
        icon: Cog6ToothIcon,
        onClick: () => undefined,
      },
      {
        name: 'Log out',
        icon: ArrowRightStartOnRectangleIcon,
        onClick: async () => {
          const data = await signOut({
            redirect: false,
            callbackUrl: '/',
          });
          router.push(data.url);
        },
      },
    ],
    [router],
  );

  return (
    <>
      <nav aria-label="Global" className="flex max-w-full justify-between">
        <div className="flex lg:flex-1">
          <Link href="/dashboard" className="-m-1.5 p-1.5">
            <span className="sr-only">Happy Bank</span>
            <HappyBankHeartLogo />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative content-center">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
              Account
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 flex-none text-gray-400"
              />
            </PopoverButton>
            <PopoverPanel
              transition
              className="absolute -right-0 top-full z-10 mt-3 w-screen max-w-56 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="p-4">
                {accountMenuItems.map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    onClick={item.onClick}
                    className="group relative size-full flex items-center rounded-lg p-2 text-sm/6 hover:bg-gray-100"
                  >
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-100 group-hover:bg-white">
                      <item.icon
                        aria-hidden="true"
                        className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                      />
                    </div>
                    <div className="flex-auto ">
                      <a href="#" className="block font-semibold text-gray-900">
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                    </div>
                  </button>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
        </PopoverGroup>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Happy Bank</span>
              <HappyBankHeartLogo />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <a
                href="#"
                className="-mx-3 block rounded-lg px-3 pt-6 pb-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Memories
              </a>
              <div className="space-y-2 py-2">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                    Account
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="h-5 w-5 flex-none group-data-[open]:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {accountMenuItems.map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="button"
                        onClick={item.onClick}
                        className="block w-full text-left rounded-lg py-2 pl-6 pr-3 text-sm/7 font-semibold text-gray-900 hover:bg-gray-100"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default PageNavBar;
