import React, { useCallback, useMemo } from 'react';
import parse from 'html-react-parser';
import { TextRedactor } from '../';

import styles from './EditableField.module.scss';

interface EditableFieldProps {
  value: string;
  displayPlaceholder: string;
  editorPlaceholder: string;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  onChange: (value: string) => void;
}

function EditableField(props: EditableFieldProps) {
  const parsedValue = useMemo(() => parse(props.value), [props.value]);

  const onSaveHandler = useCallback((val: string) => {
    props.onChange(val);
    props.setIsEditMode(false);
  }, []);

  return (
    <div>
      {!props.isEditMode ? (
        <div className={styles['display']}>
          {!props.value ||
          props.value === '<p><br></p>' ||
          (typeof parsedValue === 'string' && !parsedValue) ||
          (parsedValue instanceof Array && parsedValue.length === 0)
            ? props.displayPlaceholder
            : parsedValue}
        </div>
      ) : (
        <TextRedactor
          initValue={props.value}
          placeholder={props.editorPlaceholder}
          onSaveValue={onSaveHandler}
          onClose={() => props.setIsEditMode(false)}
        />
      )}
    </div>
  );
}

export default EditableField;
