import React from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { setOverlayContent } from '../../../redux/overlaySlice';
import { Button } from '../../../components';
import { PopupAddUser, ProjectBreadcrumbs } from '../components';
import { TeamTable } from './components';

import styles from './Team.module.scss';

function Team() {
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  return (
    <>
      <ProjectBreadcrumbs endPoint="Project team" />

      <div className={styles['team-header']}>
        <span className={styles['title']}>Collaborators</span>

        <Button onClick={() => dispatch(setOverlayContent(<PopupAddUser />))} styleButton="primary">
          Add collaborator
        </Button>
      </div>

      <div className={styles['info-block']}>
        <div className={styles['icon']}>i</div>
        <p className={styles['message']}>
          Only user with <span className={styles['marked']}>Admin</span> role can remove other users
          from collaborators. <span className={styles['marked']}>Admin</span> is those user who
          created project. It is not possible to change users roles now, because according
          functionality is not implemented yet, but you can delegate{' '}
          <span className={styles['marked']}>Admin</span> role in project settings
        </p>
      </div>

      <TeamTable />
    </>
  );
}

export default Team;
