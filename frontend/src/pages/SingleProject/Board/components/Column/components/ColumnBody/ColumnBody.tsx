import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../../redux/store';
import { createTask } from '../../../../../../../redux/projectSlice';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useComponentVisible } from '../../../../../../../hooks';
import { Preloader, BtnAction } from '../../../../../../../components';
import { Task } from '../../../';
import TaskType from '../../../../../../../types/task/taskType';

import { MdClose, MdDone } from 'react-icons/md';

import styles from './ColumnBody.module.scss';

interface ColumnBodyProps {
  id: string;
  userId?: string;
  tasks: TaskType[];
  type: string;
  limit: number;
}

function ColumnBody(props: ColumnBodyProps) {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const currentProject = useSelector((state: RootState) => state.projectSlice.project);
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(
    false,
    'mousedown'
  );
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  const titleError = useMemo(() => newTaskTitle.length === 0, [newTaskTitle]);

  const isLimitFilled = useMemo(() => {
    return props.limit > 0 && props.tasks.length >= props.limit;
  }, [props.limit, props.tasks]);

  const onSubmitHandler = useCallback(() => {
    if (!titleError && currentUser && currentProject) {
      setIsLoadingCreate(true);
      dispatch(
        createTask({
          projectId: currentProject._id,
          columnId: props.id,
          taskTitle: newTaskTitle,
          currUserId: currentUser._id,
          userId: props.userId
        })
      );
      setIsLoadingCreate(false);
      setIsComponentVisible(false);
    }
  }, [props.id, newTaskTitle, titleError, currentUser, currentProject?._id, props.userId]);

  useEffect(() => {
    if (!isComponentVisible) setNewTaskTitle('');
  }, [isComponentVisible]);

  return (
    <Droppable droppableId={`${props.userId}--${props.id}`} type="task">
      {(provided) => (
        <div className={styles['column-body']} {...provided.droppableProps} ref={provided.innerRef}>
          <div className={styles['task-list']}>
            {props.tasks.map((task, index) => (
              <Draggable draggableId={task._id} key={task._id} index={index}>
                {(provided) => (
                  <Task
                    _id={task._id}
                    title={task.title}
                    keyTask={`${currentProject?.key ?? 'key'}-${task.id}`}
                    executor={task.executor}
                    priority={task.priority}
                    typeDone={props.type === 'final'}
                    dragHandleProps={provided.dragHandleProps}
                    draggableProps={provided.draggableProps}
                    innerRef={provided.innerRef}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
          <div ref={ref} className={styles['add-task-block']}>
            {!isComponentVisible ? (
              <button
                className={styles['add-task']}
                disabled={isLimitFilled}
                onClick={() => setIsComponentVisible(true)}>
                + Create Task {isLimitFilled && '(Limit is filled)'}
              </button>
            ) : (
              <div className={styles['new-task']}>
                <textarea
                  name="title"
                  value={newTaskTitle}
                  autoFocus={true}
                  className={styles['textarea']}
                  placeholder="Enter task title"
                  onChange={(event) => setNewTaskTitle(event.target.value)}></textarea>
                {titleError && (
                  <span className={styles['error-message']}>Task title can&apos;t be empty</span>
                )}
                <div className={styles['buttons']}>
                  <BtnAction
                    image={MdDone}
                    btnClassType="first"
                    onClick={() => onSubmitHandler()}
                  />
                  <BtnAction
                    image={MdClose}
                    btnClassType="first"
                    onClick={() => setIsComponentVisible(false)}
                  />
                </div>
                {isLoadingCreate && (
                  <div className={styles['block-loader']}>
                    <Preloader />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default ColumnBody;
