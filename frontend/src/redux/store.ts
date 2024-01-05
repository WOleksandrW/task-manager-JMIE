import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import immutableStateInvariantMiddleware from 'redux-immutable-state-invariant';
import thunkMiddleware from 'redux-thunk';

import alertsSlice from './alertsSlice';
import taskSlice from './taskSlice';
import overlaySlice from './overlaySlice';
import projectSlice from './projectSlice';
import projectsSlice from './projectsSlice';
import signInUpSlice from './signInUpSlice';
import userSlice from './userSlice';
import websocketSlice from './websocketSlice';

const rootReducer = combineReducers({
  alertsSlice,
  taskSlice,
  overlaySlice,
  projectSlice,
  projectsSlice,
  signInUpSlice,
  userSlice,
  websocketSlice
});

const middleware = [thunkMiddleware];

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware:
      process.env.NODE_ENV === 'development'
        ? [immutableStateInvariantMiddleware(), ...middleware]
        : middleware
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
