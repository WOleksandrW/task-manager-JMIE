/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dispatch, PayloadAction, createSlice } from '@reduxjs/toolkit';
import websocketAPI, { SubscribeProjectType } from '../api/websocket-api';
import { ProjectType } from '../types/project/projectType';

interface IProjectsState {
  projects: ProjectType[];
  loaderRemoved: string[];
}

const initialState: IProjectsState = {
  projects: [],
  loaderRemoved: []
};

type CreateProjectArgs = Pick<ProjectType, 'title' | 'description' | 'author' | 'key' | 'badge'>;

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<ProjectType[]>) => {
      state.projects = state.projects.concat(action.payload);
    },
    updateProjects: (state, action: PayloadAction<ProjectType[]>) => {
      action.payload.forEach((project) => {
        const idx = state.projects.findIndex((item) => item._id === project._id);
        if (idx >= 0) state.projects.splice(idx, 1, project);
      });
    },
    removeProjects: (state, action: PayloadAction<string[]>) => {
      state.projects = state.projects.filter((project) => !action.payload.includes(project._id));
      state.loaderRemoved = state.loaderRemoved.filter((item) => !action.payload.includes(item));
    },
    resetProjectsData: (state) => {
      state.projects = [];
      state.loaderRemoved = [];
    },
    setLoaderRemoved: (state, action: PayloadAction<string>) => {
      state.loaderRemoved.push(action.payload);
    }
  }
});

export const { setLoaderRemoved, resetProjectsData } = projectsSlice.actions;
export default projectsSlice.reducer;

let _projectHandler: SubscribeProjectType | null = null;
const projectHandler = (dispatch: Dispatch) => {
  if (_projectHandler === null) {
    _projectHandler = (method, projects) => {
      switch (method) {
        case 'get':
          dispatch(projectsSlice.actions.setProjects(projects as ProjectType[]));
          break;
        case 'put':
          dispatch(projectsSlice.actions.updateProjects(projects as ProjectType[]));
          break;
        case 'delete':
          dispatch(projectsSlice.actions.removeProjects(projects as string[]));
          break;
      }
    };
  }

  return _projectHandler;
};

const closeHandler = (dispatch: Dispatch) => () => {
  dispatch(projectsSlice.actions.resetProjectsData());
};

export const addProjectsListeners = () => (dispatch: Dispatch) => {
  websocketAPI.subscribeProject(projectHandler(dispatch));
  websocketAPI.subscribeClose(closeHandler(dispatch));
};

export const removeProjectsListeners = () => (dispatch: Dispatch) => {
  websocketAPI.unsubscribeProject(projectHandler(dispatch));
};

export const createProject = (body: CreateProjectArgs) => (dispatch: Dispatch) => {
  const message = { type: 'project', method: 'create', data: body };
  websocketAPI.sendMessage(JSON.stringify(message));
};

export const updateProject =
  (_id: string, updatedProject: { [key: string]: string }) => (dispatch: Dispatch) => {
    const message = { type: 'project', method: 'update', data: { ...updatedProject, _id } };
    websocketAPI.sendMessage(JSON.stringify(message));
  };

export const removeProject = (_id: string) => (dispatch: Dispatch) => {
  dispatch(projectsSlice.actions.setLoaderRemoved(_id));
  const message = { type: 'project', method: 'remove', data: { _id } };
  websocketAPI.sendMessage(JSON.stringify(message));
};
