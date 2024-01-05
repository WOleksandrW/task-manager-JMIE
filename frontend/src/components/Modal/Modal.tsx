import React, { useMemo } from 'react';

import styles from './Modal.module.scss';

interface ModalProps {
  children: React.ReactNode;
  className?: string;
}

function Modal(props: ModalProps) {
  const className = useMemo(() => {
    let str = styles['modal'];
    if (props.className) str += ` ${props.className}`;
    return str;
  }, [props.className]);

  return (
    <dialog open={true} className={className}>
      {props.children}
    </dialog>
  );
}

export default Modal;
