import { FC } from 'react';
import { Spinner } from './icons/Spinner';

type FullComponentSpinnerProps = {
  readonly size?: number;
};

export const FullComponentSpinner: FC<FullComponentSpinnerProps> = ({ size = 20 }) => (
  <div
    className={`absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 w-${size} h-${size} z-20`}
  >
    <div role="status">
      <Spinner size={size} />
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);
