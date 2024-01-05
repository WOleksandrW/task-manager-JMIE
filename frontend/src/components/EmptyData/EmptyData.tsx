import React, { useMemo } from 'react';

import { MdAllInbox } from 'react-icons/md';

import styles from './EmptyData.module.scss';

interface EmptyDataProps {
  text: string;
  className?: string;
}

function EmptyData(props: EmptyDataProps) {
  const className = useMemo(() => {
    let str = styles['empty-data'];
    if (props.className) str += ` ${props.className}`;
    return str;
  }, [props.className]);

  return (
    <div className={className}>
      <MdAllInbox className={styles['icon']} />
      <p className={styles['text']}>{props.text}</p>
    </div>
  );
}

export default EmptyData;
