import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { removeNoted } from '../../../../redux/userSlice';
import { BtnAction, Preloader } from '../../../../components';

import {
  MdOutlineViewColumn as BoardIcon,
  MdCheckBox as TaskIcon,
  MdStar as StarIcon
} from 'react-icons/md';

import styles from './MarkedItem.module.scss';

interface MarkedItemProps {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  additional: { [key: string]: string };
}

function MarkedItem(props: MarkedItemProps) {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const loaderNoted = useSelector((state: RootState) => state.userSlice.loaderNoted);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const isLoadingNoted = useMemo(() => loaderNoted.includes(props.id), [loaderNoted, props.id]);

  const link = useMemo(() => {
    switch (props.type) {
      case 'project':
        return `/projects/${props.id}`;
      case 'task':
        return `/projects/${props.additional['projectId']}/board/selected-task/${props.id}`;
      default:
        return '/';
    }
  }, []);

  const removeItemHandler = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      if (currentUser) {
        dispatch(removeNoted(currentUser._id, props.id));
      }
    },
    [currentUser?._id, props.id]
  );

  return (
    <li className={styles['item']}>
      {isLoadingNoted && (
        <div className={styles['preloader']}>
          <Preloader />
        </div>
      )}
      <Link className={styles['item-inner']} to={link}>
        <BtnAction
          image={StarIcon}
          className={styles['noted-star']}
          onClick={(event) => removeItemHandler(event)}
        />

        {props.type === 'project' ? (
          <BoardIcon className={styles['icon']} />
        ) : (
          <TaskIcon className={`${styles['icon']} ${styles['task-icon']}`} />
        )}

        <div className={styles['content']}>
          <div className={styles['title']}>{props.title}</div>
          <div className={styles['subtitle']}>{props.subtitle}</div>
        </div>
      </Link>
    </li>
  );
}

export default MarkedItem;
