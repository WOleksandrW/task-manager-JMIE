import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Button, UserAvatar } from '../../components';
import {
  ContentAssignedTasks,
  ContentProfileMenu,
  ContentRecentProjects,
  DropdownMenu
} from './components';

import styles from './Header.module.scss';

const Header = () => {
  const currentUser = useSelector((state: RootState) => state.userSlice.user);
  const navigate = useNavigate();

  return (
    <header className={styles['header']}>
      <div className={styles['inner']}>
        <Link className={styles['title-block']} to="/">
          <div className={styles['logo']}></div>
          <h2 className={styles['title']}>JMIE</h2>
        </Link>
        <nav className={styles['navigation']}>
          <ul className={styles['nav-list']}>
            <li className={styles['nav-item']}>
              <DropdownMenu text="Your work" menuContent={ContentAssignedTasks} />
            </li>
            <li className={styles['nav-item']}>
              <DropdownMenu text="Projects" menuContent={ContentRecentProjects} />
            </li>
            <li className={styles['nav-item']}>
              <Button onClick={() => navigate('/create-project')} styleButton="primary">
                Create
              </Button>
            </li>
          </ul>
        </nav>
        <div className={styles['user-menu']}>
          <DropdownMenu
            node={
              <UserAvatar
                content={`${currentUser?.firstName} ${currentUser?.lastName}`}
                color={`${currentUser?.color}`}
                typeSize="medium"
              />
            }
            menuContent={ContentProfileMenu}
            side="right"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
