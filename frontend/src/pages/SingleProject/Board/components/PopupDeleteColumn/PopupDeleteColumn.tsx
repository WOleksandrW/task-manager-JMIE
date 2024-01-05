import React, { useCallback, useMemo, useState } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { hideOverlay } from '../../../../../redux/overlaySlice';
import { removeColumn } from '../../../../../redux/projectSlice';
import { Button, Modal, SelectPanel } from '../../../../../components';

import { MdWarningAmber, MdArrowForward } from 'react-icons/md';

import styles from './PopupDeleteColumn.module.scss';

interface PopupDeleteColumnProps {
  _id: string;
  title: string;
}

function PopupDeleteColumn(props: PopupDeleteColumnProps) {
  const currentProject = useSelector((state: RootState) => state.projectSlice.project);
  const columnList = useSelector((state: RootState) => state.projectSlice.columns);
  const taskList = useSelector((state: RootState) => state.projectSlice.tasks);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const options = useMemo(() => {
    const taskCount = taskList.filter((task) => task.columnId === props._id).length;

    return columnList
      .filter((data) => data._id !== props._id)
      .filter(
        (col) =>
          col.limit === 0 ||
          col.limit >= taskList.filter((task) => task.columnId === col._id).length + taskCount
      )
      .map((data) => ({ text: data.title, value: data._id }));
  }, [columnList, props._id, taskList]);

  const [selectedColumn, setSelectedColumn] = useState('');

  const onSubmitHandler = useCallback(() => {
    if (currentProject) {
      dispatch(hideOverlay());
      dispatch(removeColumn(currentProject._id, props._id, selectedColumn));
    }
  }, [currentProject?._id, selectedColumn]);

  return (
    <Modal className={styles['popup']}>
      <div className={styles['header']}>
        <span className={styles['icon']}>
          <MdWarningAmber />
        </span>
        Move tasks from column &quot;
        <span className={styles['column-title']}>{props.title.toUpperCase()}</span>
        &quot;
      </div>
      <div className={styles['description']}>
        Select a new location for all &quot;{props.title.toUpperCase()}&quot; tasks.
      </div>
      <div className={styles['content']}>
        <div className={styles['block']}>
          <p className={styles['title']}>This column will be removed:</p>
          <div className={styles['value']}>
            <p className={styles['column-title']}>{props.title}</p>
          </div>
        </div>
        <div className={styles['block']}>
          <p className={styles['title']}>New task location:</p>
          <SelectPanel
            options={options}
            onSelect={setSelectedColumn}
            selectedItem={options.findIndex((option) => option.value === selectedColumn)}
            placeholder="Select column"
            emptyMessage="Not found suitable column"
          />
        </div>
        <MdArrowForward className={styles['separator']} />
      </div>
      <div className={styles['buttons']}>
        <Button onClick={onSubmitHandler} styleButton="danger" disabled={selectedColumn === ''}>
          Remove
        </Button>
        <Button onClick={() => dispatch(hideOverlay())}>Cancel</Button>
      </div>
    </Modal>
  );
}

export default PopupDeleteColumn;
