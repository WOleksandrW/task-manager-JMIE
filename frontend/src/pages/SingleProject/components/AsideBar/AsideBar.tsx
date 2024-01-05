import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { projectBadges, sizesData } from '../../../../data';
import { ProjectAvatar } from '../../../../components';
import { AsideNavElement } from '../';

import {
  MdKeyboardArrowLeft as IconLeft,
  MdKeyboardArrowRight as IconRight,
  MdOutlineViewColumn as BoardIcon,
  MdSettings as SettingsIcon,
  MdSupervisorAccount as TeamIcon
} from 'react-icons/md';

import styles from './AsideBar.module.scss';

const { badgesList } = projectBadges;
const { WIDTH_MEDIA_TABLET } = sizesData;

function AsideBar() {
  const currentProject = useSelector((state: RootState) => state.projectSlice.project);
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(window.screen.width <= WIDTH_MEDIA_TABLET);

  const refLinkBoard = useRef<HTMLLIElement>(null);
  const refLinkTeam = useRef<HTMLLIElement>(null);
  const refLinkSettings = useRef<HTMLLIElement>(null);
  const refActiveBar = useRef<HTMLDivElement>(null);

  const className = useMemo(() => {
    let str = styles['aside-bar'];
    if (isCollapsed) str += ` ${styles['collapsed']}`;
    return str;
  }, [isCollapsed]);

  const currentPath = useMemo(() => location.pathname.split('/')[3], [location.pathname]);

  const navLinks = useMemo(
    () => [
      {
        icon: BoardIcon,
        title: 'Board',
        link: 'board',
        ref: refLinkBoard
      },
      {
        icon: TeamIcon,
        title: 'Team',
        link: 'team',
        ref: refLinkTeam
      },
      {
        icon: SettingsIcon,
        title: 'Settings',
        link: 'settings',
        ref: refLinkSettings
      }
    ],
    []
  );

  const projectBadge = useMemo(() => {
    return badgesList.find((data) => `${data.id}` === currentProject?.badge);
  }, [currentProject?.badge]);

  useEffect(() => {
    switch (currentPath) {
      case 'board':
        if (refLinkBoard.current && refActiveBar.current) {
          const top = refLinkBoard.current.offsetTop;
          const height = refLinkBoard.current.offsetHeight;
          refActiveBar.current.style.height = `${height / 2}px`;
          refActiveBar.current.style.top = `${top + height / 2}px`;
        }
        break;
      case 'team':
        if (refLinkTeam.current && refActiveBar.current) {
          const top = refLinkTeam.current.offsetTop;
          const height = refLinkTeam.current.offsetHeight;
          refActiveBar.current.style.height = `${height / 2}px`;
          refActiveBar.current.style.top = `${top + height / 2}px`;
        }
        break;
      case 'settings':
        if (refLinkSettings.current && refActiveBar.current) {
          const top = refLinkSettings.current.offsetTop;
          const height = refLinkSettings.current.offsetHeight;
          refActiveBar.current.style.height = `${height / 2}px`;
          refActiveBar.current.style.top = `${top + height / 2}px`;
        }
        break;
      default:
        if (refActiveBar.current) {
          refActiveBar.current.style.height = '0px';
          refActiveBar.current.style.top = '0px';
        }
        break;
    }
  }, [currentPath]);

  return (
    <aside className={className}>
      <div className={styles['button']} onClick={() => setIsCollapsed((prev) => !prev)}>
        {isCollapsed ? <IconRight /> : <IconLeft />}
      </div>

      <div className={styles['project']}>
        <ProjectAvatar source={projectBadge?.src} />

        <div className={styles['info']}>
          <p className={styles['title']}>{currentProject?.title}</p>
          <p className={styles['description']}>{currentProject?.description}</p>
        </div>
      </div>

      <nav className={styles['navigation']}>
        <p className={styles['nav-title']}>Project</p>

        <ul className={styles['nav-list']}>
          {navLinks.map((navLink, idx) => {
            const { ref, ...otherProps } = navLink;
            return (
              <li key={`aside-link-${idx}`} ref={ref}>
                <AsideNavElement isActive={currentPath === navLink.link} {...otherProps} />
              </li>
            );
          })}
          <div className={styles['active-bar']} ref={refActiveBar} />
        </ul>
      </nav>
    </aside>
  );
}

export default AsideBar;
