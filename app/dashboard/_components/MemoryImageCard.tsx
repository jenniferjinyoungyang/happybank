import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import { FC } from 'react';
import polaroid from '../../../images/polaroid.png';

type MemoryImageCardProps = {
  imageId: string;
};

export const MemoryImageCard: FC<MemoryImageCardProps> = ({ imageId }) => (
  <div className="relative w-1/3 m-0 overflow-hidden text-gray-700 bg-white bg-clip-border shadow-md rounded-xl shrink-0 mr-12">
    {!imageId && (
      <Image
        src={polaroid.src}
        alt="polaroid icon"
        className="bg-white object-scale-down"
        fill
      />
    )}
    {imageId && (
      <CldImage
        src={imageId}
        sizes="100vw"
        alt="uploaded image"
        className="bg-black w-full h-full object-contain"
        fill
      />
    )}
  </div>
);
