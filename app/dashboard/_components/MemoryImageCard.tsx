import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import { FC } from 'react';
import { match, P } from 'ts-pattern';
import polaroid from '../../../public/images/polaroid.png';

type MemoryImageCardProps = {
  readonly imageId: string | null;
};

export const MemoryImageCard: FC<MemoryImageCardProps> = ({ imageId }) => (
  <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-surface-container-low shadow-2xl shadow-on-surface/5 transition-transform duration-500 hover:scale-[1.01]">
    {match(imageId)
      .with(P.string, (it) => (
        <CldImage
          src={it}
          sizes="(max-width: 1024px) 100vw, 70vw"
          alt="uploaded image"
          className="h-full w-full object-cover"
          fill
        />
      ))
      .with(null, () => (
        <Image
          src={polaroid.src}
          alt="polaroid icon"
          className="h-full w-full bg-white object-scale-down p-10"
          fill
        />
      ))
      .exhaustive()}
  </div>
);
