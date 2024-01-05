import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { fetchGetReserveUsers } from '../../../../../redux/projectSlice';
import { removeComment, updateComment } from '../../../../../redux/taskSlice';
import { emptyUser, timeData } from '../../../../../data';
import { UserAvatar } from '../../../../../components';
import { EditableField } from '../';
import UserType from '../../../../../types/user/userType';

import styles from './CommentItem.module.scss';

const { SECOND, MINUTE, HOUR, MAX_DISPLAY_COMMENT_TIME } = timeData;

interface CommentItemInterface {
  _id: string;
  author: string;
  date: string;
  dateUpdate: string;
  text: string;
}

function CommentItem(props: CommentItemInterface) {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const userList = useSelector((state: RootState) => state.projectSlice.users);
  const reserveUserList = useSelector((state: RootState) => state.projectSlice.reserveUsers);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [isEditMode, setIsEditMode] = useState(false);
  const [currTime, setCurrTime] = useState(Date.now());
  const [author, setAuthor] = useState<UserType>();

  const timePost = useMemo(() => {
    const diffMs = Math.abs(Date.now() - JSON.parse(props.date));
    const minutes = Math.floor((diffMs / SECOND / MINUTE) << 0);
    switch (true) {
      case minutes < 0:
        return 'unknown';
      case minutes < 2:
        return `posted just now`;
      case minutes >= 2 && minutes < HOUR:
        return `posted ${minutes} min ago`;
      case minutes >= 60 && minutes < MAX_DISPLAY_COMMENT_TIME:
        return `posted ${Math.floor(minutes / HOUR)} hours ago`;
      default:
        return `posted long time ago`;
    }
  }, [currTime]);

  const onChangeHandler = useCallback((textValue: string) => {
    dispatch(
      updateComment({
        _id: props._id,
        text: textValue,
        dateUpdate: JSON.stringify(Date.now())
      })
    );
  }, []);

  const onClickHandler = useCallback(() => {
    dispatch(removeComment(props._id));
  }, [props._id]);

  useEffect(() => {
    setInterval(() => setCurrTime(Date.now()), 60000);
  }, []);

  useEffect(() => {
    const user = userList.find((obj) => obj._id === props.author);
    if (user) setAuthor(user);

    const reserveUser = reserveUserList.find((obj) => obj._id === props.author);
    if (reserveUser) setAuthor(reserveUser);

    if (!user && !reserveUser) dispatch(fetchGetReserveUsers({ list: [props.author] }));
  }, [userList, reserveUserList]);

  return (
    <div className={styles['comment-item']}>
      <UserAvatar
        content={author ? `${author.firstName} ${author.lastName}` : emptyUser.content}
        color={author ? author.color : emptyUser.color}
        typeSize="medium"
        className={styles['avatar']}
      />
      <div className={styles['comment']}>
        <div className={styles['comment-header']}>
          <span className={styles['user-name']}>
            {author ? `${author.firstName} ${author.lastName}` : emptyUser.name}
          </span>
          <span
            className={styles['time']}
            data-title={`created on ${new Date(JSON.parse(props.date)).toLocaleString()}`}>
            {timePost}
          </span>
          {props.date !== props.dateUpdate && (
            <span
              className={styles['time']}
              data-title={`edited at ${new Date(JSON.parse(props.dateUpdate)).toLocaleString()}`}>
              Edited
            </span>
          )}
        </div>
        <EditableField
          value={props.text}
          displayPlaceholder="Add text"
          editorPlaceholder="Add comment"
          isEditMode={isEditMode}
          setIsEditMode={(value) => setIsEditMode(value)}
          onChange={(value) => onChangeHandler(value)}
        />
        {!isEditMode && currentUser && currentUser._id === props.author && (
          <div className={styles['comment-footer']}>
            <button className={styles['button']} onClick={() => setIsEditMode(true)}>
              Edit
            </button>
            <button className={styles['button']} onClick={onClickHandler}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentItem;
