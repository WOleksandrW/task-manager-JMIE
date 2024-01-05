import { Dispatch, PayloadAction, createSlice } from '@reduxjs/toolkit';
import websocketAPI from '../api/websocket-api';

type StatusType = 'pending' | 'ready';

export interface IWebSocketState {
  status: StatusType;
  openDuct: boolean;
  errorCode: string;
}

const initialState: IWebSocketState = {
  status: 'pending',
  openDuct: false,
  errorCode: ''
};

export const websocketSlice = createSlice({
  name: 'web-socket',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<StatusType>) => {
      state.status = action.payload;
    },
    setOpenDuct: (state, action: PayloadAction<boolean>) => {
      state.openDuct = action.payload;
    },
    setErrorCode: (state, action: PayloadAction<string>) => {
      state.errorCode = action.payload;
    },
    resetWebSocketData: (state) => {
      state.status = 'pending';
      state.openDuct = false;
      state.errorCode = '';
    }
  }
});

export const { resetWebSocketData } = websocketSlice.actions;
export default websocketSlice.reducer;

const connectionHandler = (dispatch: Dispatch) => () => {
  dispatch(websocketSlice.actions.setStatus('ready'));
  dispatch(websocketSlice.actions.setErrorCode(''));
  const request = {
    type: 'open',
    token: `Bear ${localStorage.getItem('accessToken')}`
  };
  websocketAPI.sendMessage(JSON.stringify(request));
};

const openHandler = (dispatch: Dispatch) => (value: boolean, code?: string) => {
  dispatch(websocketSlice.actions.setOpenDuct(value));
  if (code) dispatch(websocketSlice.actions.setErrorCode(code));
};

const closeHandler = (dispatch: Dispatch) => () => {
  dispatch(websocketSlice.actions.setStatus('pending'));
};

export const startListening = () => (dispatch: Dispatch) => {
  websocketAPI.subscribeConnection(connectionHandler(dispatch));
  websocketAPI.subscribeOpen(openHandler(dispatch));
  websocketAPI.subscribeClose(closeHandler(dispatch));
  websocketAPI.start();
};

export const stopListening = () => {
  websocketAPI.stop();
};
