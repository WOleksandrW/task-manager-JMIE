import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { EmptyData } from '../../../../components';
import { ProjectItem } from '../';

import styles from './UserProjects.module.scss';

interface UserProjectsProps {
  className?: string;
}

function UserProjects(props: UserProjectsProps) {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const recentList = useSelector((state: RootState) => state.userSlice.recentProjects);
  const projectsList = useSelector((state: RootState) => state.projectsSlice.projects);

  const className = useMemo(() => {
    let str = styles['user-projects'];
    if (props.className) str += ` ${props.className}`;
    return str;
  }, [props.className]);

  const recentProjects = useMemo(
    () => projectsList.filter((project) => recentList.includes(project._id)),
    [projectsList, recentList]
  );

  const ownProjects = useMemo(
    () => projectsList.filter((project) => project.author === currentUser?._id),
    [projectsList, currentUser?._id]
  );

  const memberProjects = useMemo(
    () => projectsList.filter((project) => project.author !== currentUser?._id),
    [projectsList, currentUser?._id]
  );

  return (
    <div className={className}>
      <div className={styles['list-block']}>
        <h2 className={styles['title']}>Recently viewed projects</h2>
        <div className={styles['list']}>
          {recentProjects.length ? (
            recentProjects.map((project) => (
              <ProjectItem
                key={project._id}
                id={project._id}
                title={project.title}
                projKey={project.key}
                badge={project.badge}
              />
            ))
          ) : (
            <EmptyData text="List is empty" className={styles['empty']} />
          )}
        </div>
      </div>
      <div className={styles['list-block']}>
        <h2 className={styles['title']}>Owned projects</h2>
        <div className={styles['list']}>
          {ownProjects.length ? (
            ownProjects.map((project) => (
              <ProjectItem
                key={project._id}
                id={project._id}
                title={project.title}
                projKey={project.key}
                badge={project.badge}
              />
            ))
          ) : (
            <EmptyData text="List is empty" className={styles['empty']} />
          )}
        </div>
      </div>
      <div className={styles['list-block']}>
        <h2 className={styles['title']}>Projects as member</h2>
        <div className={styles['list']}>
          {memberProjects.length ? (
            memberProjects.map((project) => (
              <ProjectItem
                key={project._id}
                id={project._id}
                title={project.title}
                projKey={project.key}
                badge={project.badge}
              />
            ))
          ) : (
            <EmptyData text="List is empty" className={styles['empty']} />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProjects;
