import React, { useCallback } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { createColumn } from '../../../../../redux/projectSlice';
import { EditableText } from '../../../../../components';

import styles from './ColumnCreate.module.scss';

interface ColumnCreateProps {
  onHide: () => void;
}

function ColumnCreate(props: ColumnCreateProps) {
  const currentProject = useSelector((state: RootState) => state.projectSlice.project);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const onSubmitHandler = useCallback(async (value: string) => {
    if (currentProject) dispatch(createColumn(currentProject._id, value));
    return true;
  }, []);

  return (
    <div className={styles['column']}>
      <div className={styles['column-header']}>
        <EditableText
          value="Column"
          onSubmit={(value: string) => onSubmitHandler(value)}
          classNameObj={{
            'form-container': styles['editable-form-container'],
            form: styles['editable-form'],
            text: styles['editable-text']
          }}
          title="Column"
          isActive={true}
          onHideEdit={props.onHide}
        />
      </div>
    </div>
  );
}

export default ColumnCreate;
