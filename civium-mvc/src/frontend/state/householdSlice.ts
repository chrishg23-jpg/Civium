import { createSlice } from '@reduxjs/toolkit';

const householdSlice = createSlice({
  name: 'household',
  initialState: {
    data: null
  },
  reducers: {
    setHousehold(state, action) {
      state.data = action.payload;
    }
  }
});

export const { setHousehold } = householdSlice.actions;
export default householdSlice.reducer;
