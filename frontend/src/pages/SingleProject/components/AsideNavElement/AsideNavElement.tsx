import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { IconType } from 'react-icons';

import styles from './AsideNavElement.module.scss';

interface AsideNavElementProps {
  icon: IconType;
  title: string;
  link: string;
  isActive?: boolean;
}

function AsideNavElement(props: AsideNavElementProps) {
  const className = useMemo(() => {
    let str = styles['element'];
    if (props.isActive) str += ` ${styles['active']}`;
    return str;
  }, [props.isActive]);

  return (
    <Link to={props.link} className={className}>
      <props.icon className={styles['icon']} />
      <span className={styles['title']}>{props.title}</span>
    </Link>
  );
}

export default AsideNavElement;
