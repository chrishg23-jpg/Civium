import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'danger' | 'ghost';
};

export function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  const className = `btn-${variant}`;
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
