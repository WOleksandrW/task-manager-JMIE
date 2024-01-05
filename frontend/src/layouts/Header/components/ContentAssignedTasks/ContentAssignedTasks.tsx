import React, { useEffect, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import api from '../../../../api';
import { EmptyData, Preloader } from '../../../../components';
import ColumnProjectType from '../../../../types/project/columnProjectType';

import { MdCheckBox } from 'react-icons/md';

import styles from './ContentAssignedTasks.module.scss';

interface AssignedTasksProps {
  onCloseHandler: () => void;
}

function ContentAssignedTasks(props: AssignedTasksProps) {
  const assignedTasks = useSelector((state: RootState) => state.userSlice.assignedTasks);
  const projectsList = useSelector((state: RootState) => state.projectsSlice.projects);

  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState<ColumnProjectType[]>([]);
  const [error, setError] = useState('');

  const computedTasks = useMemo(() => {
    const result: { [key: string]: { [key: string]: { id: string; title: string }[] } } = {};

    assignedTasks.forEach((task) => {
      const column = columns.find((col) => col._id === task.columnId);
      if (column?.type !== 'final') {
        if (!result[task.projectId]) result[task.projectId] = {};
        if (!result[task.projectId][task.columnId]) result[task.projectId][task.columnId] = [];
        result[task.projectId][task.columnId].push({ id: task._id, title: task.title });
      }
    });

    return result;
  }, [assignedTasks, columns]);

  useEffect(() => {
    if (assignedTasks.length)
      (async () => {
        setIsLoading(true);
        setError('');
        const tasksInfo = assignedTasks.map((task) => ({
          projectId: task.projectId,
          columnId: task.columnId
        }));

        const projectsId = Array.from(new Set(tasksInfo.map((info) => info.projectId)));

        const resObj: { [key: string]: string[] } = {};
        projectsId.forEach((id) => {
          resObj[id] = Array.from(
            new Set(tasksInfo.filter((info) => info.projectId === id).map((info) => info.columnId))
          );
        });

        try {
          const response = await api.columns.getDetails({ list: resObj });
          setColumns(Object.values(response.data).reduce((acc, arr) => acc.concat(arr), []));
        } catch (error) {
          setError(`${(error as AxiosError).response?.data ?? 'error'}`);
        }
        setIsLoading(false);
      })();
  }, [assignedTasks.length]);

  return (
    <div className={styles['main-block']}>
      <h3 className={`${styles['padding']} ${styles['title']}`}>Tasks assigned to me</h3>
      <div className={styles['content']}>
        {!!assignedTasks.length && isLoading ? (
          <div className={styles['empty']}>
            <Preloader text={'Loading tasks...'} />
          </div>
        ) : error || Object.keys(computedTasks).length === 0 ? (
          <EmptyData
            text={error.length ? error : 'No assigned tasks to you'}
            className={styles['empty']}
          />
        ) : (
          Object.entries(computedTasks).map(([projKey, objColumns]) => {
            const project = projectsList.find((proj) => proj._id === projKey);
            return (
              <div key={`assigned-proj-block-${projKey}`} className={styles['project-block']}>
                <h1 className={`${styles['padding']} ${styles['project-title']}`}>
                  Project - {project?.title}
                </h1>
                <div className={styles['column-list']}>
                  {Object.entries(objColumns).map(([colKey, arrTasks]) => {
                    const column = columns.find((col) => col._id === colKey);
                    return (
                      <div key={`assigned-col-block-${colKey}`} className={styles['column-block']}>
                        <h2 className={`${styles['padding']} ${styles['column-title']}`}>
                          Column - {column?.title}
                        </h2>
                        <div className={styles['task-list']}>
                          {arrTasks.map((task) => (
                            <Link
                              key={`assigned-${task.id}`}
                              className={styles['task']}
                              to={`/projects/${projKey}/board/selected-task/${task.id}`}
                              onClick={props.onCloseHandler}>
                              <MdCheckBox className={styles['task-icon']} />
                              <span className={styles['task-title']}>{task.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
      <hr className={styles['hr']} />
      <Link
        className={`${styles['padding']} ${styles['last-link']}`}
        onClick={() => props.onCloseHandler()}
        to="/">
        Go to home page
      </Link>
    </div>
  );
}

export default ContentAssignedTasks;
