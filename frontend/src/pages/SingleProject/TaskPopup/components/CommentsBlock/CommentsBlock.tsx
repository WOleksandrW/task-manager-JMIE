import React, { useCallback, useState } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { createComment } from '../../../../../redux/taskSlice';
import { Loader, UserAvatar } from '../../../../../components';
import { CommentItem, TextRedactor } from '../';

import { BiSortDown, BiSortUp } from 'react-icons/bi';

import styles from './CommentsBlock.module.scss';

interface CommentsBlockProps {
  taskId: string;
}

function CommentsBlock(props: CommentsBlockProps) {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const commentsList = useSelector((state: RootState) => state.taskSlice.comments);
  const isLoadingComments = useSelector((state: RootState) => state.taskSlice.isLoadingComments);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [isEditMode, setIsEditMode] = useState(false);
  const [newestFirst, setNewestFirst] = useState(true);

  const onSaveHandler = useCallback(
    (value: string) => {
      if (currentUser) {
        dispatch(
          createComment({
            taskId: props.taskId,
            text: value,
            author: currentUser._id,
            date: JSON.stringify(Date.now())
          })
        );
      }
      setIsEditMode(false);
    },
    [currentUser?._id]
  );

  return (
    <div className={styles['comments-block']}>
      <h3 className={styles['title']}>Comments</h3>
      <div className={styles['create-comment-block']}>
        <UserAvatar
          content={`${currentUser?.firstName} ${currentUser?.lastName}`}
          color={`${currentUser?.color}`}
          typeSize="medium"
          className={styles['avatar']}
        />
        <div className={styles['comment']}>
          {!isEditMode ? (
            <div onClick={() => setIsEditMode(true)} className={styles['comment-banner']}>
              Add comment
            </div>
          ) : (
            <TextRedactor
              initValue=""
              placeholder="Add comment"
              onSaveValue={onSaveHandler}
              onClose={() => setIsEditMode(false)}
            />
          )}
        </div>
      </div>
      {isLoadingComments ? (
        <Loader className={styles['loader']} />
      ) : (
        <>
          {commentsList.length > 1 && (
            <div className={styles['sort-block']} onClick={() => setNewestFirst(!newestFirst)}>
              {!newestFirst ? (
                <>
                  <p>Show oldest first</p>
                  <BiSortDown />
                </>
              ) : (
                <>
                  <p>Show newest first</p>
                  <BiSortUp />
                </>
              )}
            </div>
          )}
          {commentsList.length > 0 && (
            <div className={styles['comment-list']}>
              {[...commentsList]
                .sort((a, b) =>
                  newestFirst
                    ? JSON.parse(b.date) - JSON.parse(a.date)
                    : JSON.parse(a.date) - JSON.parse(b.date)
                )
                .map((comment) => (
                  <CommentItem
                    _id={comment._id}
                    author={comment.author}
                    text={comment.text}
                    date={comment.date}
                    key={comment._id}
                    dateUpdate={comment.dateUpdate}
                  />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CommentsBlock;
