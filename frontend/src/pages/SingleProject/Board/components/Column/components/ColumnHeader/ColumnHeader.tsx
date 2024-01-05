import React, { useState, useMemo, useCallback } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../../redux/store';
import { hideOverlay, setOverlayContent } from '../../../../../../../redux/overlaySlice';
import { removeColumn, removeTask, updateColumn } from '../../../../../../../redux/projectSlice';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { BtnMenuAction, EditableText, PopupSubmit } from '../../../../../../../components';
import { PopupColumnSettings, PopupDeleteColumn } from '../../../';
import ColumnProjectType from '../../../../../../../types/project/columnProjectType';

import { MdDone } from 'react-icons/md';

import styles from './ColumnHeader.module.scss';

interface ColumnHeaderProps {
  column: ColumnProjectType;
  tasksCount: number;
  stickyHeader: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null | undefined;
}

function ColumnHeader(props: ColumnHeaderProps) {
  const currentProject = useSelector((state: RootState) => state.projectSlice.project);
  const columnList = useSelector((state: RootState) => state.projectSlice.columns);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [isActiveMenu, setIsActiveMenu] = useState(false);

  const optionsBtnMenu = useMemo(() => {
    return [
      {
        title: 'Column Settings',
        callback: () => {
          dispatch(setOverlayContent(<PopupColumnSettings column={props.column} />));
        }
      },
      {
        title: 'Remove All Tasks',
        callback: () => {
          dispatch(
            setOverlayContent(
              <PopupSubmit
                title="Deletion confirmation"
                description={`Are you sure you want to delete all tasks in column "${props.column.title}"?`}
                onSubmit={() => {
                  dispatch(removeTask({ columnId: props.column._id }));
                  dispatch(hideOverlay());
                }}
              />
            )
          );
        }
      },
      {
        title: 'Remove',
        callback: () => {
          if (currentProject) {
            if (props.tasksCount > 0)
              dispatch(
                setOverlayContent(
                  <PopupDeleteColumn _id={props.column._id} title={props.column.title} />
                )
              );
            else dispatch(removeColumn(currentProject._id, props.column._id));
          }
        },
        blocked: columnList.length <= 1
      }
    ];
  }, [props.column._id, props.tasksCount, columnList]);

  const className = useMemo(() => {
    let str = styles['column-header'];
    if (props.stickyHeader) str += ` ${styles['sticky']}`;
    return str;
  }, [props.stickyHeader]);

  const postText = useMemo(() => {
    const res = [`${props.tasksCount}`, ' tasks'];
    if (props.column.limit > 0) res.splice(1, 0, `/${props.column.limit}`);
    return res.join('');
  }, [props.tasksCount, props.column.limit]);

  const onSubmitHandler = useCallback(
    async (value: string) => {
      dispatch(updateColumn(`${currentProject?._id}`, props.column._id, { title: value }));
      return true;
    },
    [props.column._id]
  );

  return (
    <div className={className}>
      <div className={styles['header-content']} {...props.dragHandleProps}>
        <EditableText
          value={props.column.title}
          onSubmit={(value: string) => onSubmitHandler(value)}
          classNameObj={{
            'form-container': styles['editable-form-container'],
            form: styles['editable-form'],
            text: styles['editable-text']
          }}
          title="Column"
          postText={postText}
          postIcon={
            props.column.type === 'final' ? (
              <div className={styles['icon-done']}>
                <MdDone />
              </div>
            ) : undefined
          }
        />
      </div>
      <div className={`${styles['btn-more']} ${isActiveMenu ? styles['active'] : ''}`}>
        <BtnMenuAction options={optionsBtnMenu} onActiveMenu={(value) => setIsActiveMenu(value)} />
      </div>
    </div>
  );
}

export default ColumnHeader;
