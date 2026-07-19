import { PropsWithChildren } from 'react';

export const PageContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="mx-auto flex h-screen min-h-0 w-full max-w-[1280px] flex-col">{children}</div>
  );
};
