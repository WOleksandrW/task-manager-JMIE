import React, { useMemo } from 'react';
import { UserAvatar } from '../';

import { IconType } from 'react-icons';

import styles from './User.module.scss';

interface UserProps {
  content: string | IconType;
  color: string;
  name: string;
  subName?: string;
  onClick?: () => void;
}

function User(props: UserProps) {
  const className = useMemo(() => {
    let str = styles['user'];
    if (props.onClick) str += ` ${styles['hover']}`;
    return str;
  }, []);

  return (
    <div className={className} onClick={props.onClick}>
      <UserAvatar content={props.content} color={`${props.color}`} typeSize="medium" />
      <div className={styles['info']}>
        <span className={styles['name']}>{props.name}</span>
        {props.subName && <span className={styles['sub-name']}>{props.subName}</span>}
      </div>
    </div>
  );
}

export default User;
