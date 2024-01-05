import React from 'react';

import styles from './Preloader.module.scss';

interface PreloaderProps {
  text?: string;
}

function Preloader(props: PreloaderProps) {
  return (
    <div className={styles['preloader']}>
      <div className={styles['container']}>
        <span className={styles['icon']} />
      </div>
      {props.text && <span className={styles['text']}>{props.text}</span>}
    </div>
  );
}

export default Preloader;
