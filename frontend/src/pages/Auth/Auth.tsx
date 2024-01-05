import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Modal, Loader } from '../../components';
import { SignIn, SignUp } from './components';

import styles from './Auth.module.scss';

interface AuthProps {
  view: 'sign-in' | 'sign-up';
}

function Auth(props: AuthProps) {
  const isLoading = useSelector((state: RootState) => state.signInUpSlice.isLoadingSign);
  const message = useSelector((state: RootState) => state.signInUpSlice.messageSign);

  return (
    <div className={styles['backdrop']}>
      <Modal className={styles['popup']}>
        {isLoading && <Loader className={styles['loader']} />}
        {message.length > 0 && (
          <div className={styles['message-bg']}>
            <p className={styles['message']}>{message}</p>
          </div>
        )}
        <div className={styles['title-block']}>
          <div className={styles['logo']}></div>
          <h1 className={styles['title']}>
            <span className={styles['title-letter']}>J</span>
            <span className={`${styles['title-text']} ${styles['first']}`}>ust</span>
            <span className={styles['title-letter']}>M</span>
            <span className={`${styles['title-text']} ${styles['second']}`}>ake</span>
            <span className={styles['title-letter']}>I</span>
            <span className={`${styles['title-text']} ${styles['third']}`}>t</span>
            <span className={styles['title-letter']}>E</span>
            <span className={`${styles['title-text']} ${styles['forth']}`}>asier</span>
          </h1>
        </div>
        <p className={styles['subtitle']}>Login or create user to continue</p>
        {props.view === 'sign-in' && <SignIn styles={styles} />}
        {props.view === 'sign-up' && <SignUp styles={styles} />}
      </Modal>
      <div className={styles['background']}>
        <div className={styles['cover']}></div>
        <div className={styles['image']}></div>
      </div>
    </div>
  );
}

export default Auth;
