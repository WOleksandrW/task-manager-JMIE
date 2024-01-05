import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { projectBadges } from '../../../../data';
import { Preloader, ProjectAvatar } from '../../../../components';

import {
  MdOutlineViewColumn as BoardIcon,
  MdSupervisorAccount as TeamIcon,
  MdSettings as SettingsIcon
} from 'react-icons/md';

import styles from './ProjectCard.module.scss';

const { badgesList } = projectBadges;

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  badge: string;
}

function ProjectCard(props: ProjectCardProps) {
  const loaderRemoved = useSelector((state: RootState) => state.projectsSlice.loaderRemoved);

  const projectBadge = useMemo(() => {
    return badgesList.find((data) => `${data.id}` === props.badge);
  }, [props.badge]);

  const isLoadingRemoved = useMemo(
    () => loaderRemoved.includes(props.id),
    [loaderRemoved, props.id]
  );

  return (
    <li className={styles['card']} style={{ borderColor: `${projectBadge?.bg}90` }} id={props.id}>
      {isLoadingRemoved && (
        <div className={styles['preloader']}>
          <Preloader />
        </div>
      )}

      <div className={styles['header']}>
        <ProjectAvatar className={styles['avatar']} source={projectBadge?.src} typeSize="small" />

        <div className={styles['info']}>
          <Link to={`projects/${props.id}`} className={styles['title-link']} title={props.title}>
            {props.title}
          </Link>

          <p className={styles['description']} title={props.description}>
            {props.description}
          </p>
        </div>
      </div>

      <div className={styles['actions']}>
        <p className={styles['title']}>Fast navigation</p>
        <div className={styles['action-list']}>
          <Link to={`projects/${props.id}/board`}>
            <div className={styles['action']}>
              <BoardIcon />
              <p>Board</p>
            </div>
          </Link>
          <Link to={`projects/${props.id}/team`}>
            <div className={styles['action']}>
              <TeamIcon />
              <p>Team</p>
            </div>
          </Link>
          <Link to={`projects/${props.id}/settings`}>
            <div className={styles['action']}>
              <SettingsIcon />
              <p>Settings</p>
            </div>
          </Link>
        </div>
      </div>
    </li>
  );
}

export default ProjectCard;
