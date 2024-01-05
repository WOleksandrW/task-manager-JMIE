import React, { useEffect, useMemo, useState } from 'react';
import { useComponentVisible } from '../../../../../hooks';
import { BoxWithShadow, Input, User } from '../../../../../components';
import UserType from '../../../../../types/user/userType';

import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';

import styles from './UserFilterDropdown.module.scss';

interface UserFilterDropdownProps {
  users: UserType[];
  selectedUsers: string[];
  onSelect: (userId: string) => void;
  onUnselect: (userId: string) => void;
}

function UserFilterDropdown(props: UserFilterDropdownProps) {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(
    false,
    'mousedown'
  );

  const [searchValue, setSearchValue] = useState('');

  const userList = useMemo(
    () =>
      props.users.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.email.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [props.users, searchValue]
  );

  useEffect(() => {
    if (!isComponentVisible) setSearchValue('');
  }, [isComponentVisible]);

  return (
    <div ref={ref} className={styles['user-dropdown']}>
      <div className={styles['display']}>
        {!isComponentVisible ? (
          <div className={styles['display-mess']} onClick={() => setIsComponentVisible(true)}>
            Filter users ({props.selectedUsers.length})
          </div>
        ) : (
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            autoFocus
            className={styles['input']}
          />
        )}
      </div>
      {isComponentVisible && (
        <BoxWithShadow className={styles['user-list']}>
          {userList.length > 0 ? (
            userList.map((user) => {
              const isSelected = props.selectedUsers.includes(user._id);

              return (
                <div
                  key={`filter-user-${user._id}`}
                  className={styles['filter-user']}
                  onClick={
                    !isSelected ? () => props.onSelect(user._id) : () => props.onUnselect(user._id)
                  }>
                  {isSelected ? (
                    <MdCheckBox className={styles['icon']} />
                  ) : (
                    <MdCheckBoxOutlineBlank className={styles['icon']} />
                  )}
                  <User
                    content={`${user.firstName} ${user.lastName}`}
                    color={user.color}
                    name={`${user.firstName} ${user.lastName}`}
                    subName={user.email}
                  />
                </div>
              );
            })
          ) : (
            <div className={styles['not-found-mess']}>Not Found</div>
          )}
        </BoxWithShadow>
      )}
    </div>
  );
}

export default UserFilterDropdown;
