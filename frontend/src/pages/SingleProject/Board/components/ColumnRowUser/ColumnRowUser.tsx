import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { User } from '../../../../../components';
import { Column } from '../';
import TaskType from '../../../../../types/task/taskType';
import ColumnProjectType from '../../../../../types/project/columnProjectType';

import styles from './ColumnRowUser.module.scss';

enum classNameValues {
  ONE = 'user-row',
  TWO = 'header',
  THREE = 'avatar',
  FOUR = 'tasks',
  FIVE = 'list'
}

interface ColumnRowUserProps {
  userId?: string;
  columnList: ColumnProjectType[];
  taskList: TaskType[];
  classNameObj?: {
    [key in classNameValues]?: string;
  };
}

function ColumnRowUser(props: ColumnRowUserProps) {
  const userList = useSelector((state: RootState) => state.projectSlice.users);

  const user = useMemo(() => {
    return userList.find((data) => data._id === props.userId);
  }, [props.userId, userList]);

  const classNames = useMemo(() => {
    const defaultClassNames: { [key: string]: string } = {};
    for (const key in classNameValues) {
      const value = classNameValues[key as keyof typeof classNameValues];
      defaultClassNames[value] = styles[value];
    }

    if (props.classNameObj) {
      Object.entries(props.classNameObj).forEach((arr) => {
        defaultClassNames[arr[0]] += ` ${arr[1]}`;
      });
    }

    return defaultClassNames;
  }, [props.classNameObj]);

  return (
    <div className={classNames['user-row']}>
      <div className={classNames['header']}>
        {user ? (
          <User
            content={`${user.firstName} ${user.lastName}`}
            color={user.color}
            name={`${user.firstName} ${user.lastName}`}
            subName={user.email}
          />
        ) : (
          <div className={styles['text']}>Without Executor</div>
        )}
        <span className={classNames['tasks']}>{props.taskList.length} tasks</span>
      </div>
      <div className={classNames['list']}>
        {props.columnList.map((column) => {
          return (
            <Column
              key={column._id}
              column={column}
              tasks={props.taskList.filter((task) => task.columnId === column._id)}
              userId={props.userId}
              partColumn="body"
            />
          );
        })}
      </div>
    </div>
  );
}

export default ColumnRowUser;
