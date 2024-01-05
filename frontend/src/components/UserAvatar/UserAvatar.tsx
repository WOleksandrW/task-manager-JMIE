import React, { useMemo } from 'react';

import { IconType } from 'react-icons';

import styles from './UserAvatar.module.scss';

interface UserAvatarProps {
  title?: string;
  content: string | IconType;
  color: string;
  className?: string;
  typeSize?: 'medium';
}

function UserAvatar(props: UserAvatarProps) {
  const className = useMemo(() => {
    let str = styles['user-avatar'];
    if (props.typeSize) str += ` ${styles[`size-${props.typeSize}`]}`;
    if (props.className) str += ` ${props.className}`;
    return str;
  }, [props.className, props.typeSize]);

  const isBackColorBright = useMemo(() => {
    const r = parseInt(props.color.slice(1, 3), 16) / 255;
    const g = parseInt(props.color.slice(3, 5), 16) / 255;
    const b = parseInt(props.color.slice(5, 7), 16) / 255;

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 0.5;
  }, [props.color]);

  return (
    <div className={className}>
      <div
        className={`${styles['content']} ${!isBackColorBright ? styles['light'] : styles['dark']}`}
        style={{ backgroundColor: props.color }}>
        {typeof props.content === 'string' ? (
          props.content
            .split(' ')
            .map((str) => str.slice(0, 1).toUpperCase())
            .join('')
        ) : (
          <props.content size={25} />
        )}
      </div>
      {props.title && <div className={styles['title']}>{props.title}</div>}
    </div>
  );
}

export default UserAvatar;
