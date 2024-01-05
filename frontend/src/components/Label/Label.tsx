import React, { useMemo } from 'react';

import styles from './Label.module.scss';

interface LabelProps {
  htmlFor?: string;
  className?: string;
  required?: boolean;
  text?: string;
}

function Label(props: LabelProps) {
  const className = useMemo(() => {
    let str = styles['label'];
    if (props.className) str += ` ${props.className}`;
    return str;
  }, [props.className]);

  return (
    <label className={className} htmlFor={props.htmlFor}>
      {props.text} {props.required && <span className={styles['required']}>*</span>}
    </label>
  );
}

export default Label;
