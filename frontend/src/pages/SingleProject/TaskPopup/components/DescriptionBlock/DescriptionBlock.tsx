import React, { useCallback, useState } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { updateTask } from '../../../../../redux/projectSlice';
import { EditableField } from '../';

import { MdEditNote } from 'react-icons/md';

import styles from './DescriptionBlock.module.scss';

interface DescriptionBlockProps {
  id: string;
  description: string;
}

function DescriptionBlock(props: DescriptionBlockProps) {
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [isEditMode, setIsEditMode] = useState(false);

  const onChangeHandler = useCallback(
    (val: string) => {
      dispatch(updateTask(props.id, { description: val }));
    },
    [props.id]
  );

  return (
    <div className={styles['description-block']}>
      <div className={styles['block-header']}>
        <h3 className={styles['title']}>Description</h3>
        {!isEditMode && (
          <MdEditNote className={styles['icon-edit']} onClick={() => setIsEditMode(true)} />
        )}
      </div>
      <EditableField
        value={props.description}
        displayPlaceholder="Add text"
        editorPlaceholder="Add description"
        isEditMode={isEditMode}
        setIsEditMode={(value) => setIsEditMode(value)}
        onChange={(value) => onChangeHandler(value)}
      />
    </div>
  );
}

export default DescriptionBlock;
