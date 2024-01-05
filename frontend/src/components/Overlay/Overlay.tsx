import React from 'react';

import styles from './Overlay.module.scss';

interface OverlayProps {
  children?: React.ReactNode;
  isVisible: boolean;
  onClick: () => void;
}

function Overlay(props: OverlayProps) {
  return (
    <>
      {props.isVisible && (
        <div className={styles['overlay']}>
          <div className={styles['back']} onClick={props.onClick}></div>
          {props.children}
        </div>
      )}
    </>
  );
}

export default Overlay;
