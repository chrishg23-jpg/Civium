import { configureStore } from '@reduxjs/toolkit';
import householdReducer from './householdSlice';
import neighbourhoodReducer from './neighbourhoodSlice';
import signalReducer from './signalSlice';
import identityReducer from './identitySlice';

export const store = configureStore({
  reducer: {
    household: householdReducer,
    neighbourhood: neighbourhoodReducer,
    signal: signalReducer,
    identity: identityReducer
  }
});
