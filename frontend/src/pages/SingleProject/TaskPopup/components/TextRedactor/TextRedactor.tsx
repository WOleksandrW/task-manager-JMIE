import React, { useCallback, useState } from 'react';
import ReactQuill from 'react-quill';
import { Button } from '../../../../../components';

import 'react-quill/dist/quill.snow.css';
import styles from './TextRedactor.module.scss';

interface TextRedactorProps {
  initValue: string;
  placeholder: string;
  onSaveValue: (value: string) => void;
  onClose: () => void;
}

function TextRedactor(props: TextRedactorProps) {
  const [value, setValue] = useState(props.initValue);

  const saveValueHandler = useCallback(() => {
    if (value === '<p><br></p>' || !value) return;
    props.onSaveValue(value);
  }, [value]);

  return (
    <div className={styles['text-redactor']}>
      <ReactQuill value={value} onChange={(val) => setValue(val)} placeholder={props.placeholder} />
      <div className={styles['buttons']}>
        <Button type="submit" onClick={saveValueHandler} styleButton="primary">
          Save
        </Button>
        <Button type="reset" onClick={props.onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default TextRedactor;
