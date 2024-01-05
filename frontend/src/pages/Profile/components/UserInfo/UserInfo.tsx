import React, { useCallback, useMemo } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { updateUser } from '../../../../redux/userSlice';
import { BoxWithShadow, EditableText, Label } from '../../../../components';

import { BiBuildingHouse } from 'react-icons/bi';
import { FaRegEnvelope } from 'react-icons/fa';
import { GiPositionMarker } from 'react-icons/gi';
import { MdWorkspacesOutline } from 'react-icons/md';
import { RiBriefcase5Line } from 'react-icons/ri';

import styles from './UserInfo.module.scss';

interface UserInfoProps {
  className?: string;
}

function UserInfo(props: UserInfoProps) {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const className = useMemo(() => {
    let str = styles['user-info'];
    if (props.className) str += ` ${props.className}`;
    return str;
  }, [props.className]);

  const updateData = useCallback(
    async (key: string, value: string) => {
      if (currentUser) {
        dispatch(updateUser(currentUser._id, { [key]: value }));
      }
      return true;
    },
    [currentUser]
  );

  return (
    <div className={className}>
      <h1 className={styles['name']}>{`${currentUser?.firstName} ${currentUser?.lastName}`}</h1>
      <div className={styles['box']}>
        <div className={styles['info-block']}>
          <h3 className={styles['title']}>Information</h3>
          <ul className={styles['info-list']}>
            <li className={styles['info-item']}>
              <Label text="Job title" className={styles['label']} />
              <div className={styles['input-field']}>
                <RiBriefcase5Line className={styles['icon']} />
                <EditableText
                  value={`${currentUser?.jobTitleInfo}`}
                  onSubmit={(value) => updateData('jobTitleInfo', value)}
                  classNameObj={{
                    'form-container': styles['form-container'],
                    form: styles['form'],
                    text: styles['text'],
                    input: styles['input'],
                    placeholder: styles['placeholder']
                  }}
                  emptyPlaceholder="Enter Job title"
                />
              </div>
            </li>
            <li className={styles['info-item']}>
              <Label text="Department" className={styles['label']} />
              <div className={styles['input-field']}>
                <MdWorkspacesOutline className={styles['icon']} />
                <EditableText
                  value={`${currentUser?.departmentInfo}`}
                  onSubmit={(value) => updateData('departmentInfo', value)}
                  classNameObj={{
                    'form-container': styles['form-container'],
                    form: styles['form'],
                    text: styles['text'],
                    input: styles['input'],
                    placeholder: styles['placeholder']
                  }}
                  emptyPlaceholder="Enter Department"
                />
              </div>
            </li>
            <li className={styles['info-item']}>
              <Label text="Organization" className={styles['label']} />
              <div className={styles['input-field']}>
                <BiBuildingHouse className={styles['icon']} />
                <EditableText
                  value={`${currentUser?.organizationInfo}`}
                  onSubmit={(value) => updateData('organizationInfo', value)}
                  classNameObj={{
                    'form-container': styles['form-container'],
                    form: styles['form'],
                    text: styles['text'],
                    input: styles['input'],
                    placeholder: styles['placeholder']
                  }}
                  emptyPlaceholder="Enter Organization"
                />
              </div>
            </li>
            <li className={styles['info-item']}>
              <Label text="Location" className={styles['label']} />
              <div className={styles['input-field']}>
                <GiPositionMarker className={styles['icon']} />
                <EditableText
                  value={`${currentUser?.locationInfo}`}
                  onSubmit={(value) => updateData('locationInfo', value)}
                  classNameObj={{
                    'form-container': styles['form-container'],
                    form: styles['form'],
                    text: styles['text'],
                    input: styles['input'],
                    placeholder: styles['placeholder']
                  }}
                  emptyPlaceholder="Enter Location"
                />
              </div>
            </li>
          </ul>
        </div>
        <div className={styles['info-block']}>
          <h3 className={styles['title']}>Contacts</h3>
          <div className={`${styles['input-field']} ${styles['email']}`}>
            <FaRegEnvelope className={styles['icon']} />
            <span className={styles['placeholder']}>{currentUser?.email}</span>
            <BoxWithShadow className={styles['warning']}>You can not change email</BoxWithShadow>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
