import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { projectBadges } from '../../../../data';
import { BoxWithShadow, ProjectAvatar } from '../../../../components';

import styles from './ProjectItem.module.scss';

const { badgesList } = projectBadges;

interface ProjectItemProps {
  id: string;
  title: string;
  badge: string;
  projKey: string;
}

function ProjectItem(props: ProjectItemProps) {
  const projectBadge = useMemo(() => {
    return badgesList.find((data) => `${data.id}` === props.badge);
  }, [props.badge]);

  return (
    <BoxWithShadow className={styles['project-item']}>
      <Link to={`/projects/${props.id}/board`} className={styles['link']}>
        <ProjectAvatar source={projectBadge?.src} className={styles['project-avatar']} />
        <span className={styles['info']}>
          <span className={styles['title']}>{props.title}</span>
          <span className={styles['key']}>{props.projKey}</span>
        </span>
      </Link>
    </BoxWithShadow>
  );
}

export default ProjectItem;
