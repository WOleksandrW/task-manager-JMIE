import React, { useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { updateUser } from '../../../../redux/userSlice';
import { cloudinaryData } from '../../../../data';

import { MdAddAPhoto } from 'react-icons/md';
import { BiPaint } from 'react-icons/bi';

import styles from './Cover.module.scss';

const { UPLOAD_PRESET, UPLOAD_URL } = cloudinaryData;

const Cover = () => {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const refColorInput = useRef<HTMLInputElement>(null);

  const stylesCover = useMemo(() => {
    const value = currentUser?.coverBlock;
    if (!value) return undefined;
    if (value.length === 4 || value.length === 7) return { backgroundColor: value };
    else return { backgroundImage: `url(${value})` };
  }, [currentUser?.coverBlock]);

  const uploadToCloudinary = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await axios.post(UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.secure_url;
    } catch (e) {
      console.log(e);
    }
  }, []);

  const onChangeImageInput = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (currentUser && file) {
        const imageUrl = await uploadToCloudinary(file);
        dispatch(updateUser(currentUser._id, { coverBlock: `${imageUrl}` }));
      }
    },
    [currentUser?._id, uploadToCloudinary]
  );

  const onBlurColorInput = useCallback(async () => {
    if (
      currentUser &&
      refColorInput.current &&
      refColorInput.current.value !== currentUser?.coverBlock
    ) {
      dispatch(updateUser(currentUser._id, { coverBlock: refColorInput.current.value }));
    }
  }, [currentUser?._id, currentUser?.coverBlock]);

  return (
    <div className={styles['cover-block']}>
      {stylesCover && <div className={styles['cover']} style={stylesCover} />}
      <div className={styles['control-panel']}>
        <label htmlFor="imgInp" className={styles['label']}>
          <MdAddAPhoto className={styles['icon']} />
          <input
            id="imgInp"
            className={styles['image-input']}
            type="file"
            accept="image/png, image/jpg, image/gif, image/jpeg"
            onChange={onChangeImageInput}
          />
        </label>
        <label htmlFor="colorInp" className={styles['label']}>
          <BiPaint className={styles['icon']} />
          <input
            id="colorInp"
            className={styles['color-input']}
            type="color"
            ref={refColorInput}
            onBlur={onBlurColorInput}
          />
        </label>
      </div>
    </div>
  );
};

export default Cover;
