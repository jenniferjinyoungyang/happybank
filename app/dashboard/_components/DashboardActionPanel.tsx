import { ChevronRightIcon, PhotoIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC } from 'react';

type DashboardActionPanelProps = {
  readonly handleRecallMemory?: () => void;
};

const quickActionButtonClass =
  'group flex w-full items-center gap-3 rounded-full px-4 py-3 text-left transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

/** Right-sidebar quick actions: deposit a new memory and recall a random one. */
export const DashboardActionPanel: FC<DashboardActionPanelProps> = ({ handleRecallMemory }) => (
  <section aria-labelledby="quick-actions-heading" className="flex flex-col lg:w-1/4">
    <h3
      id="quick-actions-heading"
      className="mb-3 text-xs font-medium tracking-widest text-on-surface-variant uppercase"
    >
      Quick Actions
    </h3>

    <div className="flex flex-col gap-3 rounded-3xl bg-surface-container p-3">
      <Link
        href="/create-memory"
        className={`${quickActionButtonClass} bg-gradient-to-r from-primary to-[#8b7fd4] focus-visible:ring-primary`}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-dim/40">
          <PhotoIcon aria-hidden="true" className="h-5 w-5 text-on-primary" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-on-primary">Deposit memory</span>
          <span className="block text-sm text-on-primary/90">Let&apos;s save a new memory</span>
        </span>
        <ChevronRightIcon
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-on-primary/90 transition-transform group-hover:translate-x-0.5"
        />
      </Link>

      <button
        type="button"
        className={`${quickActionButtonClass} bg-gradient-to-r from-secondary-fixed to-[#f5a623] focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50`}
        disabled={!handleRecallMemory}
        onClick={handleRecallMemory}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed-dim/50">
          <SparklesIcon aria-hidden="true" className="h-5 w-5 text-on-surface" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-on-surface">Recall</span>
          <span className="block text-sm text-on-surface/80">Let&apos;s find a memory</span>
        </span>
        <ChevronRightIcon
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-on-surface/70 transition-transform group-enabled:group-hover:translate-x-0.5"
        />
      </button>
    </div>
  </section>
);
