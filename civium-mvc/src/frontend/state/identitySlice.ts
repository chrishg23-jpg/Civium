import { createSlice } from '@reduxjs/toolkit';

const identitySlice = createSlice({
  name: 'identity',
  initialState: {
    token: null,
    legitimacy: null
  },
  reducers: {
    setIdentity(state, action) {
      state.token = action.payload.token;
      state.legitimacy = action.payload.legitimacy;
    }
  }
});

export const { setIdentity } = identitySlice.actions;
export default identitySlice.reducer;
