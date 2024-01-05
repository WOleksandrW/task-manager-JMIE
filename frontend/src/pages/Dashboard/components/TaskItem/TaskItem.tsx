import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { Preloader } from '../../../../components';

import { MdCheckBox as TaskIcon } from 'react-icons/md';

import styles from './TaskItem.module.scss';

interface TasksListItemProps {
  id: string;
  title: string;
  columnTitle: string;
  projectId: string;
}

function TasksListItem(props: TasksListItemProps) {
  const { projectId, title, columnTitle, id } = props;
  const projectsList = useSelector((state: RootState) => state.projectsSlice.projects);

  const project = useMemo(() => {
    return projectsList.find((project) => project._id === projectId);
  }, [projectsList, projectId]);

  return (
    <li className={styles['task-item']}>
      {!project && (
        <div className={styles['preloader']}>
          <Preloader />
        </div>
      )}
      <Link className={styles['task']} to={`/projects/${projectId}/board/selected-task/${id}`}>
        <TaskIcon className={styles['icon']} />

        <div className={styles['content']}>
          <div className={styles['info']}>
            <div className={styles['title']}>{title}</div>
            <div className={styles['subtitle']}>
              {project?.key} - {project?.title}
            </div>
          </div>

          <p className={styles['column']}>{columnTitle}</p>
        </div>
      </Link>
    </li>
  );
}

export default TasksListItem;
