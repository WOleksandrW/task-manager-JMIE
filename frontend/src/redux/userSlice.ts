/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import type { Dispatch, PayloadAction } from '@reduxjs/toolkit';
import CurrentUserType from '../types/user/currentUserType';
import TaskType from '../types/task/taskType';
import websocketAPI, {
  SubscribeTaskType,
  SubscribeNotedType,
  SubscribeStringType,
  SubscribeUserType
} from '../api/websocket-api';
import { NotedItemUserType } from '../types/user/notedItemUserType';

export interface IUserState {
  user?: CurrentUserType;
  loaderNoted: string[];
  assignedTasks: TaskType[];
  noted: NotedItemUserType[];
  recentProjects: string[];
}

const initialState: IUserState = {
  loaderNoted: [],
  assignedTasks: [],
  noted: [],
  recentProjects: []
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserData: (state) => {
      state.user = undefined;
      localStorage.removeItem('accessToken');
      state.loaderNoted = [];
      state.assignedTasks = [];
      state.noted = [];
      state.recentProjects = [];
    },
    setUser: (state, action: PayloadAction<CurrentUserType>) => {
      state.user = action.payload;
    },
    setAssignees: (state, action: PayloadAction<TaskType[]>) => {
      state.assignedTasks = state.assignedTasks.concat(action.payload);
    },
    updateAssignees: (state, action: PayloadAction<TaskType[]>) => {
      action.payload.forEach((task) => {
        const idx = state.assignedTasks.findIndex((item) => item._id === task._id);
        if (idx >= 0) state.assignedTasks.splice(idx, 1, task);
      });
    },
    removeAssignees: (state, action: PayloadAction<string[]>) => {
      state.assignedTasks = state.assignedTasks.filter(
        (task) => !action.payload.includes(task._id)
      );
    },
    setNoted: (state, action: PayloadAction<NotedItemUserType[]>) => {
      state.noted = state.noted.concat(action.payload);
      state.loaderNoted = state.loaderNoted.filter(
        (item) => !action.payload.find((noted) => noted._id === item)
      );
    },
    removeNoted: (state, action: PayloadAction<string[]>) => {
      state.noted = state.noted.filter((item) => !action.payload.includes(item._id));
      state.loaderNoted = state.loaderNoted.filter((item) => !action.payload.includes(item));
    },
    resetData: (state) => {
      state.assignedTasks = [];
      state.noted = [];
      state.recentProjects = [];
    },
    setRecent: (state, action: PayloadAction<string[]>) => {
      state.recentProjects = action.payload;
    },
    setLoaderNoted: (state, action: PayloadAction<string>) => {
      state.loaderNoted.push(action.payload);
    }
  }
});

export const { resetUserData } = userSlice.actions;
export default userSlice.reducer;

let _userHandler: SubscribeUserType | null = null;
const userHandler = (dispatch: Dispatch) => {
  if (_userHandler === null) {
    _userHandler = (method, user) => {
      switch (method) {
        case 'set':
          dispatch(userSlice.actions.setUser(user));
          break;
      }
    };
  }

  return _userHandler;
};

let _assignedTaskHandler: SubscribeTaskType | null = null;
const assignedTaskHandler = (dispatch: Dispatch) => {
  if (_assignedTaskHandler === null) {
    _assignedTaskHandler = (method, assignedTasks) => {
      switch (method) {
        case 'get':
          dispatch(userSlice.actions.setAssignees(assignedTasks as TaskType[]));
          break;
        case 'put':
          dispatch(userSlice.actions.updateAssignees(assignedTasks as TaskType[]));
          break;
        case 'delete':
          dispatch(userSlice.actions.removeAssignees(assignedTasks as string[]));
          break;
      }
    };
  }

  return _assignedTaskHandler;
};

let _notedHandler: SubscribeNotedType | null = null;
const notedHandler = (dispatch: Dispatch) => {
  if (_notedHandler === null) {
    _notedHandler = (method, noted) => {
      switch (method) {
        case 'get':
          dispatch(userSlice.actions.setNoted(noted as NotedItemUserType[]));
          break;
        case 'delete':
          dispatch(userSlice.actions.removeNoted(noted as string[]));
          break;
      }
    };
  }

  return _notedHandler;
};

let _recentHandler: SubscribeStringType | null = null;
const recentHandler = (dispatch: Dispatch) => {
  if (_recentHandler === null) {
    _recentHandler = (method, recent) => {
      switch (method) {
        case 'set':
          dispatch(userSlice.actions.setRecent(recent));
          break;
      }
    };
  }

  return _recentHandler;
};

const closeHandler = (dispatch: Dispatch) => () => {
  dispatch(userSlice.actions.resetData());
};

export const addUserListeners = () => (dispatch: Dispatch) => {
  websocketAPI.subscribeUser(userHandler(dispatch));
  websocketAPI.subscribeAssigned(assignedTaskHandler(dispatch));
  websocketAPI.subscribeNoted(notedHandler(dispatch));
  websocketAPI.subscribeRecent(recentHandler(dispatch));
  websocketAPI.subscribeClose(closeHandler(dispatch));
};

export const removeUserListeners = () => (dispatch: Dispatch) => {
  websocketAPI.unsubscribeUser(userHandler(dispatch));
  websocketAPI.unsubscribeAssigned(assignedTaskHandler(dispatch));
  websocketAPI.unsubscribeNoted(notedHandler(dispatch));
  websocketAPI.unsubscribeRecent(recentHandler(dispatch));
};

export const updateUser =
  (_id: string, updated: { [key: string]: string }) => (dispatch: Dispatch) => {
    const message = { type: 'user', method: 'update', data: { ...updated, _id } };
    websocketAPI.sendMessage(JSON.stringify(message));
  };

export const addNoted = (_id: string, itemId: string, type: string) => (dispatch: Dispatch) => {
  dispatch(userSlice.actions.setLoaderNoted(itemId));
  const message = { type: 'noted', method: 'add', data: { _id, itemId, type } };
  websocketAPI.sendMessage(JSON.stringify(message));
};

export const removeNoted = (_id: string, itemId: string) => (dispatch: Dispatch) => {
  dispatch(userSlice.actions.setLoaderNoted(itemId));
  const message = { type: 'noted', method: 'remove', data: { _id, itemId } };
  websocketAPI.sendMessage(JSON.stringify(message));
};
