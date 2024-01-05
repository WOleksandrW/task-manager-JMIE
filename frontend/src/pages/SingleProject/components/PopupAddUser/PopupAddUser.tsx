import { useCallback, useState, useTransition } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { setOverlayContent, hideOverlay } from '../../../../redux/overlaySlice';
import { addUserToProject } from '../../../../redux/projectSlice';
import api from '../../../../api';
import { Button, Input, Loader, Modal, Preloader, User } from '../../../../components';
import UserType from '../../../../types/user/userType';

import { MdSearch } from 'react-icons/md';

import styles from './PopupAddUser.module.scss';

function PopupAddUser() {
  const currentProject = useSelector((state: RootState) => state.projectSlice.project);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [selectedUser, setSelectedUser] = useState<UserType>();
  const [userList, setUserList] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');

  const [isPending, startTransition] = useTransition();

  const searchUsers = useCallback(
    async (value: string) => {
      setIsLoading(true);
      const response = await api.users.getAllData(
        `?no-project=${currentProject?._id}&value=${value}&limit=5`
      );
      setUserList(response.data);
      setIsLoading(false);
    },
    [currentProject?._id]
  );

  const onChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setValue(value);
      if (value.trim().length > 0) {
        startTransition(() => {
          searchUsers(value);
        });
      } else setUserList([]);
    },
    [searchUsers]
  );

  const onSubmitHandler = useCallback(() => {
    if (currentProject && selectedUser) {
      dispatch(setOverlayContent(<Loader />));
      dispatch(addUserToProject(currentProject._id, selectedUser._id));
      dispatch(hideOverlay());
    }
  }, [currentProject?._id, selectedUser]);

  return (
    <Modal className={styles['popup']}>
      <div className={styles['title']}>Add user to project</div>
      <div className={styles['content']}>
        {!selectedUser ? (
          <div className={styles['form']}>
            <Input
              value={value}
              className={styles['input']}
              id="add-user-input"
              required
              onChange={onChangeHandler}
              placeholder="Enter user name / email"
            />
            <div className={styles['icon']}>
              <MdSearch />
            </div>
            {value.trim().length > 0 && (
              <div className={styles['user-list']}>
                {isLoading || isPending ? (
                  <div className={styles['loader']}>
                    <Preloader />
                  </div>
                ) : userList.length > 0 ? (
                  userList.map((user) => (
                    <User
                      key={`user-${user._id}`}
                      content={`${user.firstName} ${user.lastName}`}
                      color={user.color}
                      name={`${user.firstName} ${user.lastName}`}
                      subName={user.email}
                      onClick={() => setSelectedUser(user)}
                    />
                  ))
                ) : (
                  <div className={styles['not-found']}>Not Found</div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className={styles['user']}>
            <User
              content={`${selectedUser.firstName} ${selectedUser.lastName}`}
              color={selectedUser.color}
              name={`${selectedUser.firstName} ${selectedUser.lastName}`}
              subName={selectedUser.email}
              onClick={() => setSelectedUser(undefined)}
            />
          </div>
        )}
      </div>
      <div className={styles['buttons']}>
        <Button onClick={onSubmitHandler} styleButton="primary">
          Add
        </Button>
        <Button onClick={() => dispatch(hideOverlay())}>Cancel</Button>
      </div>
    </Modal>
  );
}

export default PopupAddUser;
