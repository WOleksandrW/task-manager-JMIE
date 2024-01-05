import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export interface ITasksState {
  isLoadingSign: boolean;
  messageSign: string;
  isTokenReceived: boolean;
}

const initialState: ITasksState = {
  isLoadingSign: false,
  messageSign: '',
  isTokenReceived: false
};

export const fetchSignIn = createAsyncThunk(
  'project/fetchSignIn',
  async (payload: { email: string; password: string }) => {
    const response = await api.auth.signIn(payload);
    return response.data;
  }
);

export const fetchSignUp = createAsyncThunk(
  'project/fetchSignUp',
  async (payload: { firstName: string; lastName: string; email: string; password: string }) => {
    const response = await api.auth.signUp(payload);
    return response.data;
  }
);

export const signInUpSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setMessageSign: (state, action: PayloadAction<string>) => {
      state.messageSign = action.payload;
    },
    setIsToken: (state, action: PayloadAction<boolean>) => {
      state.isTokenReceived = action.payload;
    }
  },
  extraReducers: (builder) => {
    // fetchSignIn
    builder.addCase(fetchSignIn.pending, (state) => {
      state.isLoadingSign = true;
    });
    builder.addCase(fetchSignIn.fulfilled, (state, action: PayloadAction<string>) => {
      state.isLoadingSign = false;
      state.messageSign = 'Success!';
      localStorage.setItem('accessToken', action.payload);
      state.isTokenReceived = true;
    });
    builder.addCase(fetchSignIn.rejected, (state, action) => {
      state.isLoadingSign = false;
      if (`${action.error.message}`.includes('400')) {
        state.messageSign = 'Failed! Wrong email or password';
      } else {
        state.messageSign = 'Failed!';
      }
    });

    // fetchSignUp
    builder.addCase(fetchSignUp.pending, (state) => {
      state.isLoadingSign = true;
    });
    builder.addCase(fetchSignUp.fulfilled, (state) => {
      state.isLoadingSign = false;
      state.messageSign = 'Success!';
    });
    builder.addCase(fetchSignUp.rejected, (state, action) => {
      state.isLoadingSign = false;
      if (`${action.error.message}`.includes('412')) {
        state.messageSign = 'Failed! Email already used!';
      } else {
        state.messageSign = 'Failed!';
      }
    });
  }
});

export const { setMessageSign, setIsToken } = signInUpSlice.actions;
export default signInUpSlice.reducer;
