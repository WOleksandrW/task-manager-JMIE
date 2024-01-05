import React, { useMemo } from 'react';

import styles from './BoxWithShadow.module.scss';

interface BoxWithShadowProps {
  children: React.ReactNode;
  className?: string;
}

function BoxWithShadow(props: BoxWithShadowProps) {
  const className = useMemo(() => {
    let str = styles['box'];
    if (props.className) str += ` ${props.className}`;
    return str;
  }, [props.className]);

  return <div className={className}>{props.children}</div>;
}

export default BoxWithShadow;
