import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Preloader } from '../../components';
import { InfoCards, ProjectForm } from './components';

import styles from './ProjectCreate.module.scss';

const FORM_ID = 'project-create-form';

function ProjectCreate() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const onCancelHandler = useCallback(() => {
    navigate('/projects');
  }, []);

  return (
    <section className={styles['project-create']}>
      {isLoading && (
        <div className={styles['preloader']}>
          <Preloader text="Creating project..." />
        </div>
      )}

      <div className={styles['content']}>
        <div className={styles['row']}>
          <div className={styles['project-form']}>
            <h1 className={styles['title']}>Add information about project</h1>
            <p className={styles['subtitle']}>
              You can edit information anytime in project settings
            </p>

            <ProjectForm id={FORM_ID} setLoader={setIsLoading} />
          </div>

          <InfoCards className={styles['info-cards']} />
        </div>

        <hr className={styles['hr']} />

        <div className={styles['buttons']}>
          <Button onClick={onCancelHandler}>Cancel</Button>
          <Button form={FORM_ID} styleButton="primary">
            Create project
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ProjectCreate;
