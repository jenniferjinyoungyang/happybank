import { FC, ReactNode } from 'react';

type ButtonProps = {
  readonly label: string;
  readonly type: 'button' | 'submit';
  readonly cssWrapper?: string;
  readonly onClick?: () => void;
  readonly disabled?: boolean;
  readonly ariaLabel?: string;
  readonly children?: ReactNode;
  readonly dataTestId?: string;
};
export const Button: FC<ButtonProps> = ({
  label,
  type,
  cssWrapper = '',
  onClick = () => undefined,
  disabled = false,
  ariaLabel,
  children,
  dataTestId,
}) => (
  <button
    type={type}
    aria-label={ariaLabel ?? label}
    disabled={disabled}
    data-testid={dataTestId}
    className={`tracking-wide font-semibold bg-primary text-on-primary py-3 rounded-xl hover:bg-primary-dim disabled:opacity-50 disabled:hover:bg-primary transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none ${cssWrapper}`}
    onClick={onClick}
  >
    {children ?? label}
  </button>
);
