import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useComponentVisible } from '../../../../hooks';
import { BoxWithShadow, Input, User } from '../../../../components';
import UserType from '../../../../types/user/userType';

import { IconType } from 'react-icons';

import styles from './UserDropdown.module.scss';

type EmptyUserType = {
  id: string;
  content: string | IconType;
  color: string;
  name: string;
  subName?: string;
};

interface UserDropdownProps {
  users: UserType[];
  activeUser: string;
  onSelect: (userId: string) => void;
  emptyUser?: EmptyUserType;
  isDisabled?: boolean;
  dropdownPosition?: 'top' | 'bottom';
}

function UserDropdown(props: UserDropdownProps) {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(
    false,
    'mousedown'
  );

  const [searchValue, setSearchValue] = useState('');

  const userListNoActive = useMemo(
    () => props.users.filter((user) => user._id !== props.activeUser),
    [props.activeUser, props.users]
  );

  const userList = useMemo(
    () =>
      userListNoActive.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`.includes(searchValue) ||
          user.email.includes(searchValue)
      ),
    [userListNoActive, searchValue]
  );

  const activeUser = useMemo(
    () => props.users.find((user) => user._id === props.activeUser),
    [props.activeUser, props.users]
  );

  const activeUserDisplay = useMemo(() => {
    if (activeUser) {
      return {
        content: `${activeUser.firstName} ${activeUser.lastName}`,
        color: activeUser.color,
        name: `${activeUser.firstName} ${activeUser.lastName}`,
        subName: activeUser.email
      };
    } else if (props.emptyUser) return props.emptyUser;
  }, [activeUser, props.emptyUser]);

  const userListClassNames = useMemo(() => {
    let str = styles['user-list'];
    if (props.dropdownPosition) str += ` ${styles[props.dropdownPosition]}`;
    else str += ` ${styles['bottom']}`;
    return str;
  }, []);

  const selectUser = useCallback((userId: string) => {
    props.onSelect(userId);
    setIsComponentVisible(false);
  }, []);

  useEffect(() => {
    if (!isComponentVisible) setSearchValue('');
  }, [isComponentVisible]);

  return (
    <div ref={ref} className={styles['user-dropdown']}>
      <div className={styles['display']}>
        {!isComponentVisible ? (
          activeUserDisplay ? (
            <User
              content={activeUserDisplay.content}
              color={activeUserDisplay.color}
              name={activeUserDisplay.name}
              subName={activeUserDisplay.subName}
              onClick={() => !props.isDisabled && setIsComponentVisible((prev) => !prev)}
            />
          ) : (
            <div className={styles['error']}>Error</div>
          )
        ) : (
          <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} autoFocus />
        )}
      </div>
      {isComponentVisible && (
        <BoxWithShadow className={userListClassNames}>
          {userList.length > 0 || (props.emptyUser && activeUser) ? (
            <>
              {props.emptyUser && activeUser && (
                <User
                  content={props.emptyUser.content}
                  color={props.emptyUser.color}
                  name={props.emptyUser.name}
                  subName={props.emptyUser.subName}
                  onClick={() => selectUser(`${props.emptyUser?.id}`)}
                />
              )}
              {userList.map((user) => (
                <User
                  key={`user-${user._id}`}
                  content={`${user.firstName} ${user.lastName}`}
                  color={user.color}
                  name={`${user.firstName} ${user.lastName}`}
                  subName={user.email}
                  onClick={() => selectUser(user._id)}
                />
              ))}
            </>
          ) : (
            <div className={styles['not-found-mess']}>Not Found</div>
          )}
        </BoxWithShadow>
      )}
    </div>
  );
}

export default UserDropdown;
