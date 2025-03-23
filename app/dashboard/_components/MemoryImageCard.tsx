import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import { FC } from 'react';
import { match, P } from 'ts-pattern';
import polaroid from '../../../public/images/polaroid.png';

type MemoryImageCardProps = {
  imageId: string | null;
};

export const MemoryImageCard: FC<MemoryImageCardProps> = ({ imageId }) => (
  <div className="relative lg:w-1/3 m-0 overflow-hidden text-gray-700 bg-white bg-clip-border shadow-md rounded-xl shrink-0 lg:mr-12 h-72 lg:h-full">
    {match(imageId)
      .with(P.string, (it) => (
        <CldImage
          src={it}
          sizes="100vw"
          alt="uploaded image"
          className="bg-black w-full h-full object-contain"
          fill
        />
      ))
      .with(null, () => (
        <Image src={polaroid.src} alt="polaroid icon" className="bg-white object-scale-down" fill />
      ))
      .exhaustive()}
  </div>
);
