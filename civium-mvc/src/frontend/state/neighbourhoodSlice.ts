import { createSlice } from '@reduxjs/toolkit';

const neighbourhoodSlice = createSlice({
  name: 'neighbourhood',
  initialState: {
    data: null
  },
  reducers: {
    setNeighbourhood(state, action) {
      state.data = action.payload;
    }
  }
});

export const { setNeighbourhood } = neighbourhoodSlice.actions;
export default neighbourhoodSlice.reducer;
