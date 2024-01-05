import React, { useCallback, useMemo, useState } from 'react';
import { columnData } from '../../../../../data';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { hideOverlay } from '../../../../../redux/overlaySlice';
import { Button, Input, Modal, SelectPanel } from '../../../../../components';
import ColumnProjectType from '../../../../../types/project/columnProjectType';

import styles from './PopupColumnSettings.module.scss';
import { updateColumn } from '../../../../../redux/projectSlice';

const { MAX_TASKS_LIMIT } = columnData;

interface PopupColumnSettingsProps {
  column: ColumnProjectType;
}

function PopupColumnSettings(props: PopupColumnSettingsProps) {
  const currentProject = useSelector((state: RootState) => state.projectSlice.project);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [selectedColumnType, setSelectedColumnType] = useState(props.column.type);
  const [limitTasks, setLimitTasks] = useState(props.column.limit);

  const optionsTypeSelect = useMemo(() => {
    return [
      { value: 'common', text: 'Common Column' },
      { value: 'final', text: 'Final column' }
    ];
  }, []);

  const onSubmitHandler = useCallback(() => {
    if (currentProject) {
      dispatch(
        updateColumn(currentProject._id, props.column._id, {
          type: selectedColumnType,
          limit: limitTasks
        })
      );
      dispatch(hideOverlay());
    }
  }, [selectedColumnType, limitTasks]);

  return (
    <Modal className={styles['popup']}>
      <h2 className={styles['title']}>Column {props.column.title}</h2>
      <div className={styles['main-content']}>
        <div className={styles['row']}>
          <p className={styles['description']}>Set limit of tasks (0-{MAX_TASKS_LIMIT}):</p>
          <div className={styles['input-block']}>
            <Input
              type="number"
              value={`${limitTasks}`}
              onChange={(event) =>
                setLimitTasks(
                  +event.target.value > MAX_TASKS_LIMIT ? MAX_TASKS_LIMIT : +event.target.value
                )
              }
              min={0}
              max={MAX_TASKS_LIMIT}
            />
          </div>
        </div>
        <div className={styles['row']}>
          <p className={styles['description']}>Select column type:</p>
          <div className={styles['select-block']}>
            <SelectPanel
              options={optionsTypeSelect}
              onSelect={setSelectedColumnType}
              selectedItem={optionsTypeSelect.findIndex(
                (option) => option.value === selectedColumnType
              )}
            />
          </div>
        </div>
      </div>
      <div className={styles['buttons']}>
        <Button onClick={onSubmitHandler} styleButton="primary">
          Save
        </Button>
        <Button onClick={() => dispatch(hideOverlay())}>Cancel</Button>
      </div>
    </Modal>
  );
}

export default PopupColumnSettings;
