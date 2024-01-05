import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserAvatar } from '../../components';
import { Cover, UserInfo, UserProjects } from './components';

import styles from './Profile.module.scss';

function Profile() {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);

  return (
    <div className={styles['profile-page']}>
      <Cover />
      <div className={styles['profile-inner']}>
        <UserAvatar
          content={`${currentUser?.firstName} ${currentUser?.lastName}`}
          color={`${currentUser?.color}`}
          className={styles['avatar']}
        />
        <div className={styles['main-content']}>
          <UserInfo className={styles['left']} />
          <UserProjects className={styles['right']} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
