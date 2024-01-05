import React, { useCallback, useMemo, useState } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { removeUserFromProject } from '../../../../../redux/projectSlice';
import { EmptyData, Input } from '../../../../../components';
import { TeamTableData } from '../';

import { MdExpandLess, MdExpandMore, MdSearch } from 'react-icons/md';

import styles from './TeamTable.module.scss';

function TeamTable() {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const currentProject = useSelector((state: RootState) => state.projectSlice.project);
  const userList = useSelector((state: RootState) => state.projectSlice.users);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [searchValue, setSearchValue] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState(false);

  const users = useMemo(() => {
    return userList
      .filter(
        (user) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.email.toLowerCase().includes(searchValue.toLowerCase())
      )
      .sort((a, b) => {
        switch (true) {
          case sortField === 'name': {
            const aFullName = `${a.firstName} ${a.lastName}`;
            const bFullName = `${b.firstName} ${b.lastName}`;
            return sortOrder
              ? bFullName.localeCompare(aFullName)
              : aFullName.localeCompare(bFullName);
          }
          case sortField === 'email':
            return sortOrder ? b.email.localeCompare(a.email) : a.email.localeCompare(b.email);
          default:
            return 1;
        }
      });
  }, [userList, searchValue, sortOrder]);

  const sortList = useCallback(
    (value: string) => {
      if (sortField === value) setSortOrder((prev) => !prev);
      else {
        setSortField(value);
        setSortOrder(false);
      }
    },
    [sortField]
  );

  const removeCollaborator = useCallback(
    (userId: string) => {
      if (currentProject) {
        dispatch(removeUserFromProject(currentProject._id, userId));
      }
    },
    [currentProject?._id]
  );

  const thList = useMemo(() => ['name', 'email'], []);

  return (
    <>
      <div className={styles['input-wrapper']}>
        <Input
          id="team-search"
          placeholder="Search by name or email"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />

        <label className={styles['icon']} htmlFor="team-search">
          <MdSearch />
        </label>
      </div>

      <div className={styles['table-wrapper']}>
        <table className={styles['table']}>
          <thead>
            <tr className={styles['row-header']}>
              {thList.map((data) => (
                <th key={`team-th-${data}`} className={styles[data]} onClick={() => sortList(data)}>
                  <div className={styles['th-content']}>
                    {data}
                    {sortField === data && (sortOrder ? <MdExpandLess /> : <MdExpandMore />)}
                  </div>
                </th>
              ))}
              <th className={styles['role']}>Role</th>
              <th className={styles['remove']} />
            </tr>
          </thead>

          <tbody>
            {users.length ? (
              users.map((user) => (
                <TeamTableData
                  key={user._id}
                  user={user}
                  isAdmin={user._id === currentProject?.author}
                  onRemove={
                    currentUser?._id === currentProject?.author
                      ? () => removeCollaborator(user._id)
                      : undefined
                  }
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className={styles['preloader']}>
                  <EmptyData text="Error" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TeamTable;
