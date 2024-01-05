import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { addAlert, addAlertsListeners, removeAlertsListeners } from '../../redux/alertsSlice';
import { addProjectsListeners, removeProjectsListeners } from '../../redux/projectsSlice';
import { setIsToken } from '../../redux/signInUpSlice';
import { addUserListeners, removeUserListeners, resetUserData } from '../../redux/userSlice';
import { resetWebSocketData, startListening, stopListening } from '../../redux/websocketSlice';
import Header from '../Header/Header';
import { Loader } from '../../components';

import styles from './AuthLayout.module.scss';

function AuthLayout() {
  const statusWebSocket = useSelector((state: RootState) => state.websocketSlice.status);
  const isDuctOpen = useSelector((state: RootState) => state.websocketSlice.openDuct);
  const errorCode = useSelector((state: RootState) => state.websocketSlice.errorCode);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(addUserListeners());
    dispatch(addAlertsListeners());
    dispatch(addProjectsListeners());
    dispatch(startListening());
    return () => {
      dispatch(removeUserListeners());
      dispatch(removeAlertsListeners());
      dispatch(removeProjectsListeners());
      stopListening();
    };
  }, []);

  useEffect(() => {
    if (errorCode === '403' || errorCode === '401') {
      dispatch(
        addAlert({
          type: 'error',
          message: 'Token is broken'
        })
      );
      navigate('/');
      dispatch(resetWebSocketData());
      dispatch(resetUserData());
      dispatch(setIsToken(false));
    }
  }, [errorCode]);

  return (
    <>
      {statusWebSocket === 'ready' && isDuctOpen ? (
        <>
          <Header />
          <div className={styles['content']}>
            <Outlet />
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default AuthLayout;
