import React, { useCallback } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { hideOverlay } from '../../redux/overlaySlice';
import { BtnAction, Button, Modal } from '../';

import { MdClose } from 'react-icons/md';

import styles from './PopupSubmit.module.scss';

interface PopupSubmitProps {
  title: string;
  description: string;
  onSubmit: () => void;
}

function PopupSubmit(props: PopupSubmitProps) {
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const closeHandler = useCallback(() => {
    dispatch(hideOverlay());
  }, []);

  return (
    <Modal className={styles['popup']}>
      <div className={styles['header']}>
        <h2 className={styles['title']}>{props.title}</h2>
        <BtnAction image={MdClose} onClick={closeHandler} className={styles['close-btn']} />
      </div>
      <p className={styles['description']}>{props.description}</p>
      <div className={styles['buttons']}>
        <Button styleButton="danger" onClick={props.onSubmit}>
          Submit
        </Button>
        <Button onClick={closeHandler}>Cancel</Button>
      </div>
    </Modal>
  );
}

export default PopupSubmit;
