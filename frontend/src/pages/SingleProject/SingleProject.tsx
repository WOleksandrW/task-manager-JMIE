import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { joinProject, leaveProject } from '../../redux/projectSlice';
import { Button, EmptyData, Preloader } from '../../components';
import { AsideBar } from './components';

import styles from './SingleProject.module.scss';

function SingleProject() {
  const { id } = useParams();
  const project = useSelector((state: RootState) => state.projectSlice.project);
  const isLoadingColumns = useSelector((state: RootState) => state.projectSlice.isLoadingColumns);
  const isLoadingTasks = useSelector((state: RootState) => state.projectSlice.isLoadingTasks);
  const isLoadingTeam = useSelector((state: RootState) => state.projectSlice.isLoadingTeam);
  const needLeave = useSelector((state: RootState) => state.projectSlice.needLeaveProject);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(joinProject(`${id}`));
    return () => {
      dispatch(leaveProject());
    };
  }, [id]);

  useEffect(() => {
    if (needLeave) navigate('/');
  }, [needLeave]);

  return (
    <>
      {isLoadingColumns || isLoadingTasks || isLoadingTeam ? (
        <div className={styles['wrapper']}>
          <Preloader text={'Loading project data...'} />
        </div>
      ) : project ? (
        <div className={styles['single-project']}>
          <AsideBar />
          <div className={styles['content']}>
            <Outlet />
          </div>
        </div>
      ) : (
        <div className={styles['wrapper']}>
          <EmptyData text="Project is not exist" />

          <Link to="/projects">
            <Button styleButton="primary">Go to projects</Button>
          </Link>
        </div>
      )}
    </>
  );
}

export default SingleProject;
