import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '../../components';
import { ProjectsTable } from './components';

import { MdSearch, MdArrowLeft } from 'react-icons/md';

import styles from './Projects.module.scss';

function Projects() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className={styles['wrapper']}>
      <div className={styles['header']}>
        <div className={styles['link-block']}>
          <Link className={styles['link']} to="/">
            <MdArrowLeft className={styles['icon-back']} /> Go to home
          </Link>
        </div>
        <div className={styles['header-content']}>
          <h1 className={styles['title']}>Projects</h1>
          <Link to="/create-project">
            <Button styleButton="primary">Create Project</Button>
          </Link>
        </div>
      </div>
      <div className={styles['search-block']}>
        <Input
          id="search-projects"
          className={styles['input']}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search project"
        />
        <label htmlFor="search-projects" className={styles['icon']}>
          <MdSearch />
        </label>
      </div>
      <div className={styles['table-block']}>
        <ProjectsTable searchValue={searchValue} />
      </div>
    </div>
  );
}

export default Projects;
