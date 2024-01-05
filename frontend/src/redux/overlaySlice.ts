import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface IOverlayState {
  isVisible: boolean;
  overlayContent: React.ReactNode;
}

const initialState: IOverlayState = {
  isVisible: false,
  overlayContent: null
};

export const overlaySlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setOverlayContent: (state, action: PayloadAction<React.ReactNode>) => {
      state.overlayContent = action.payload;
      state.isVisible = true;
    },
    hideOverlay: (state) => {
      state.isVisible = false;
    }
  }
});

export const { setOverlayContent, hideOverlay } = overlaySlice.actions;
export default overlaySlice.reducer;
