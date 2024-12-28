import {
  CldImage,
  CldUploadButton,
  CloudinaryUploadWidgetInfo,
} from 'next-cloudinary';
import Image from 'next/image';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import polaroid from '../../../images/polaroid.png';

type UploadImageCardProps = {
  readonly memoryTitle: string;
};

export const UploadImageCard: FC<UploadImageCardProps> = ({ memoryTitle }) => {
  const { setValue, watch } = useFormContext();

  const imageId: string = watch('imageId');

  return (
    <div className="relative flex flex-col overflow-hidden text-gray-700 bg-white shadow-md bg-clip-border rounded-xl shrink-0 p-5">
      <div className="relative h-4/6">
        {!imageId && (
          <Image
            src={polaroid.src}
            alt="polaroid icon"
            className="bg-stone-50 border-solid border-2 border-slate-900 object-scale-down"
            fill
          />
        )}
        {imageId && (
          <CldImage
            src={imageId}
            sizes="100vw"
            alt="uploaded image"
            className="bg-black w-full h-full object-scale-down"
            fill
          />
        )}
      </div>
      <div className="mt-10 text-center font-permanent_marker text-3xl">
        {memoryTitle}
      </div>
      <CldUploadButton
        uploadPreset="ml_default"
        className="mt-auto tracking-wide font-semibold bg-indigo-400 text-gray-100 py-3 rounded-lg hover:bg-indigo-600 transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none"
        signatureEndpoint="/api/sign-cloudinary-params"
        onSuccess={(result) => {
          const imageInfo = result?.info as CloudinaryUploadWidgetInfo;
          setValue('imageId', imageInfo?.public_id);
        }}
      >
        Upload image
      </CldUploadButton>
    </div>
  );
};
