import React, { useCallback, useState } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { hideOverlay } from '../../../../../redux/overlaySlice';
import { projectBadges } from '../../../../../data';
import { Button, Modal } from '../../../../../components';

import styles from './PopupProjectBadges.module.scss';

const { badgesList } = projectBadges;

interface ProjectBadgesPopupProps {
  badge: string;
  setBadge: (value: string) => void;
}

function PopupProjectBadges(props: ProjectBadgesPopupProps) {
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [selectedBadge, setSelectedBadge] = useState(props.badge);

  const onSubmitHandler = useCallback(() => {
    props.setBadge(selectedBadge);
    dispatch(hideOverlay());
  }, [selectedBadge]);

  return (
    <Modal className={styles['popup']}>
      <p className={styles['title']}>Choose badge</p>

      <ul className={styles['badges-list']}>
        {badgesList.map((badge) => {
          const className =
            `${badge.id}` === selectedBadge
              ? `${styles['badge-item']} ${styles['selected']}`
              : styles['badge-item'];
          return (
            <li
              className={className}
              key={badge.id}
              onClick={() => setSelectedBadge(`${badge.id}`)}>
              <img className={styles['badge']} src={badge.src} alt="Project badge" />
            </li>
          );
        })}
      </ul>
      <div className={styles['buttons']}>
        <Button onClick={onSubmitHandler} styleButton="primary">
          Choose
        </Button>
        <Button onClick={() => dispatch(hideOverlay())}>Cancel</Button>
      </div>
    </Modal>
  );
}

export default PopupProjectBadges;
