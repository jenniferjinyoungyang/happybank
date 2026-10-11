'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import {
  CameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { CldUploadButton, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FC, useState } from 'react';
import { updateProfileImage } from '../_api/updateProfile';
import { Overlay } from './Overlay';

type UploadPhotoModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export const UploadPhotoModal: FC<UploadPhotoModalProps> = ({ isOpen, onClose }) => {
  const { data: session, update } = useSession();
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const userName = session?.user?.name ?? '';
  const currentImage = session?.user?.image ?? null;

  const initials = userName
    ? userName
        .split(' ')
        .map((segment) => segment[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'HB';

  const handleUpdateImage = async (newImageUrl: string | null) => {
    setIsUpdating(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const result = await updateProfileImage(newImageUrl);

    if (result.isSuccess) {
      await update({ image: newImageUrl });
      setSuccessMessage(
        newImageUrl ? 'Profile photo updated successfully!' : 'Profile photo removed.',
      );
    } else {
      setErrorMessage(result.error);
    }
    setIsUpdating(false);
  };

  const handleClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-outline-variant/20 relative overflow-hidden space-y-6">
          {isUpdating && <Overlay />}

          <div className="flex items-center justify-between border-b border-outline-variant/15 pb-4">
            <DialogTitle className="font-headline font-bold text-xl text-on-surface flex items-center gap-2">
              <CameraIcon className="w-6 h-6 text-primary" />
              Upload Profile Photo
            </DialogTitle>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
              data-testid="close-upload-photo-modal"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            {/* Avatar Preview */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-md bg-surface-container-highest flex items-center justify-center relative">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={userName ? `${userName} profile photo` : 'User profile photo'}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <span className="font-montserrat text-4xl font-bold text-primary">{initials}</span>
              )}
            </div>

            <p className="text-sm text-on-surface-variant font-body max-w-xs">
              Upload a new picture to personalize your HappyBank account across the app.
            </p>

            {/* Feedback Messages */}
            {successMessage && (
              <div
                data-testid="modal-success-message"
                className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-medium"
              >
                <CheckCircleIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div
                data-testid="modal-error-message"
                className="w-full flex items-center justify-center gap-2 p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-xs font-medium"
              >
                <ExclamationTriangleIcon className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-2">
              <CldUploadButton
                uploadPreset="ml_default"
                className="flex-1 min-w-[140px] px-5 py-2.5 bg-primary text-white rounded-full font-montserrat font-bold hover:bg-primary/90 transition-all text-sm cursor-pointer shadow-md flex items-center justify-center gap-2"
                signatureEndpoint="/api/sign-cloudinary-params"
                onSuccess={(result) => {
                  const imageInfo = result?.info as CloudinaryUploadWidgetInfo;
                  const url = imageInfo?.secure_url || imageInfo?.public_id;
                  if (url) {
                    handleUpdateImage(url);
                  }
                }}
              >
                <CameraIcon className="w-4 h-4" />
                {currentImage ? 'Change Photo' : 'Upload Photo'}
              </CldUploadButton>

              {currentImage && (
                <button
                  type="button"
                  onClick={() => handleUpdateImage(null)}
                  className="px-4 py-2.5 border border-outline-variant text-outline hover:text-error hover:border-error rounded-full font-montserrat font-semibold transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <TrashIcon className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
