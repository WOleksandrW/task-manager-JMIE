import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { setOverlayContent, hideOverlay } from '../../../redux/overlaySlice';
import { removeUserFromProject } from '../../../redux/projectSlice';
import { removeProject } from '../../../redux/projectsSlice';
import { BtnMenuAction, PopupSubmit } from '../../../components';
import { ProjectBreadcrumbs } from '../components';
import { SettingsForm } from './components';

import styles from './Settings.module.scss';

function Settings() {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const currentProject = useSelector((state: RootState) => state.projectSlice.project);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();
  const navigate = useNavigate();

  const optionsBtnMenu = useMemo(() => {
    const isAuthor = currentUser && currentProject && currentUser._id === currentProject.author;

    const optionRemoveProject = {
      title: 'Remove Project',
      callback: () => {
        if (currentProject) {
          dispatch(
            setOverlayContent(
              <PopupSubmit
                title="Deletion confirmation"
                description={`Are you sure you want to delete project "${currentProject.title}" (${currentProject._id})?`}
                onSubmit={() => {
                  dispatch(removeProject(currentProject._id));
                  dispatch(hideOverlay());
                  navigate('/');
                }}
              />
            )
          );
        }
      }
    };

    const optionLeaveProject = {
      title: 'Leave Project',
      callback: () => {
        if (currentUser && currentProject) {
          dispatch(
            setOverlayContent(
              <PopupSubmit
                title="Exit confirmation"
                description={`Are you sure you want to leave project "${currentProject.title}" (${currentProject._id})?`}
                onSubmit={() => {
                  dispatch(removeUserFromProject(currentProject._id, currentUser._id));
                  dispatch(hideOverlay());
                  navigate('/');
                }}
              />
            )
          );
        }
      }
    };

    const options = [];
    if (isAuthor) options.push(optionRemoveProject);
    else options.push(optionLeaveProject);

    return options;
  }, [currentUser?._id, currentProject?._id, currentProject?.author]);

  return (
    <>
      <ProjectBreadcrumbs endPoint="Project settings" />

      <div className={styles['settings-header']}>
        <h3 className={styles['title']}>Details</h3>
        <BtnMenuAction options={optionsBtnMenu} />
      </div>

      <SettingsForm />
    </>
  );
}

export default Settings;
