import React, { useCallback, useState } from 'react';
import { Preloader, UserAvatar } from '../../../../../components';
import UserType from '../../../../../types/user/userType';

import styles from './TeamTableData.module.scss';

interface TeamTableDataProps {
  user: UserType;
  isAdmin: boolean;
  onRemove?: () => void;
}

function TeamTableData(props: TeamTableDataProps) {
  const [isLoaded, setIsLoaded] = useState(true);

  const onClickHandler = useCallback(() => {
    if (props.onRemove) {
      setIsLoaded(false);
      props.onRemove();
      setIsLoaded(true);
    }
  }, [props.onRemove]);

  return (
    <tr className={styles['table-data']}>
      <td className={`${styles['data']} ${styles['data-user']}`}>
        <UserAvatar
          content={`${props.user.firstName} ${props.user.lastName}`}
          color={props.user.color}
          typeSize="medium"
        />
        <p className={styles['info']}>{`${props.user.firstName} ${props.user.lastName}`}</p>
      </td>

      <td className={styles['data']}>
        <p className={styles['info']}>{props.user.email}</p>
      </td>

      <td className={styles['data']}>
        <p>{props.isAdmin ? 'Admin' : 'Collaborator'}</p>
      </td>

      <td className={styles['data']}>
        {!props.isAdmin && props.onRemove && (
          <span className={styles['remove']} onClick={onClickHandler}>
            Remove
          </span>
        )}
      </td>

      {!isLoaded && (
        <td className={styles['preloader']}>
          <Preloader />
        </td>
      )}
    </tr>
  );
}

export default TeamTableData;
