import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { addAlert } from '../../../../redux/alertsSlice';
import { createProject } from '../../../../redux/projectsSlice';
import { getRandomNum } from '../../../../utils';
import { projectBadges, projectValidation } from '../../../../data';
import { ComponentWithMessage, Input, Label } from '../../../../components';

import styles from './ProjectForm.module.scss';

const { badgesList } = projectBadges;
const { TITLE_MIN_LENGTH, KEY_LENGTH, DESCRIPTION_MIN_LENGTH, KEY_REGEX } = projectValidation;

interface ProjectFormProps {
  id: string;
  setLoader: Dispatch<SetStateAction<boolean>>;
}

function ProjectForm(props: ProjectFormProps) {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [key, setKey] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = useCallback((data: { [key: string]: string }) => {
    const obj: { [key: string]: string } = {};

    if (data.title.length < TITLE_MIN_LENGTH)
      obj.title = `Name should contain at least ${TITLE_MIN_LENGTH} characters`;

    if (data.description.length < DESCRIPTION_MIN_LENGTH)
      obj.description = `Description should contain at least ${DESCRIPTION_MIN_LENGTH} characters`;

    if (data.key.length !== KEY_LENGTH) obj.key = `Key should be equal ${KEY_LENGTH} characters`;
    else if (!data.key.match(KEY_REGEX)) obj.key = 'Key must contain only letters';

    setErrors(obj);
    return !Object.values(obj).some((value) => value && value.length > 0);
  }, []);

  const onSubmitHandler = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      props.setLoader(true);

      const data = {
        title,
        description,
        key
      };
      const areValid = validate(data);

      if (areValid && currentUser) {
        const randomNum = getRandomNum(0, badgesList.length);
        const badge = badgesList[randomNum];

        dispatch(
          createProject({
            ...data,
            author: currentUser._id,
            badge: `${badge.id}`
          })
        );

        navigate('/projects');
      } else {
        dispatch(
          addAlert({
            type: 'error',
            message: 'You have to fill form correctly'
          })
        );
      }
      props.setLoader(false);
    },
    [currentUser?._id, title, key, description, errors]
  );

  return (
    <form className={styles['form']} id={props.id} onSubmit={onSubmitHandler}>
      <fieldset className={styles['fieldset']}>
        <Label text="Name" required />
        <ComponentWithMessage errorMessage={errors.title}>
          <Input
            placeholder="Try to use team name or purpose of the project"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            styleType={errors.title ? 'invalid' : undefined}
          />
        </ComponentWithMessage>
      </fieldset>

      <fieldset className={styles['fieldset']}>
        <Label text="Description" required />
        <ComponentWithMessage errorMessage={errors.description}>
          <Input
            placeholder="Describe your project with few words"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            styleType={errors.description ? 'invalid' : undefined}
          />
        </ComponentWithMessage>
      </fieldset>

      <fieldset className={styles['fieldset']}>
        <Label text="Key" required />
        <ComponentWithMessage errorMessage={errors.key}>
          <Input
            className={styles['key']}
            value={key}
            onChange={(event) => setKey(event.target.value.toUpperCase())}
            maxLength={KEY_LENGTH}
            styleType={errors.key ? 'invalid' : undefined}
          />
        </ComponentWithMessage>
      </fieldset>
    </form>
  );
}

export default ProjectForm;
