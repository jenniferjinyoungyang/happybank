/* eslint-disable jsx-a11y/label-has-associated-control */
'use client';

import { FC, FormEvent, useMemo, useState } from 'react';
import { match } from 'ts-pattern';
import { FullComponentSpinner } from '../../_shared/_components/FullComponentSpinner';
import { Memory } from '../../_shared/_types/memory';
import { ApiData, getInitialApiDataStatus, setLoadingStatus } from '../../_shared/_utils/apiData';
import { searchMemories } from '../_api/searchMemories';
import { SearchResultCard } from './SearchResultCard';
import { SearchResultLightbox } from './SearchResultLighbox';

type SearchFormState = {
  readonly hashtagsInput: string;
  readonly query: string;
  readonly from: string;
  readonly to: string;
};

const initialFormState: SearchFormState = {
  hashtagsInput: '',
  query: '',
  from: '',
  to: '',
};

type CarouselState = {
  readonly currentIndex: number;
};

export const SearchMemoriesContent: FC = () => {
  const [formState, setFormState] = useState<SearchFormState>(initialFormState);
  const [searchStatus, setSearchStatus] =
    useState<ApiData<Memory[]>>(getInitialApiDataStatus<Memory[]>());
  const [hasSearched, setHasSearched] = useState(false);
  const [carouselState, setCarouselState] = useState<CarouselState>({ currentIndex: 0 });
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSearched(true);
    setSearchStatus(setLoadingStatus(searchStatus));

    const hashtags =
      formState.hashtagsInput
        .split(',')
        .map((tag) => tag.replace(/^#+/, '').trim())
        .filter((tag) => tag.length > 0) ?? [];

    const result = await searchMemories({
      hashtags,
      query: formState.query || undefined,
      from: formState.from || undefined,
      to: formState.to || undefined,
    });

    if (result.isSuccess) {
      setSearchStatus({
        status: 'loaded',
        data: result.data,
        error: null,
        isLoading: false,
      });
      setCarouselState({ currentIndex: 0 });
    } else {
      setSearchStatus({
        status: 'error',
        data: null,
        error: result.error ?? 'unknown error',
      });
    }
  };

  const resetFilters = () => {
    setFormState(initialFormState);
    setSearchStatus(getInitialApiDataStatus<Memory[]>());
    setHasSearched(false);
    setCarouselState({ currentIndex: 0 });
    setSelectedMemory(null);
  };

  const currentMemory = useMemo(() => {
    if (searchStatus.status !== 'loaded' || !searchStatus.data || searchStatus.data.length === 0) {
      return null;
    }

    return searchStatus.data[carouselState.currentIndex];
  }, [carouselState.currentIndex, searchStatus]);

  const canGoPrev =
    searchStatus.status === 'loaded' &&
    searchStatus.data !== null &&
    carouselState.currentIndex > 0;

  const canGoNext =
    searchStatus.status === 'loaded' &&
    searchStatus.data !== null &&
    carouselState.currentIndex < searchStatus.data.length - 1;

  return (
    <section className="max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-semibold mb-2">Search memories</h1>
        <p className="text-sm lg:text-base text-neutral-600">
          Start by filtering with tags. You can refine your search with text and date filters.
        </p>
      </header>

      <section className="bg-white/60 rounded-xl border border-neutral-200 p-4 md:p-6 shadow-sm mb-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              placeholder="e.g. gratitude, family, weekend"
              value={formState.hashtagsInput}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, hashtagsInput: event.target.value }))
              }
            />
            <p className="mt-1 text-xs text-neutral-500">
              We&apos;ll match memories that use any of these tags.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Search text</label>
            <input
              type="text"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              placeholder="Search in titles and messages"
              value={formState.query}
              onChange={(event) => setFormState((prev) => ({ ...prev, query: event.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">From</label>
              <input
                type="date"
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                value={formState.from}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, from: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">To</label>
              <input
                type="date"
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                value={formState.to}
                onChange={(event) => setFormState((prev) => ({ ...prev, to: event.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="text-sm text-neutral-600 hover:text-neutral-800 underline underline-offset-2"
              onClick={resetFilters}
            >
              Reset filters
            </button>
            <button
              type="submit"
              className="tracking-wide font-semibold bg-indigo-400 text-gray-100 px-6 py-2.5 rounded-lg hover:bg-indigo-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none disabled:bg-neutral-300 text-sm"
            >
              Search
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        {match(searchStatus)
          .with({ status: 'not loaded', isLoading: false }, () =>
            hasSearched ? (
              <p className="text-sm text-neutral-600">No results yet.</p>
            ) : (
              <p className="text-sm text-neutral-600">Run a search to see your memories here.</p>
            ),
          )
          .with({ status: 'not loaded', isLoading: true }, () => <FullComponentSpinner />)
          .with({ status: 'loaded' }, ({ data }) =>
            data && data.length > 0 ? (
              <>
                <div className="flex items-center justify-between text-sm text-neutral-700">
                  <p>
                    Showing {data.length} {data.length === 1 ? 'memory' : 'memories'} that match
                    your filters.
                  </p>
                  {data.length > 1 && (
                    <p>
                      Memory {carouselState.currentIndex + 1} of {data.length}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      canGoPrev &&
                      setCarouselState((prev) => ({
                        currentIndex: Math.max(prev.currentIndex - 1, 0),
                      }))
                    }
                    disabled={!canGoPrev}
                    className="h-10 w-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-default"
                    aria-label="Previous memory"
                  >
                    ‹
                  </button>
                  {currentMemory && (
                    <SearchResultCard
                      memory={currentMemory}
                      onOpen={() => setSelectedMemory(currentMemory)}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      canGoNext &&
                      setCarouselState((prev) => ({
                        currentIndex: Math.min(prev.currentIndex + 1, data.length - 1),
                      }))
                    }
                    disabled={!canGoNext}
                    className="h-10 w-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-default"
                    aria-label="Next memory"
                  >
                    ›
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-neutral-600">
                No memories match your current filters. Try removing a tag or widening the date
                range.
              </p>
            ),
          )
          .with({ status: 'error' }, ({ error }) => (
            <p className="text-sm text-red-600">
              Something went wrong while searching your memories. {error ?? ''}
            </p>
          ))
          .exhaustive()}
      </section>

      <SearchResultLightbox memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
    </section>
  );
};
