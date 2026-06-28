import { PropsWithChildren } from 'react';

export const PageContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="mx-auto max-w-[1280px] ">{children}</div>;
};
