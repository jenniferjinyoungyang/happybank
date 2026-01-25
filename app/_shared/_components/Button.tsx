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
    className={`tracking-wide font-semibold bg-indigo-400 text-gray-100 py-3 rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-400 transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none ${cssWrapper}`}
    onClick={onClick}
  >
    {children ?? label}
  </button>
);
