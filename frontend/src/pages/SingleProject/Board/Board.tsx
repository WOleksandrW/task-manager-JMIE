import React, { useState, useMemo, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  addUserToFilter,
  removeUserFromFilter,
  resetFilterData,
  setSearchValue
} from '../../../redux/projectSlice';
import { updateProject } from '../../../redux/projectsSlice';
import { addNoted, removeNoted } from '../../../redux/userSlice';
import { Preloader, BtnAction, EditableText, Input, SelectPanel } from '../../../components';
import { ProjectBreadcrumbs } from '../components';
import { ColumnList, UserFilterDropdown } from './components';

import { MdStarOutline, MdSearch, MdStar, MdCancel } from 'react-icons/md';

import styles from './Board.module.scss';

function Board() {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const notedList = useSelector((state: RootState) => state.userSlice.noted);
  const loaderNoted = useSelector((state: RootState) => state.userSlice.loaderNoted);
  const currentProject = useSelector((state: RootState) => state.projectSlice.project);
  const userList = useSelector((state: RootState) => state.projectSlice.users);
  const searchValue = useSelector((state: RootState) => state.projectSlice.searchValue);
  const filteredUsers = useSelector((state: RootState) => state.projectSlice.filterUser);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [selectedGroup, setSelectedGroup] = useState('');

  const isNoted = useMemo(
    () => notedList.some((data) => data._id === currentProject?._id),
    [notedList, currentProject?._id]
  );

  const isLoadingNoted = useMemo(
    () => loaderNoted.includes(`${currentProject?._id}`),
    [loaderNoted, currentProject?._id]
  );

  const optionsGroupSelect = useMemo(() => {
    return [
      { value: '', text: 'No' },
      { value: 'Executor', text: 'Executor' }
    ];
  }, []);

  const onClickBtnNote = useCallback(() => {
    if (currentUser && currentProject) {
      if (!isNoted) dispatch(addNoted(currentUser._id, currentProject._id, 'project'));
      else dispatch(removeNoted(currentUser._id, currentProject._id));
    }
  }, [currentUser, currentProject?._id, isNoted]);

  const onSubmitHandler = useCallback(
    async (value: string) => {
      if (currentProject) {
        dispatch(updateProject(currentProject._id, { boardTitle: value }));
        return true;
      }
      return false;
    },
    [currentProject?._id]
  );

  return (
    <>
      <ProjectBreadcrumbs endPoint="Project board" />
      <div className={styles['info-block']}>
        <div className={styles['info']}>
          <EditableText
            value={currentProject?.boardTitle ?? ''}
            onSubmit={onSubmitHandler}
            classNameObj={{
              form: styles['editable-form'],
              input: styles['editable-input'],
              text: styles['editable-text']
            }}
            title="Board"
          />
          <div className={styles['action-list']}>
            <div className={styles['btn-action']}>
              {isLoadingNoted ? (
                <Preloader />
              ) : (
                <BtnAction
                  image={isNoted ? MdStar : MdStarOutline}
                  className={isNoted ? styles['active-star'] : styles['star']}
                  title="Add to the list"
                  onClick={onClickBtnNote}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles['command-panel']}>
          <div className={styles['search-filter']}>
            <div className={styles['search-block']}>
              <Input
                id="task-search"
                className={styles['input']}
                placeholder="Search..."
                value={searchValue}
                onChange={(event) => dispatch(setSearchValue(event.target.value))}
              />
              <label className={styles['icon']} htmlFor="task-search">
                <MdSearch />
              </label>
            </div>
            <div className={styles['filter-block']}>
              <UserFilterDropdown
                users={userList}
                onSelect={(id: string) => dispatch(addUserToFilter(id))}
                onUnselect={(id: string) => dispatch(removeUserFromFilter(id))}
                selectedUsers={filteredUsers}
              />
            </div>
            {(searchValue.length > 0 || filteredUsers.length > 0) && (
              <button
                className={styles['btn-reset-filters']}
                onClick={() => dispatch(resetFilterData())}>
                <MdCancel />
              </button>
            )}
          </div>
          <div className={styles['select-panel']}>
            <div className={styles['title']}>Group by:</div>
            <SelectPanel
              options={optionsGroupSelect}
              onSelect={setSelectedGroup}
              selectedItem={optionsGroupSelect.findIndex(
                (option) => option.value === selectedGroup
              )}
            />
          </div>
        </div>
      </div>
      <div className={styles['column-list-block']}>
        <ColumnList group={selectedGroup === 'Executor' ? selectedGroup : ''} />
      </div>
      <Outlet />
    </>
  );
}

export default Board;
