import { FC } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { HappyBankHeartLogo } from '../../_shared/_components/icons/HappyBankHeartLogo';

type SearchMemoriesEmptyStateProps = {
  readonly onClearFilters: () => void;
};

export const SearchMemoriesEmptyState: FC<SearchMemoriesEmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div className="mx-auto flex flex-col items-center text-center w-full max-w-2xl bg-surface-container-lowest p-12 md:p-16 rounded-2xl shadow-[0_10px_40px_rgba(27,27,34,0.06)] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-secondary/5 rounded-full blur-2xl" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

      {/* Illustration Area */}
      <div className="relative w-72 h-72 md:w-80 md:h-80 mb-10 flex items-center justify-center">
        {/* Abstract 'Empty Frame' / 'Magnifying Glass' composition */}
        <div className="absolute inset-0 bg-surface-container-high rounded-[2rem] transform rotate-3 scale-95 opacity-50" />
        <div className="absolute inset-0 bg-surface-container-low border border-outline-variant/30 rounded-2xl transform -rotate-2 shadow-sm flex items-center justify-center overflow-hidden">
          <img
            alt="Illustration of searching for memories"
            className="w-full h-full object-cover opacity-90"
            data-alt="A soft, highly detailed 3D illustration of a magnifying glass gently resting over a softly glowing, blank polaroid photo frame. The style is warm, minimal, and optimistic, using light indigo and soft amber tones on a clean white background. Soft studio lighting creates gentle shadows, emphasizing a premium, uplifting editorial feel."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ2Ud3X0cbYr8gNDD1pQPeSAwoTW_EJWYiEjIy4v3J8g_YB_bG28-5Jd3BiKP-wq5X3e4K5aaaZOpfjQb8AfPv4SzWAY-lCrqjuSZQJtLr1gd9Koitdu8yVjItHl6n3Wz7g7c6Qt737bOKY8RVqvQXoNUBbBggbPWT_zvP8aWk3w7PwzUSisCpE_EYa6R7o172lBaFbHb76IegbnLJuMK6qWM7CiBT-GJFP3DIl6BLydeQQ85vQGUbLw"
          />
        </div>
        {/* Floating Icon Accent */}
        <div className="absolute -bottom-4 -right-4 bg-surface rounded-full p-4 shadow-md border border-outline-variant/10">
          <HappyBankHeartLogo />
        </div>
      </div>

      {/* Typography & Messaging */}
      <h2 className="font-permanent_marker text-3xl md:text-4xl text-on-surface mb-6 mt-2">
        Where did that joy go?
      </h2>
      <p className="text-on-surface-variant text-xl leading-relaxed mb-10 max-w-lg">
        No memories found with these filters. Try adjusting your search to find more joy and revisit
        those special moments.
      </p>

      {/* Call to Action */}
      <button
        type="button"
        onClick={onClearFilters}
        className="bg-gradient-to-r from-primary to-primary-fixed-dim text-on-primary font-semibold text-lg py-4 px-10 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-300 flex items-center gap-3 group cursor-pointer"
      >
        <ArrowPathIcon className="w-6 h-6 group-hover:-rotate-45 transition-transform duration-300" />
        Clear all filters
      </button>
    </div>
  );
};
