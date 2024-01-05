import React, { useCallback, useMemo, useState } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { addAlert } from '../../../../../redux/alertsSlice';
import { setOverlayContent } from '../../../../../redux/overlaySlice';
import { updateProject } from '../../../../../redux/projectsSlice';
import { projectValidation } from '../../../../../data';
import {
  Button,
  ComponentWithMessage,
  Input,
  Label,
  Preloader,
  ProjectAvatar
} from '../../../../../components';
import { UserDropdown } from '../../../components';
import { PopupProjectBadges } from '../';
import { projectBadges } from '../../../../../data';

import { MdDone } from 'react-icons/md';

import styles from './SettingsForm.module.scss';

const { badgesList } = projectBadges;
const { TITLE_MIN_LENGTH, KEY_LENGTH, DESCRIPTION_MIN_LENGTH, KEY_REGEX } = projectValidation;

type FormValuesType = {
  badge?: string;
  title?: string;
  description?: string;
  key?: string;
  authorId?: string;
};

function SettingsForm() {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const currentProject = useSelector((state: RootState) => state.projectSlice.project);
  const userList = useSelector((state: RootState) => state.projectSlice.users);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [values, setValues] = useState<FormValuesType>({});
  const [isLoaderGoing, setIsLoaderGoing] = useState(false);
  const [afterLoadingIcon, setAfterLoadingIcon] = useState(false);

  const errors = useMemo(() => {
    const obj = {
      title: '',
      description: '',
      key: ''
    };

    if (values.title && values.title.length < TITLE_MIN_LENGTH)
      obj.title = `Name should contain at least ${TITLE_MIN_LENGTH} characters`;

    if (values.description && values.description.length < DESCRIPTION_MIN_LENGTH)
      obj.description = `Description should contain at least ${DESCRIPTION_MIN_LENGTH} characters`;

    if (values.key && values.key.length !== KEY_LENGTH)
      obj.key = `Key should be equal ${KEY_LENGTH} characters`;
    else if (values.key && !values.key.match(KEY_REGEX)) obj.key = 'Key must contain only letters';

    return obj;
  }, [values.title, values.description, values.key]);

  const isBtnDisabled = useMemo(() => {
    if (isLoaderGoing || Object.values(errors).some((errorMess) => errorMess.length > 0))
      return true;
    if (!currentProject) return true;
    else
      return (
        (!values.title || currentProject.title === values.title) &&
        (!values.description || currentProject.description === values.description) &&
        (!values.key || currentProject.key === values.key) &&
        (!values.authorId || currentProject.author === values.authorId) &&
        (!values.badge || currentProject.badge === values.badge)
      );
  }, [values, currentProject, errors]);

  const showPopupHandler = useCallback(
    (badge: string) => {
      dispatch(
        setOverlayContent(
          <PopupProjectBadges
            setBadge={(value) => setValues((prev) => ({ ...prev, badge: value }))}
            badge={values.badge ?? badge}
          />
        )
      );
    },
    [values.badge]
  );

  const projectBadge = useMemo(() => {
    return badgesList.find((data) => `${data.id}` === currentProject?.badge);
  }, [currentProject?.badge]);

  const selectedBadge = useMemo(() => {
    return badgesList.find((data) => `${data.id}` === values.badge);
  }, [values.badge]);

  const onSubmitHandler = useCallback(() => {
    if (!Object.values(errors).every((errorMess) => errorMess.length === 0)) {
      dispatch(
        addAlert({
          type: 'error',
          message: 'You have to fill form correctly'
        })
      );
      return false;
    }
    if (currentProject) {
      setIsLoaderGoing(true);
      const updatedProject: { [key: string]: string } = {};
      if (values.title) updatedProject['title'] = values.title;
      if (values.description) updatedProject['description'] = values.description;
      if (values.key) updatedProject['key'] = values.key;
      if (values.authorId && currentProject.author !== values.authorId)
        updatedProject['author'] = values.authorId;
      if (values.badge) updatedProject['badge'] = values.badge;

      dispatch(updateProject(currentProject._id, updatedProject));

      setAfterLoadingIcon(true);
      setTimeout(() => setAfterLoadingIcon(false), 1500);

      setValues({});
      setIsLoaderGoing(false);
    }
  }, [values, errors]);

  return (
    <>
      {currentProject && (
        <div className={styles['form']}>
          <div className={styles['project-avatar']}>
            {values.badge && <div className={styles['changed']}>CHANGED</div>}
            <ProjectAvatar source={selectedBadge?.src ?? projectBadge?.src} typeSize="large" />
            <Button onClick={() => showPopupHandler(currentProject.badge)}>Change avatar</Button>
          </div>

          <fieldset className={styles['fieldset']}>
            <div className={styles['label']}>
              <Label text="Title" />
              {values.title && <div className={styles['changed']}>CHANGED</div>}
            </div>
            <ComponentWithMessage errorMessage={errors.title}>
              <Input
                value={values.title ?? currentProject.title}
                onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
                styleType={errors.title ? 'invalid' : undefined}
              />
            </ComponentWithMessage>
          </fieldset>

          <fieldset className={styles['fieldset']}>
            <div className={styles['label']}>
              <Label text="Description" />
              {values.description && <div className={styles['changed']}>CHANGED</div>}
            </div>
            <ComponentWithMessage errorMessage={errors.description}>
              <Input
                value={values.description ?? currentProject.description}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, description: event.target.value }))
                }
                styleType={errors.description ? 'invalid' : undefined}
              />
            </ComponentWithMessage>
          </fieldset>

          <fieldset className={styles['fieldset']}>
            <div className={styles['label']}>
              <Label text="Key" />
              {values.key && <div className={styles['changed']}>CHANGED</div>}
            </div>
            <ComponentWithMessage errorMessage={errors.key}>
              <Input
                value={values.key ?? currentProject.key}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, key: event.target.value.toUpperCase() }))
                }
                styleType={errors.key ? 'invalid' : undefined}
                maxLength={KEY_LENGTH}
              />
            </ComponentWithMessage>
          </fieldset>

          <fieldset className={styles['fieldset']}>
            <div className={styles['label']}>
              <Label text="Admin" />
              {values.authorId && <div className={styles['changed']}>CHANGED</div>}
            </div>
            <UserDropdown
              users={userList}
              activeUser={values.authorId ?? currentProject.author}
              onSelect={(id) => setValues((prev) => ({ ...prev, authorId: id }))}
              isDisabled={currentUser?._id !== currentProject.author}
              dropdownPosition="top"
            />
          </fieldset>

          <div className={styles['form-row']}>
            <Button
              type="submit"
              disabled={isBtnDisabled}
              title={isBtnDisabled ? 'Settings has no changes' : undefined}
              onClick={!isBtnDisabled ? onSubmitHandler : undefined}
              styleButton="primary">
              Save changes
            </Button>

            <div className={styles['form-loader']}>
              {isLoaderGoing && <Preloader />}
              {afterLoadingIcon && <MdDone />}
            </div>

            <Button className={styles['cancel']} onClick={() => setValues({})}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsForm;
