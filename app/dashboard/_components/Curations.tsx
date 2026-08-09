import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import polaroid from '../../../public/images/polaroid.png';
import { TopHashtag } from '../_api/getCurations';

type CurationsProps = {
  readonly curations: TopHashtag[];
};

export const Curations: FC<CurationsProps> = ({ curations }) => {
  if (curations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
          Curations
        </h2>
        <Link className="text-xs font-bold text-primary hover:underline" href="/search-memories">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {curations.map((tag) => {
          const formattedName = `#${tag.name}`;

          return (
            <Link
              key={tag.id}
              href={`/search-memories?hashtags=${encodeURIComponent(tag.name)}`}
              className="flex items-center gap-4 p-3 hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high relative">
                {tag.imageId ? (
                  <CldImage
                    src={tag.imageId}
                    sizes="64px"
                    alt={tag.name}
                    className="w-full h-full object-cover"
                    fill
                  />
                ) : (
                  <Image
                    src={polaroid.src}
                    alt="polaroid icon"
                    className="w-full h-full bg-white object-scale-down p-3"
                    fill
                  />
                )}
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                  {formattedName}
                </h4>
                <span className="text-xs text-on-surface-variant">
                  {tag.count} {tag.count === 1 ? 'memory' : 'memories'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
