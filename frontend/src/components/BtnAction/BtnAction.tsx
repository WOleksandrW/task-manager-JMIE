import React, { useMemo } from 'react';

import { IconType } from 'react-icons';

import styles from './BtnAction.module.scss';

type BtnActionClassType = 'first';

interface BtnActionProps {
  image: IconType;
  colorImg?: string;
  title?: string;
  btnClassType?: BtnActionClassType;
  className?: string;
  onClick?: (() => void) | ((event: React.MouseEvent) => void);
}

function BtnAction(props: BtnActionProps) {
  const className = useMemo(() => {
    let str = styles['btn'];
    if (props.btnClassType) str += ` ${styles[props.btnClassType]}`;
    if (props.className) str += ` ${props.className}`;
    return str;
  }, [props.btnClassType, props.className]);

  return (
    <div className={className} onClick={props.onClick}>
      <props.image size={24} color={props.colorImg} />
      {props.title && <div className={styles['title']}>{props.title}</div>}
    </div>
  );
}

export default BtnAction;
