import React, { useMemo } from 'react';
import { projectBadges } from '../../data';

import styles from './ProjectAvatar.module.scss';

const { defaultBadge } = projectBadges;

interface ProjectAvatarProps {
  source?: string;
  typeSize?: 'small' | 'large';
  className?: string;
}

function ProjectAvatar(props: ProjectAvatarProps) {
  const className = useMemo(() => {
    let str = styles['project-avatar'];
    if (props.typeSize) str += ` ${styles[`size-${props.typeSize}`]}`;
    if (props.className) str += ` ${props.className}`;
    return str;
  }, [props.className, props.typeSize]);

  return (
    <div className={className}>
      <img
        className={styles['image']}
        src={props.source ?? defaultBadge}
        alt="Project avatar"
        onError={(event) => {
          const image = event.target as HTMLImageElement;
          image.src = defaultBadge;
        }}
      />
    </div>
  );
}

export default ProjectAvatar;
