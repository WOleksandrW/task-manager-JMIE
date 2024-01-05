import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';
import { removeAlert } from '../../redux/alertsSlice';
import { hideOverlay } from '../../redux/overlaySlice';
import { setIsToken } from '../../redux/signInUpSlice';
import { Alert, Loader, Overlay } from '../../components';
import Footer from '../Footer/Footer';

import styles from './MainLayout.module.scss';

function MainLayout() {
  const alerts = useSelector((state: RootState) => state.alertsSlice.alerts);
  const overlayContent = useSelector((state: RootState) => state.overlaySlice.overlayContent);
  const isOverlayVisible = useSelector((state: RootState) => state.overlaySlice.isVisible);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [isLoaderVisible, setIsLoaderVisible] = useState(true);

  useEffect(() => {
    const newToken = localStorage.getItem('accessToken');
    if (newToken && newToken !== '') dispatch(setIsToken(true));
    setIsLoaderVisible(false);
  }, []);

  return (
    <>
      {!isLoaderVisible ? <Outlet /> : <Loader />}
      <Footer />
      <Overlay isVisible={isOverlayVisible} onClick={() => dispatch(hideOverlay())}>
        {overlayContent}
      </Overlay>
      {!!alerts.length && (
        <div className={styles['alerts-container']}>
          {alerts.map((alert) => (
            <Alert
              key={`alert-${alert.id}`}
              id={alert.id}
              type={alert.type}
              message={alert.message}
              onClick={() => dispatch(removeAlert(alert.id))}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default MainLayout;
