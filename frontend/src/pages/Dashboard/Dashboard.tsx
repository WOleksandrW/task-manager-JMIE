import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MarkedItemsList, ProjectsList, TasksList } from './components';

import styles from './Dashboard.module.scss';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('tasks');

  const refTabTasks = useRef<HTMLLIElement>(null);
  const refTabMarked = useRef<HTMLLIElement>(null);
  const refActiveBar = useRef<HTMLDivElement>(null);

  const tabList = useMemo(
    () => [
      {
        value: 'tasks',
        title: 'Assigned to you',
        ref: refTabTasks
      },
      {
        value: 'marked',
        title: 'Marked',
        ref: refTabMarked
      }
    ],
    []
  );

  useEffect(() => {
    switch (activeTab) {
      case 'tasks':
        if (refTabTasks.current && refActiveBar.current) {
          refActiveBar.current.style.width = `${refTabTasks.current.offsetWidth}px`;
          refActiveBar.current.style.left = `${refTabTasks.current.offsetLeft}px`;
        }
        break;
      case 'marked':
        if (refTabMarked.current && refActiveBar.current) {
          refActiveBar.current.style.width = `${refTabMarked.current.offsetWidth}px`;
          refActiveBar.current.style.left = `${refTabMarked.current.offsetLeft}px`;
        }
        break;
      default:
        if (refActiveBar.current) {
          refActiveBar.current.style.width = '0px';
          refActiveBar.current.style.left = '0px';
        }
        break;
    }
  }, [activeTab]);

  return (
    <main className={styles['dashboard']}>
      <section className={styles['projects']}>
        <div className={styles['row']}>
          <h2 className={styles['title']}>Recent projects</h2>
          <div className={styles['link-list']}>
            <Link className={styles['link']} to="/projects">
              All projects
            </Link>
            <Link className={styles['link']} to="/create-project">
              Create project
            </Link>
          </div>
        </div>
        <ProjectsList />
      </section>

      <section className={styles['tasks']}>
        <ul className={styles['tab-list']}>
          {tabList.map((tab) => (
            <li
              key={`tab-${tab.value}`}
              className={`${styles['tab']} ${activeTab === tab.value && styles['active']}`}
              onClick={() => setActiveTab(tab.value)}
              ref={tab.ref}>
              {tab.title}
            </li>
          ))}
          <div className={styles['active-bar']} ref={refActiveBar} />
        </ul>
        <ul className={styles['list']}>
          {activeTab === 'tasks' && <TasksList />}
          {activeTab === 'marked' && <MarkedItemsList />}
        </ul>
      </section>
    </main>
  );
}

export default Dashboard;
