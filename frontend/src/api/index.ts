import instance from './instance';

import usersModule from './users';
import columnsModule from './columns';
import notedModule from './noted';
import authModule from './auth';

export default {
  users: usersModule(instance),
  columns: columnsModule(instance),
  noted: notedModule(instance),
  auth: authModule(instance)
};
