import { Dispatch, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { v4 as generateId } from 'uuid';
import websocketAPI, { SubscribeAlertType } from '../api/websocket-api';
import { AlertType } from '../components/Alert/Alert';

type AlertObj = {
  id: string;
  type: AlertType;
  message: string;
};

export interface IAlertsState {
  alerts: AlertObj[];
}

const initialState: IAlertsState = {
  alerts: []
};

export const alertsSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<{ type: AlertType; message: string }>) => {
      const id = generateId();
      const { type, message } = action.payload;

      state.alerts.push({
        id,
        type,
        message
      });
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload);
    }
  }
});

export const { addAlert, removeAlert } = alertsSlice.actions;
export default alertsSlice.reducer;

let _alertHandler: SubscribeAlertType | null = null;
const alertHandler = (dispatch: Dispatch) => {
  if (_alertHandler === null) {
    _alertHandler = (method, alerts) => {
      switch (method) {
        case 'get':
          alerts.forEach((alert) =>
            dispatch(
              alertsSlice.actions.addAlert({
                type: alert.type as AlertType,
                message: alert.message
              })
            )
          );
          break;
      }
    };
  }

  return _alertHandler;
};

export const addAlertsListeners = () => (dispatch: Dispatch) => {
  websocketAPI.subscribeAlerts(alertHandler(dispatch));
};

export const removeAlertsListeners = () => (dispatch: Dispatch) => {
  websocketAPI.unsubscribeAlerts(alertHandler(dispatch));
};
