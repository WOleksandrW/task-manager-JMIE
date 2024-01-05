import projectBadges from './projectBadges';
import authValidation from './validation/authValidation';
import projectValidation from './validation/projectValidation';
import timeData from './time';
import sizesData from './sizes';
import colorsData from './colors';
import columnData from './column';
import taskData from './task';
import cloudinaryData from './cloudinary';

import { MdPerson } from 'react-icons/md';

const emptyUser = {
  id: 'auto',
  content: MdPerson,
  color: '#A3A3A3',
  name: 'Someone...'
};

export {
  projectBadges,
  authValidation,
  projectValidation,
  timeData,
  sizesData,
  columnData,
  taskData,
  colorsData,
  cloudinaryData,
  emptyUser
};
