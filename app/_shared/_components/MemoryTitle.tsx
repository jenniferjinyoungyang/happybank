import { FC } from 'react';

type MemoryTitleProps = {
  readonly title: string;
  readonly className?: string;
  readonly as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span';
};

export const MemoryTitle: FC<MemoryTitleProps> = ({
  title,
  className = '',
  as: Component = 'h3',
}) => {
  return (
    <Component
      className={`font-permanent_marker text-xl sm:text-2xl lg:text-3xl text-tertiary -rotate-2 bg-surface-container-lowest px-4 py-1.5 shadow-md shadow-on-surface/5 rounded-md border border-outline-variant/10 select-none ${className}`}
    >
      {title}
    </Component>
  );
};
