import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { removeTask } from '../../../../../redux/projectSlice';
import { addNoted, removeNoted } from '../../../../../redux/userSlice';
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps
} from 'react-beautiful-dnd';
import { Preloader, UserAvatar, BtnMenuAction } from '../../../../../components';

import { MdCheckBox, MdDone, MdStar } from 'react-icons/md';

import styles from './Task.module.scss';

interface TaskProps {
  _id: string;
  title: string;
  keyTask: string;
  executor: string;
  priority: number;
  typeDone?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null | undefined;
  draggableProps?: DraggableProvidedDraggableProps;
  innerRef?: (element: HTMLElement | null) => void;
}

function Task(props: TaskProps) {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const notedList = useSelector((state: RootState) => state.userSlice.noted);
  const loaderNoted = useSelector((state: RootState) => state.userSlice.loaderNoted);
  const userList = useSelector((state: RootState) => state.projectSlice.users);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();
  const navigate = useNavigate();

  const [isActiveMenu, setIsActiveMenu] = useState(false);
  const [isLoadingRemove, setIsLoadingRemove] = useState(false);

  const isNoted = useMemo(
    () => notedList.some((data) => data._id === props._id),
    [notedList, props._id]
  );

  const isLoadingNoted = useMemo(() => loaderNoted.includes(props._id), [loaderNoted, props._id]);

  const user = useMemo(
    () => userList.find((user) => user._id === props.executor),
    [userList, props.executor]
  );

  const noteTaskCallback = useCallback(() => {
    if (currentUser) {
      if (!isNoted) dispatch(addNoted(currentUser._id, props._id, 'task'));
      else dispatch(removeNoted(currentUser._id, props._id));
    }
  }, [props._id, isNoted, currentUser]);

  const deleteTaskCallback = useCallback(() => {
    setIsLoadingRemove(true);
    dispatch(removeTask({ taskId: props._id }));
    setIsLoadingRemove(false);
  }, [props._id]);

  const optionsBtnMenu = useMemo(() => {
    return [
      {
        title: !isNoted ? 'Add to Noted List' : 'Remove from Noted List',
        callback: noteTaskCallback
      },
      {
        title: 'Remove',
        callback: deleteTaskCallback
      }
    ];
  }, [noteTaskCallback, deleteTaskCallback, isNoted]);

  return (
    <div
      onClick={() => navigate(`selected-task/${props._id}`)}
      className={styles['task']}
      {...props.dragHandleProps}
      {...props.draggableProps}
      ref={props.innerRef}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${styles['btn-more']} ${isActiveMenu ? styles['active'] : ''}`}>
        <BtnMenuAction options={optionsBtnMenu} onActiveMenu={(value) => setIsActiveMenu(value)} />
      </div>
      <div className={styles['title']}>{props.title}</div>
      <div className={styles['info-block']}>
        <div className={styles['info']}>
          <MdCheckBox className={styles['task-icon']} />
          {props.keyTask}
        </div>
        <p className={styles['priority']}>P: {props.priority}</p>
        <div className={styles['sub-info']}>
          <div className={styles['icon-block']}>
            {props.typeDone && <MdDone className={styles['icon-done']} />}
          </div>
          <div className={styles['icon-block']}>
            {isNoted && <MdStar className={styles['star']} />}
          </div>
          <div className={styles['icon-block']}>
            {props.executor !== 'auto' && user && (
              <UserAvatar
                className={styles['avatar']}
                title={`${user.firstName} ${user.lastName}`}
                content={`${user.firstName} ${user.lastName}`}
                color={user.color}
              />
            )}
          </div>
        </div>
      </div>
      {(isLoadingRemove || isLoadingNoted) && (
        <div className={styles['loader']}>
          <Preloader />
        </div>
      )}
    </div>
  );
}

export default Task;
