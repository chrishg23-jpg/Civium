import { createSlice } from '@reduxjs/toolkit';

const signalSlice = createSlice({
  name: 'signal',
  initialState: {
    list: []
  },
  reducers: {
    addSignal(state, action) {
      state.list.push(action.payload);
    }
  }
});

export const { addSignal } = signalSlice.actions;
export default signalSlice.reducer;
