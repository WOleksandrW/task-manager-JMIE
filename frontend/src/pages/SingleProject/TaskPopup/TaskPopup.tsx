import { useEffect, useMemo, useCallback, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useClipboard } from 'use-clipboard-copy';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { addAlert } from '../../../redux/alertsSlice';
import { closeTask, openTask } from '../../../redux/taskSlice';
import { removeTask, updateTask } from '../../../redux/projectSlice';
import { addNoted, removeNoted } from '../../../redux/userSlice';
import {
  Modal,
  BtnMenuAction,
  EditableText,
  Preloader,
  BtnAction,
  SelectPanel,
  Overlay,
  EmptyData
} from '../../../components';
import { CommentsBlock, DescriptionBlock, DetailsBlock } from './components';

import { BsLink45Deg } from 'react-icons/bs';
import { MdClose, MdStar } from 'react-icons/md';

import styles from './TaskPopup.module.scss';

function TaskPopup() {
  const params = useParams();
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const notedList = useSelector((state: RootState) => state.userSlice.noted);
  const loaderNoted = useSelector((state: RootState) => state.userSlice.loaderNoted);
  const currentProject = useSelector((state: RootState) => state.projectSlice.project);
  const columnList = useSelector((state: RootState) => state.projectSlice.columns);
  const taskList = useSelector((state: RootState) => state.projectSlice.tasks);
  const needLeave = useSelector((state: RootState) => state.taskSlice.needLeaveTask);
  const clipboard = useClipboard();
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();
  const navigate = useNavigate();

  const [isCopied, setIsCopied] = useState(false);

  const isNoted = useMemo(
    () => notedList.some((data) => data._id === params.taskId),
    [notedList, params.taskId]
  );

  const isLoadingNoted = useMemo(
    () => loaderNoted.includes(`${params.taskId}`),
    [loaderNoted, params.taskId]
  );

  const task = useMemo(() => {
    return taskList.find((task) => task._id === params.taskId);
  }, [taskList, params.taskId]);

  const closeHandler = useCallback(() => {
    navigate(`/projects/${params.id}/board`);
  }, [params.id]);

  const changeColumn = useCallback(
    (columnId: string) => {
      if (task) dispatch(updateTask(task._id, { columnId }));
    },
    [task]
  );

  const noteTaskCallback = useCallback(() => {
    if (currentUser && task) {
      if (!isNoted) dispatch(addNoted(currentUser._id, task._id, 'task'));
      else dispatch(removeNoted(currentUser._id, task._id));
    }
  }, [currentUser?._id, isNoted, task]);

  const removeTaskHandler = useCallback(() => {
    if (task) {
      dispatch(removeTask({ taskId: task._id }));
      closeHandler();
    }
  }, [closeHandler, task]);

  const updateTaskTitle = useCallback(
    async (value: string) => {
      if (task) {
        dispatch(updateTask(task._id, { title: value }));
        return true;
      }
      return false;
    },
    [task]
  );

  useEffect(() => {
    if (task) {
      dispatch(openTask(task._id));
      return () => {
        dispatch(closeTask());
      };
    }
  }, [task?._id]);

  useEffect(() => {
    if (needLeave) {
      dispatch(addAlert({ type: 'info', message: 'Task has been deleted' }));
      closeHandler();
    }
  }, [needLeave, closeHandler]);

  useEffect(() => {
    if (isCopied) setTimeout(() => setIsCopied(false), 3000);
  }, [isCopied]);

  const options = useMemo(() => {
    return columnList
      .filter(
        (col) =>
          col._id === task?.columnId ||
          col.limit === 0 ||
          col.limit > taskList.filter((task) => task.columnId === col._id).length
      )
      .map((col) => ({ text: col.title, value: col._id }));
  }, [columnList, task, taskList]);

  const menuOptions = useMemo(() => {
    return [
      {
        title: !isNoted ? 'Add to Noted List' : 'Remove from Noted List',
        callback: noteTaskCallback
      },
      {
        title: 'Remove',
        callback: removeTaskHandler
      }
    ];
  }, [removeTaskHandler, isNoted, noteTaskCallback]);

  return (
    <Overlay isVisible onClick={closeHandler}>
      <Modal className={styles['task-popup']}>
        {task ? (
          <>
            <div className={styles['popup-header']}>
              <Link
                className={styles['task-code']}
                to={`/projects/${params.id}/board/selected-task/${task._id}`}>
                {currentProject?.key}-{task.id}
              </Link>
              <div className={styles['copy-block']}>
                <input
                  className={styles['copy-input']}
                  ref={clipboard.target}
                  value={window.location.href}
                  readOnly
                />
                <button
                  className={`${styles['copy-button']} ${isCopied ? styles['copied'] : ''}`}
                  onClick={
                    !isCopied
                      ? () => {
                          clipboard.copy();
                          setIsCopied(true);
                        }
                      : undefined
                  }>
                  <BsLink45Deg />
                </button>
                {!isCopied ? (
                  <span className={styles['copy-text--copy']}>Copy link</span>
                ) : (
                  <span className={styles['copy-text--copied']}>Copied!</span>
                )}
              </div>
              <div className={styles['actions']}>
                <div className={styles['btn-menu']}>
                  {isLoadingNoted ? <Preloader /> : <BtnMenuAction options={menuOptions} />}
                </div>
                <BtnAction image={MdClose} onClick={closeHandler} />
              </div>
            </div>
            <div className={styles['popup-content']}>
              <div className={styles['main-content']}>
                <EditableText
                  value={task.title}
                  onSubmit={updateTaskTitle}
                  classNameObj={{
                    'form-container': styles['editable-form-container'],
                    form: styles['editable-form'],
                    input: styles['editable-input'],
                    text: styles['editable-text']
                  }}
                  title="Task"
                />
                <DescriptionBlock id={task._id} description={task.description} />
                <CommentsBlock taskId={task._id} />
              </div>
              <div className={styles['aside-content']}>
                <div className={styles['info-line']}>
                  <div className={styles['select-panel']}>
                    {options.length && (
                      <SelectPanel
                        options={options}
                        onSelect={(value) => changeColumn(value)}
                        selectedItem={options.findIndex((option) => option.value === task.columnId)}
                        selectStyleType="accent"
                        isSelectedHide
                        emptyMessage="Not found suitable column"
                      />
                    )}
                  </div>
                  {isNoted && <MdStar className={styles['star']} />}
                </div>
                <DetailsBlock
                  taskId={task._id}
                  assignee={task.executor}
                  author={task.author}
                  priority={task.priority}
                />
              </div>
            </div>
          </>
        ) : (
          <div className={styles['not-found']}>
            <BtnAction className={styles['close']} image={MdClose} onClick={closeHandler} />
            <EmptyData text="Task not found" />
          </div>
        )}
      </Modal>
    </Overlay>
  );
}

export default TaskPopup;
