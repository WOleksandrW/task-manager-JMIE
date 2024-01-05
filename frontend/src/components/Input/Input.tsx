import React, { useMemo } from 'react';

import styles from './Input.module.scss';

interface InputProps {
  id?: string;
  type?: string;
  className?: string;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  styleType?: 'invalid';
  onBlur?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

function Input(props: InputProps) {
  const { className, styleType, type = 'text', ...rest } = props;

  const inputClassName = useMemo(() => {
    let str = styles['input'];
    if (className) str += ` ${className}`;
    if (styleType) str += ` ${styles[styleType]}`;
    return str;
  }, [className, styleType]);

  return <input className={inputClassName} type={type} {...rest} />;
}

export default Input;
