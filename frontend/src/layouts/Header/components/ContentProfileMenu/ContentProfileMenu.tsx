import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { setIsToken } from '../../../../redux/signInUpSlice';
import { resetUserData } from '../../../../redux/userSlice';
import { UserAvatar } from '../../../../components';

import styles from './ContentProfileMenu.module.scss';

interface ContentProfileMenuProps {
  onCloseHandler: () => void;
}

function ContentProfileMenu(props: ContentProfileMenuProps) {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const dispatch = useDispatch();

  const logOutHandler = useCallback(() => {
    dispatch(resetUserData());
    dispatch(setIsToken(false));
    props.onCloseHandler();
  }, [props.onCloseHandler]);

  return (
    <div className={styles['main-block']}>
      <h3 className={`${styles['padding']} ${styles['title']}`}>ACCOUNT</h3>
      {currentUser && (
        <Link
          to="/profile"
          className={`${styles['padding']} ${styles['user']}`}
          onClick={props.onCloseHandler}>
          <UserAvatar
            content={`${currentUser.firstName} ${currentUser.lastName}`}
            color={currentUser.color}
            className={styles['avatar']}
          />
          <div className={styles['user-info']}>
            <p className={styles['full-name']}>
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className={styles['email']}>{currentUser.email}</p>
          </div>
        </Link>
      )}
      <hr className={styles['hr']} />
      <div className={styles['link-list']}>
        <Link className={`${styles['padding']} ${styles['link']}`} onClick={logOutHandler} to="/">
          LOG OUT
        </Link>
      </div>
    </div>
  );
}

export default ContentProfileMenu;
