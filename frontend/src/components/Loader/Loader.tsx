import React, { useMemo } from 'react';

import { ReactComponent as LoaderImg } from '../../assets/loader/three-dots.svg';

import styles from './Loader.module.scss';

interface LoaderProps {
  className?: string;
}

function Loader(props: LoaderProps) {
  const className = useMemo(() => {
    let str = styles['bg'];
    if (props.className) str += ` ${props.className}`;
    return str;
  }, [props.className]);

  return (
    <div className={className}>
      <LoaderImg className={styles['loader']} />
    </div>
  );
}

export default Loader;
