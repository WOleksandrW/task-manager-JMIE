import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { List } from '../../../../components';
import { ProjectCard } from '../';
import { ProjectType } from '../../../../types/project/projectType';

import styles from './ProjectsList.module.scss';

function ProjectsList() {
  const projectsList = useSelector((state: RootState) => state.projectsSlice.projects);
  const recentProjects = useSelector((state: RootState) => state.userSlice.recentProjects);

  const displayProjects = useMemo(() => {
    return recentProjects
      .map((id) => projectsList.find((project) => project._id === id))
      .filter((project) => project !== undefined) as ProjectType[];
  }, [recentProjects, projectsList]);

  return (
    <List
      isLoading={false}
      count={displayProjects.length}
      textLoader="Loading projects..."
      textEmpty={'There are no recent projects'}>
      <ul className={styles['list']}>
        {displayProjects.map((project) => (
          <ProjectCard
            id={project._id}
            title={project.title}
            description={project.description}
            badge={project.badge}
            key={project._id}
          />
        ))}
      </ul>
    </List>
  );
}

export default ProjectsList;
