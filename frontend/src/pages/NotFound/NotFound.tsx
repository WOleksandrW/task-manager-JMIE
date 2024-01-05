import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components';

import styles from './NotFound.module.scss';

function NotFound() {
  return (
    <div className={styles['wrapper']}>
      <div className={styles['not-found']}>
        <p className={styles['code']}>404</p>
        <h1 className={styles['title']}>The page you are looking for is not exist</h1>
        <Link className={styles['link']} to="/">
          <Button styleButton="primary">Go to homepage</Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
