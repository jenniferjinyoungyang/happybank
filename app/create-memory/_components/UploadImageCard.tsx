import { FC } from 'react';
import polaroid from '../../../images/polaroid.png';
import { Button } from '../../_components/Button';

type UploadImageCardProps = {
  readonly memoryTitle: string;
};

export const UploadImageCard: FC<UploadImageCardProps> = ({ memoryTitle }) => (
  <div className="relative flex flex-col overflow-hidden text-gray-700 bg-white shadow-md bg-clip-border rounded-xl shrink-0 p-5">
    <img
      src={polaroid.src}
      alt="polaroid icon"
      className="object-scale-down h-3/4 border-solid border-2 shadow-[rgba(0,0,15,0.5)_2px_2px_2px_0px] border-slate-900"
    />
    <div className="mt-5 text-center">{memoryTitle}</div>
    <Button type="submit" label="Upload image" cssWrapper="mt-auto" />
  </div>
);
