import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import api from '../../../../api';
import { EmptyData, Preloader } from '../../../../components';
import { ProjectsTableData } from '../';
import UserType from '../../../../types/user/userType';

import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdStar } from 'react-icons/md';

import styles from './ProjectsTable.module.scss';

interface ProjectsTableProps {
  searchValue: string;
}

function ProjectsTable(props: ProjectsTableProps) {
  const projectsList = useSelector((state: RootState) => state.projectsSlice.projects);

  const [sortField, setSortField] = useState<'title' | 'key' | 'author'>('title');
  const [sortOrder, setSortOrder] = useState(false);
  const [authors, setAuthors] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customMessage, setCustomMessage] = useState('There are no projects');
  const [serverError, setServerError] = useState(false);

  const searchedProjects = useMemo(
    () => projectsList.filter((project) => project.title.includes(props.searchValue)),
    [projectsList, props.searchValue]
  );

  const projects = useMemo(() => {
    return searchedProjects.sort((a, b) =>
      sortOrder
        ? b[sortField].localeCompare(a[sortField])
        : a[sortField].localeCompare(b[sortField])
    );
  }, [searchedProjects, sortField, sortOrder]);

  const sortList = useCallback(
    (value: 'title' | 'key' | 'author') => {
      if (sortField === value) setSortOrder((prev) => !prev);
      else {
        setSortField(value);
        setSortOrder(false);
      }
    },
    [sortField]
  );

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const authorsId = Array.from(new Set(projectsList.map((project) => project.author)));
        const response = await api.users.getSeveral({ list: authorsId });
        setAuthors(response.data);
      } catch (error) {
        setCustomMessage('Server Error');
        setServerError(true);
      }
      setIsLoading(false);
    })();
  }, [projectsList]);

  return (
    <>
      {isLoading ? (
        <div className={styles['empty']}>
          <Preloader text={'Loading projects...'} />
        </div>
      ) : serverError || projects.length === 0 ? (
        <EmptyData text={customMessage} className={styles['empty']} />
      ) : (
        <table className={styles['table']}>
          <thead>
            <tr className={styles['row']}>
              <th className={styles['project-star']}>
                <MdStar className={styles['star-icon']} />
              </th>
              <th
                className={`${styles['project-title']} ${styles['sortable-cell']}`}
                onClick={() => sortList('title')}>
                <span className={styles['content']}>
                  Title
                  {sortField === 'title' && (
                    <span className={styles['icon']}>
                      {!sortOrder ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}
                    </span>
                  )}
                </span>
              </th>
              <th
                className={`${styles['project-key']} ${styles['sortable-cell']}`}
                onClick={() => sortList('key')}>
                <span className={styles['content']}>
                  Key
                  {sortField === 'key' && (
                    <span className={styles['icon']}>
                      {!sortOrder ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}
                    </span>
                  )}
                </span>
              </th>
              <th className={styles['project-description']}>Description</th>
              <th
                className={`${styles['project-author']} ${styles['sortable-cell']}`}
                onClick={() => sortList('author')}>
                <span className={styles['content']}>
                  Author
                  {sortField === 'author' && (
                    <span className={styles['icon']}>
                      {!sortOrder ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}
                    </span>
                  )}
                </span>
              </th>
              <th className={styles['project-menu']}></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const author = authors.find((user) => user._id === project.author);
              if (!author) return;
              return (
                <ProjectsTableData
                  id={project._id}
                  key={`project-${project._id}`}
                  title={project.title}
                  badge={project.badge}
                  projKey={project.key}
                  description={project.description}
                  author={author}
                />
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}

export default ProjectsTable;
