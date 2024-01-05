import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

import styles from './ProjectBreadcrumbs.module.scss';

interface ProjectBreadcrumbsProps {
  endPoint?: string;
  className?: string;
}

function ProjectBreadcrumbs(props: ProjectBreadcrumbsProps) {
  const currentProject = useSelector((state: RootState) => state.projectSlice.project);

  const className = useMemo(() => {
    let str = styles['breadcrumb-list'];
    if (props.className) str += ` ${props.className}`;
    return str;
  }, [props.className]);

  return (
    <ul className={className}>
      <li className={styles['breadcrumb']}>
        <Link to="/" className={styles['link']}>
          Homepage
        </Link>
      </li>

      <span>/</span>

      <li className={styles['breadcrumb']}>
        <Link to="/projects" className={styles['link']}>
          Projects
        </Link>
      </li>

      <span>/</span>

      <li className={styles['breadcrumb']}>{currentProject?.key ?? 'Project'}</li>

      {props.endPoint && (
        <>
          <span>/</span>
          <li className={styles['breadcrumb']}>{props.endPoint}</li>
        </>
      )}
    </ul>
  );
}

export default ProjectBreadcrumbs;
