import { FC } from 'react';

type ButtonProps = {
  readonly label: string;
  readonly type: 'button' | 'submit';
  readonly cssWrapper?: string;
  readonly onClick?: () => void;
};
export const Button: FC<ButtonProps> = ({
  label,
  type,
  cssWrapper = '',
  onClick = () => undefined,
}) => (
  <button
    type={type}
    className={`tracking-wide font-semibold bg-indigo-400 text-gray-100 py-3 rounded-lg hover:bg-indigo-600 transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none ${cssWrapper}`}
    onClick={onClick}
  >
    {label}
  </button>
);
