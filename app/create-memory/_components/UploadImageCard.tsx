import { CldImage, CldUploadButton, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { match, P } from 'ts-pattern';
import { Overlay } from '../../_shared/_components/Overlay';
import { PhotoIcon } from '@heroicons/react/24/outline';

type UploadImageCardProps = {
  readonly memoryTitle: string;
  readonly isLoading: boolean;
};

export const UploadImageCard: FC<UploadImageCardProps> = ({ memoryTitle, isLoading }) => {
  const { setValue, watch } = useFormContext();

  const imageId: string | null = watch('imageId');

  return (
    <div
      className="relative overflow-hidden rounded-2xl 4xl:rounded-3xl bg-surface-container-low min-h-[400px] 4xl:min-h-[600px] flex items-center justify-center border-2 border-dashed border-outline-variant/50 lg:col-span-5 xl:col-span-6 4xl:col-span-7 h-full"
      data-testid="upload-image-card"
    >
      {isLoading && <Overlay />}
      {match(imageId)
        .with(P.string, (it) => (
          <div className="relative z-10 w-full h-full min-h-[400px] 4xl:min-h-[600px] flex flex-col items-center justify-between p-6 4xl:p-10">
            <div className="relative w-full flex-grow min-h-[300px] 4xl:min-h-[500px] rounded-xl overflow-hidden shadow-md">
              <CldImage
                src={it}
                sizes="(max-width: 1024px) 100vw, 50vw"
                alt="uploaded image"
                className="object-cover w-full h-full"
                fill
              />
            </div>
            {memoryTitle ? (
              <div className="my-4 text-center font-permanent_marker text-2xl 4xl:text-4xl text-on-surface">
                {memoryTitle}
              </div>
            ) : null}
            <div className="mt-4 flex gap-4 items-center">
              <CldUploadButton
                uploadPreset="ml_default"
                className="px-6 py-2.5 border-2 border-primary text-primary rounded-full font-montserrat font-bold hover:bg-primary hover:text-white transition-all text-sm 4xl:text-lg cursor-pointer"
                signatureEndpoint="/api/sign-cloudinary-params"
                onSuccess={(result) => {
                  const imageInfo = result?.info as CloudinaryUploadWidgetInfo;
                  setValue('imageId', imageInfo?.public_id);
                }}
              >
                Change Photo
              </CldUploadButton>
              <button
                type="button"
                onClick={() => setValue('imageId', null)}
                className="px-6 py-2.5 border border-outline-variant text-outline hover:text-error hover:border-error rounded-full font-montserrat font-bold transition-all text-sm 4xl:text-lg cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ))
        .with(null, () => (
          <div className="text-center space-y-4 4xl:space-y-8 px-8 z-10">
            <span className="flex justify-center">
              <PhotoIcon className="h-10 w-10 text-gray-500" />
            </span>

            <h3 className="font-montserrat text-2xl 4xl:text-4xl text-on-surface-variant font-bold">
              Add a Visual Memory
            </h3>
            <p className="text-on-surface-variant/70 text-base 4xl:text-2xl max-w-lg mx-auto font-hind leading-relaxed">
              Drag and drop a photo that captures this moment, or click to browse your files.
            </p>
            {memoryTitle ? (
              <div className="font-permanent_marker text-xl 4xl:text-3xl text-primary py-1">
                {memoryTitle}
              </div>
            ) : null}
            <CldUploadButton
              uploadPreset="ml_default"
              className="mt-4 inline-block px-8 4xl:px-12 py-3 4xl:py-5 border-2 border-primary text-primary rounded-full font-montserrat font-bold hover:bg-primary hover:text-white transition-all text-base 4xl:text-xl cursor-pointer shadow-sm hover:shadow-md"
              signatureEndpoint="/api/sign-cloudinary-params"
              onSuccess={(result) => {
                const imageInfo = result?.info as CloudinaryUploadWidgetInfo;
                setValue('imageId', imageInfo?.public_id);
              }}
            >
              Upload Photo
            </CldUploadButton>
          </div>
        ))
        .exhaustive()}
    </div>
  );
};
