import { useState, useCallback, useMemo } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { swapColumn, swapTask } from '../../../../../redux/projectSlice';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { BtnAction } from '../../../../../components';
import { Column, ColumnCreate, ColumnRowUser } from '../';

import { MdOutlineAdd } from 'react-icons/md';

import styles from './ColumnList.module.scss';

interface ColumnListProps {
  group: '' | 'Executor';
}

function ColumnList(props: ColumnListProps) {
  const currentProject = useSelector((state: RootState) => state.projectSlice.project);
  const columnList = useSelector((state: RootState) => state.projectSlice.columns);
  const taskList = useSelector((state: RootState) => state.projectSlice.tasks);
  const filterUser = useSelector((state: RootState) => state.projectSlice.filterUser);
  const searchValue = useSelector((state: RootState) => state.projectSlice.searchValue);
  const userList = useSelector((state: RootState) => state.projectSlice.users);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [isScrolledList, setIsScrolledList] = useState(false);
  const [isNewColumnVisible, setIsNewColumnVisible] = useState(false);

  const displayTasks = useMemo(() => {
    let res = taskList;
    if (filterUser.length > 0) res = res.filter((task) => filterUser.includes(task.executor));
    if (searchValue.length > 0) res = res.filter((task) => task.title.includes(searchValue));
    return [...res].sort((a, b) => b.priority - a.priority);
  }, [taskList, filterUser, searchValue]);

  const dragEndHandler = useCallback(
    (results: DropResult) => {
      const { destination, source, type, draggableId } = results;

      if (!destination) return;
      if (destination.droppableId === source.droppableId && destination.index === source.index)
        return;

      if (type === 'task') {
        const [userId, columnId] = destination.droppableId.split('--');

        const payload: { columnId: string; executor?: string } = { columnId };
        if (userId !== 'undefined') payload.executor = userId;
        dispatch(swapTask(draggableId, payload));
      } else if (type === 'column') {
        dispatch(swapColumn(`${currentProject?._id}`, draggableId, destination.index));
      }
    },
    [currentProject]
  );

  return (
    <DragDropContext onDragEnd={dragEndHandler}>
      <div
        className={styles['column-list-container']}
        onScroll={(event) => setIsScrolledList((event.target as HTMLDivElement).scrollTop > 0)}>
        <Droppable droppableId="ROOT" direction="horizontal" type="column">
          {(provided) => (
            <div
              className={styles['column-list']}
              {...provided.droppableProps}
              ref={provided.innerRef}>
              {props.group === '' && (
                <div className={styles['list']}>
                  {columnList.map((column, index) => (
                    <Draggable draggableId={column._id} key={column._id} index={index}>
                      {(provided) => (
                        <Column
                          key={column._id}
                          column={column}
                          tasks={displayTasks.filter((task) => task.columnId === column._id)}
                          stickyHeader={isScrolledList}
                          dragHandleProps={provided.dragHandleProps}
                          draggableProps={provided.draggableProps}
                          innerRef={provided.innerRef}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
              {props.group === 'Executor' && (
                <div className={styles['multi-list-block']}>
                  <div className={`${styles['list']} ${isScrolledList ? styles['sticky'] : ''}`}>
                    {columnList.map((column, index) => (
                      <Draggable draggableId={column._id} key={column._id} index={index}>
                        {(provided) => (
                          <Column
                            key={column._id}
                            column={column}
                            tasks={displayTasks.filter((task) => task.columnId === column._id)}
                            stickyHeader={isScrolledList}
                            partColumn="header"
                            dragHandleProps={provided.dragHandleProps}
                            draggableProps={provided.draggableProps}
                            innerRef={provided.innerRef}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                  {userList.map((user) => {
                    const tasks = displayTasks.filter((task) => task.executor === user._id);
                    return (
                      tasks.length > 0 && (
                        <div key={user._id}>
                          <ColumnRowUser
                            userId={user._id}
                            columnList={columnList}
                            taskList={tasks}
                          />
                        </div>
                      )
                    );
                  })}
                  <ColumnRowUser
                    userId="auto"
                    columnList={columnList}
                    taskList={displayTasks.filter((task) => task.executor === 'auto')}
                    classNameObj={{ 'user-row': styles['last-list'], list: styles['last-list'] }}
                  />
                </div>
              )}
              {isNewColumnVisible ? (
                <div className={`${styles['column-block']} ${styles['last-column']}`}>
                  <ColumnCreate onHide={() => setIsNewColumnVisible(false)} />
                </div>
              ) : (
                <div className={styles['btn-add-container']}>
                  <BtnAction
                    image={MdOutlineAdd}
                    title="Create column"
                    btnClassType="first"
                    className={styles['btn-add']}
                    onClick={() => setIsNewColumnVisible(true)}
                  />
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}

export default ColumnList;
