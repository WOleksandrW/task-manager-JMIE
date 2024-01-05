import React, { useMemo } from 'react';

import styles from './Button.module.scss';

interface ButtonProps {
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  form?: string;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
  styleButton?: 'primary' | 'danger';
}

function Button(props: ButtonProps) {
  const { children, className, styleButton, ...rest } = props;

  const buttonClassName = useMemo(() => {
    let str = styles['button'];
    if (styleButton) str += ` ${styles[styleButton]}`;
    if (className) str += ` ${className}`;
    return str;
  }, [styleButton, className]);

  return (
    <button className={buttonClassName} {...rest}>
      {children}
    </button>
  );
}

export default Button;
