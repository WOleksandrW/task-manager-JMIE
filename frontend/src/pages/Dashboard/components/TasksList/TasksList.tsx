import React, { useEffect, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import api from '../../../../api';
import { List } from '../../../../components';
import { TaskItem } from '../';
import ColumnProjectType from '../../../../types/project/columnProjectType';

function TasksList() {
  const assignedTasks = useSelector((state: RootState) => state.userSlice.assignedTasks);

  const [isLoading, setIsLoading] = useState(true);
  const [columns, setColumns] = useState<ColumnProjectType[]>([]);
  const [error, setError] = useState('');

  const tasksDisplay = useMemo(() => {
    return assignedTasks
      .map((task) => {
        const column = columns.find((column) => column._id === task.columnId);
        return {
          id: task._id,
          title: task.title,
          projectId: task.projectId,
          columnTitle: `${column?.title}`,
          columnType: column?.type
        };
      })
      .filter((task) => task.columnType !== 'final');
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
    <List
      isLoading={!!assignedTasks.length && isLoading}
      count={tasksDisplay.length}
      textLoader="Loading tasks..."
      textEmpty="There are no tasks assigned to you"
      errorMessage={error}>
      {tasksDisplay.map((task) => {
        return <TaskItem {...task} key={task.id} />;
      })}
    </List>
  );
}

export default TasksList;
