import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/store';
import { addNoted, removeNoted } from '../../../../../../redux/userSlice';
import { projectBadges } from '../../../../../../data';
import { Preloader, ProjectAvatar } from '../../../../../../components';

import { MdStar, MdStarOutline } from 'react-icons/md';

import styles from './RecentProject.module.scss';

const { badgesList } = projectBadges;

interface RecentProjectProps {
  id: string;
  title: string;
  badge: string;
  onClick?: () => void;
}

function RecentProject(props: RecentProjectProps) {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const notedList = useSelector((state: RootState) => state.userSlice.noted);
  const loaderNoted = useSelector((state: RootState) => state.userSlice.loaderNoted);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const projectBadge = useMemo(() => {
    return badgesList.find((data) => `${data.id}` === props.badge);
  }, [props.badge]);

  const isNoted = useMemo(
    () => notedList.some((data) => data._id === props.id),
    [notedList, props.id]
  );

  const isLoadingNoted = useMemo(() => loaderNoted.includes(props.id), [loaderNoted, props.id]);

  const noteProject = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      event.preventDefault();
      if (currentUser) {
        if (!isNoted) dispatch(addNoted(currentUser._id, props.id, 'project'));
        else dispatch(removeNoted(currentUser._id, props.id));
      }
    },
    [currentUser, isNoted, props.id]
  );

  return (
    <Link to={`/projects/${props.id}/board`} className={styles['project']} onClick={props.onClick}>
      <ProjectAvatar source={projectBadge?.src} typeSize="small" />
      <span className={styles['title']}>{props.title}</span>
      <div className={styles['action-block']}>
        {isLoadingNoted ? (
          <Preloader />
        ) : (
          <div className={styles['btn-note']} onClick={noteProject}>
            {isNoted ? (
              <MdStar className={`${styles['star']} ${styles['active']}`} />
            ) : (
              <MdStarOutline className={styles['star']} />
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export default RecentProject;
