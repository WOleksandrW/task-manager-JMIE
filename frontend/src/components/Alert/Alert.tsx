import React, { useEffect, useMemo } from 'react';
import { timeData } from '../../data';

import {
  MdErrorOutline as ErrorIcon,
  MdWarningAmber as WarningIcon,
  MdInfoOutline as InfoIcon,
  MdCheckCircleOutline as SuccessIcon,
  MdOutlineClear as RemoveIcon
} from 'react-icons/md';

import styles from './Alert.module.scss';

export type AlertType = 'warning' | 'success' | 'error' | 'info';

export interface AlertProps {
  id: string;
  type: AlertType;
  message: string;
  onClick: () => void;
}

const ICONS_MAP = {
  warning: WarningIcon,
  error: ErrorIcon,
  success: SuccessIcon,
  info: InfoIcon
};

const { DELAY_TO_REMOVE_ALERT } = timeData;

function Alert(props: AlertProps) {
  const className = useMemo(() => [styles['alert'], styles[props.type]].join(' '), [props.type]);

  const IconAlert = useMemo(() => ICONS_MAP[props.type], [props.type]);

  useEffect(() => {
    setTimeout(() => {
      if (props.onClick) props.onClick();
    }, DELAY_TO_REMOVE_ALERT);
  }, []);

  return (
    <div className={className}>
      <div className={styles['info']}>
        <IconAlert className={styles['icon']} />
        <p className={styles['message']}>{props.message}</p>
      </div>

      <RemoveIcon className={styles['remove']} onClick={props.onClick} />
    </div>
  );
}

export default Alert;
