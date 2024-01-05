/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dispatch, PayloadAction, createSlice } from '@reduxjs/toolkit';
import CommentType from '../types/comment/commentType';
import websocketAPI, { SubscribeCommentType, SubscribeTaskType } from '../api/websocket-api';

export interface ICommentsState {
  taskId: string;
  comments: CommentType[];
  isLoadingComments: boolean;
  needLeaveTask: boolean;
}

const initialState: ICommentsState = {
  taskId: '',
  comments: [],
  isLoadingComments: true,
  needLeaveTask: false
};

type CreateCommentArgs = {
  taskId: string;
  text: string;
  author: string;
  date: string;
};

type UpdateCommentArgs = {
  _id: string;
  text: string;
  dateUpdate: string;
};

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    resetData: (state) => {
      state.comments = [];
      state.isLoadingComments = true;
      state.needLeaveTask = false;
      state.taskId = '';
    },
    setTaskId: (state, action: PayloadAction<string>) => {
      state.taskId = action.payload;
      state.needLeaveTask = false;
    },
    setComments: (state, action: PayloadAction<CommentType[]>) => {
      state.comments = state.comments.concat(action.payload);
      if (state.isLoadingComments) state.isLoadingComments = false;
    },
    updateComments: (state, action: PayloadAction<CommentType[]>) => {
      action.payload.forEach((comment) => {
        const idx = state.comments.findIndex((item) => item._id === comment._id);
        if (idx >= 0) state.comments.splice(idx, 1, comment);
      });
    },
    removeComments: (state, action: PayloadAction<string[]>) => {
      state.comments = state.comments.filter((comment) => !action.payload.includes(comment._id));
    },
    checkRemovedTask: (state, action: PayloadAction<string[]>) => {
      state.needLeaveTask = action.payload.includes(state.taskId);
    }
  }
});

export default taskSlice.reducer;

let _taskHandler: SubscribeTaskType | null = null;
const taskHandler = (dispatch: Dispatch) => {
  if (_taskHandler === null) {
    _taskHandler = (method, tasks) => {
      switch (method) {
        case 'delete':
          dispatch(taskSlice.actions.checkRemovedTask(tasks as string[]));
          break;
      }
    };
  }

  return _taskHandler;
};

let _commentHandler: SubscribeCommentType | null = null;
const commentHandler = (dispatch: Dispatch) => {
  if (_commentHandler === null) {
    _commentHandler = (method, columns) => {
      switch (method) {
        case 'get':
          dispatch(taskSlice.actions.setComments(columns as CommentType[]));
          break;
        case 'put':
          dispatch(taskSlice.actions.updateComments(columns as CommentType[]));
          break;
        case 'delete':
          dispatch(taskSlice.actions.removeComments(columns as string[]));
          break;
      }
    };
  }

  return _commentHandler;
};

export const openTask = (taskId: string) => (dispatch: Dispatch) => {
  dispatch(taskSlice.actions.setTaskId(taskId));
  websocketAPI.subscribeTask(taskHandler(dispatch));
  websocketAPI.subscribeComment(commentHandler(dispatch));
  websocketAPI.sendMessage(JSON.stringify({ type: 'join-task', taskId }));
  websocketAPI.sendMessage(JSON.stringify({ type: 'comment', method: 'get', data: { taskId } }));
};

export const closeTask = () => (dispatch: Dispatch) => {
  websocketAPI.unsubscribeTask(taskHandler(dispatch));
  websocketAPI.unsubscribeComment(commentHandler(dispatch));
  websocketAPI.sendMessage(JSON.stringify({ type: 'leave-task' }));
  dispatch(taskSlice.actions.resetData());
};

export const createComment = (body: CreateCommentArgs) => (dispatch: Dispatch) => {
  const message = {
    type: 'comment',
    method: 'create',
    data: {
      ...body,
      dateUpdate: body.date
    }
  };
  websocketAPI.sendMessage(JSON.stringify(message));
};

export const updateComment = (body: UpdateCommentArgs) => (dispatch: Dispatch) => {
  const message = { type: 'comment', method: 'update', data: body };
  websocketAPI.sendMessage(JSON.stringify(message));
};

export const removeComment = (_id: string) => (dispatch: Dispatch) => {
  const message = { type: 'comment', method: 'remove', data: { _id } };
  websocketAPI.sendMessage(JSON.stringify(message));
};
