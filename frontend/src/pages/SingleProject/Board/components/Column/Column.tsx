import React from 'react';
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps
} from 'react-beautiful-dnd';
import { ColumnBody, ColumnHeader } from './components';
import ColumnProjectType from '../../../../../types/project/columnProjectType';
import TaskType from '../../../../../types/task/taskType';

import styles from './Column.module.scss';

interface ColumnProps {
  column: ColumnProjectType;
  tasks: TaskType[];
  stickyHeader?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null | undefined;
  draggableProps?: DraggableProvidedDraggableProps;
  innerRef?: (element: HTMLElement | null) => void;
  partColumn?: 'header' | 'body';
  userId?: string;
}

function Column(props: ColumnProps) {
  return (
    <div className={styles['column']} {...props.draggableProps} ref={props.innerRef}>
      {(!props.partColumn || props.partColumn === 'header') && (
        <ColumnHeader
          column={props.column}
          tasksCount={props.tasks.length}
          stickyHeader={!!props.stickyHeader}
          dragHandleProps={props.dragHandleProps}
        />
      )}
      {(!props.partColumn || props.partColumn === 'body') && (
        <ColumnBody
          id={props.column._id}
          type={props.column.type}
          limit={props.column.limit}
          tasks={props.tasks}
          userId={props.userId}
        />
      )}
    </div>
  );
}

export default Column;
