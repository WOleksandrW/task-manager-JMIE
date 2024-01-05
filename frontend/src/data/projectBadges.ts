import defaultBadge from '../assets/project-badges/default.png';
import badge_1 from '../assets/project-badges/1.svg';
import badge_2 from '../assets/project-badges/2.svg';
import badge_3 from '../assets/project-badges/3.svg';
import badge_4 from '../assets/project-badges/4.svg';
import badge_5 from '../assets/project-badges/5.svg';
import badge_6 from '../assets/project-badges/6.svg';
import badge_7 from '../assets/project-badges/7.svg';
import badge_8 from '../assets/project-badges/8.svg';
import badge_9 from '../assets/project-badges/9.svg';
import badge_10 from '../assets/project-badges/10.svg';
import badge_11 from '../assets/project-badges/11.svg';
import badge_12 from '../assets/project-badges/12.svg';
import badge_13 from '../assets/project-badges/13.svg';
import badge_14 from '../assets/project-badges/14.svg';
import badge_15 from '../assets/project-badges/15.svg';
import badge_16 from '../assets/project-badges/16.svg';
import badge_17 from '../assets/project-badges/17.svg';
import badge_18 from '../assets/project-badges/18.svg';
import badge_19 from '../assets/project-badges/19.svg';
import badge_20 from '../assets/project-badges/20.svg';
import badge_21 from '../assets/project-badges/21.svg';
import badge_22 from '../assets/project-badges/22.svg';
import badge_23 from '../assets/project-badges/23.svg';
import badge_24 from '../assets/project-badges/24.svg';
import badge_25 from '../assets/project-badges/25.svg';
import badge_26 from '../assets/project-badges/26.svg';

interface ProjectBadge {
  id: number;
  src: string;
  bg: string;
}

const COLOR_BG_BADGES = {
  blue: '#2785FF',
  lightBlue: '#06C7E7',
  darkBlue: '#253858',
  purple: '#6556C0',
  orange: '#FF5630',
  yellow: '#FFC400'
};

const badgesList: readonly ProjectBadge[] = [
  {
    id: 1,
    src: badge_1,
    bg: COLOR_BG_BADGES.blue
  },
  {
    id: 2,
    src: badge_2,
    bg: COLOR_BG_BADGES.lightBlue
  },
  {
    id: 3,
    src: badge_3,
    bg: COLOR_BG_BADGES.purple
  },
  {
    id: 4,
    src: badge_4,
    bg: COLOR_BG_BADGES.orange
  },
  {
    id: 5,
    src: badge_5,
    bg: COLOR_BG_BADGES.orange
  },
  {
    id: 6,
    src: badge_6,
    bg: COLOR_BG_BADGES.purple
  },
  {
    id: 7,
    src: badge_7,
    bg: COLOR_BG_BADGES.darkBlue
  },
  {
    id: 8,
    src: badge_8,
    bg: COLOR_BG_BADGES.purple
  },
  {
    id: 9,
    src: badge_9,
    bg: COLOR_BG_BADGES.yellow
  },
  {
    id: 10,
    src: badge_10,
    bg: COLOR_BG_BADGES.lightBlue
  },
  {
    id: 11,
    src: badge_11,
    bg: COLOR_BG_BADGES.lightBlue
  },
  {
    id: 12,
    src: badge_12,
    bg: COLOR_BG_BADGES.lightBlue
  },
  {
    id: 13,
    src: badge_13,
    bg: COLOR_BG_BADGES.blue
  },
  {
    id: 14,
    src: badge_14,
    bg: COLOR_BG_BADGES.orange
  },
  {
    id: 15,
    src: badge_15,
    bg: COLOR_BG_BADGES.yellow
  },
  {
    id: 16,
    src: badge_16,
    bg: COLOR_BG_BADGES.blue
  },
  {
    id: 17,
    src: badge_17,
    bg: COLOR_BG_BADGES.blue
  },
  {
    id: 18,
    src: badge_18,
    bg: COLOR_BG_BADGES.yellow
  },
  {
    id: 19,
    src: badge_19,
    bg: COLOR_BG_BADGES.purple
  },
  {
    id: 20,
    src: badge_20,
    bg: COLOR_BG_BADGES.yellow
  },
  {
    id: 21,
    src: badge_21,
    bg: COLOR_BG_BADGES.lightBlue
  },
  {
    id: 22,
    src: badge_22,
    bg: COLOR_BG_BADGES.orange
  },
  {
    id: 23,
    src: badge_23,
    bg: COLOR_BG_BADGES.orange
  },
  {
    id: 24,
    src: badge_24,
    bg: COLOR_BG_BADGES.blue
  },
  {
    id: 25,
    src: badge_25,
    bg: COLOR_BG_BADGES.purple
  },
  {
    id: 26,
    src: badge_26,
    bg: COLOR_BG_BADGES.lightBlue
  }
];

export default { defaultBadge, badgesList };
