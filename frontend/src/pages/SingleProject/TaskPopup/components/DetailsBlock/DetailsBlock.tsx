import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { fetchGetReserveUsers, updateTask } from '../../../../../redux/projectSlice';
import { Button, Input, User } from '../../../../../components';
import { UserDropdown } from '../../../components';
import { emptyUser, taskData } from '../../../../../data';
import UserType from '../../../../../types/user/userType';

import styles from './DetailsBlock.module.scss';

const { MIN_PRIORITY_VALUE, MAX_PRIORITY_VALUE } = taskData;

interface DetailsBlockProps {
  taskId: string;
  assignee: string;
  author: string;
  priority: number;
}

function DetailsBlock(props: DetailsBlockProps) {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const userList = useSelector((state: RootState) => state.projectSlice.users);
  const reserveUserList = useSelector((state: RootState) => state.projectSlice.reserveUsers);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [priority, setPriority] = useState(`${props.priority}`);
  const [author, setAuthor] = useState<UserType>();

  const isPriorityEdited = useMemo(
    () => `${props.priority}` !== priority,
    [props.priority, priority]
  );

  const assignee = useMemo(
    () => userList.find((user) => user._id === props.assignee),
    [userList, props.assignee]
  );

  const assignUser = useCallback((userId: string) => {
    if (userId === 'none') userId = 'auto';
    dispatch(updateTask(props.taskId, { executor: userId }));
  }, []);

  const savePriority = useCallback(() => {
    dispatch(updateTask(props.taskId, { priority }));
  }, [priority]);

  useEffect(() => {
    const user = userList.find((obj) => obj._id === props.author);
    if (user) setAuthor(user);

    const reserveUser = reserveUserList.find((obj) => obj._id === props.author);
    if (reserveUser) setAuthor(reserveUser);

    if (!user && !reserveUser) dispatch(fetchGetReserveUsers({ list: [props.author] }));
  }, [userList, reserveUserList]);

  return (
    <div className={styles['details-block']}>
      <h3 className={styles['title']}>Details</h3>
      <div className={styles['details-list']}>
        <div className={styles['detail-item']}>
          <div className={styles['detail-item-title']}>
            <span className={styles['row']}>Priority</span>
            <span className={styles['row']}>
              ({MIN_PRIORITY_VALUE} - {MAX_PRIORITY_VALUE}):
            </span>
          </div>
          <div className={styles['priority-block']}>
            <Input
              type="number"
              value={priority}
              onChange={(event) => {
                const value = event.target.value;
                if (+value < MIN_PRIORITY_VALUE) setPriority(`${MIN_PRIORITY_VALUE}`);
                else if (+value > MAX_PRIORITY_VALUE) setPriority(`${MAX_PRIORITY_VALUE}`);
                else setPriority(value);
              }}
              className={styles['input']}
            />
            {isPriorityEdited && (
              <>
                <Button onClick={savePriority} styleButton="primary">
                  Save
                </Button>
                <Button onClick={() => setPriority(`${props.priority}`)}>Cancel</Button>
              </>
            )}
          </div>
        </div>
        <div className={styles['detail-item']}>
          <div className={styles['detail-item-title']}>Assignee:</div>
          <div className={styles['assign-block']}>
            <UserDropdown
              users={userList}
              activeUser={props.assignee}
              onSelect={(id) => assignUser(id)}
              emptyUser={{ ...emptyUser, name: 'Not assigned' }}
            />
            {!assignee && (
              <button
                className={styles['assign-btn']}
                onClick={() => assignUser(`${currentUser?._id}`)}>
                Assign to me
              </button>
            )}
          </div>
        </div>
        <div className={styles['detail-item']}>
          <div className={styles['detail-item-title']}>Author:</div>
          <div className={styles['author-block']}>
            {author ? (
              <User
                content={`${author.firstName} ${author.lastName}`}
                color={author.color}
                name={`${author.firstName} ${author.lastName}`}
                subName={author.email}
              />
            ) : (
              <User content={emptyUser.content} color={emptyUser.color} name={emptyUser.name} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsBlock;
