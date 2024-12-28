import {
  CldImage,
  CldUploadButton,
  CloudinaryUploadWidgetInfo,
} from 'next-cloudinary';
import { FC, useState } from 'react';
import polaroid from '../../../images/polaroid.png';

type UploadImageCardProps = {
  readonly memoryTitle: string;
};

export const UploadImageCard: FC<UploadImageCardProps> = ({ memoryTitle }) => {
  const [uploadedImageInfo, setUploadedImageInfo] = useState<
    CloudinaryUploadWidgetInfo | undefined
  >(undefined);

  return (
    <div className="relative flex flex-col overflow-hidden text-gray-700 bg-white shadow-md bg-clip-border rounded-xl shrink-0 p-5">
      {!uploadedImageInfo && (
        <img
          src={polaroid.src}
          alt="polaroid icon"
          className="object-scale-down h-4/6 border-solid border-2  bg-stone-50 border-slate-900"
        />
      )}
      {uploadedImageInfo && (
        <div className="relative h-4/6">
          <CldImage
            src={`${uploadedImageInfo.public_id}`}
            sizes="100vw"
            alt="uploaded image"
            className="bg-black w-full h-full object-contain"
            fill
          />
        </div>
      )}
      <div className="mt-10 text-center font-permanent_marker text-3xl">
        {memoryTitle}
      </div>
      <CldUploadButton
        uploadPreset="ml_default"
        className="mt-auto tracking-wide font-semibold bg-indigo-400 text-gray-100 py-3 rounded-lg hover:bg-indigo-600 transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none"
        signatureEndpoint="/api/sign-cloudinary-params"
        onSuccess={(result) => {
          setUploadedImageInfo(result?.info as CloudinaryUploadWidgetInfo);
        }}
      >
        Upload image
      </CldUploadButton>
    </div>
  );
};
