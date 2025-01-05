import { FC } from 'react';
import { Spinner } from './icons/Spinner';

export const FullPageSpinner: FC = () => (
  <div className="h-screen flex flex-col justify-center items-center">
    <div role="status">
      <Spinner />
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);
