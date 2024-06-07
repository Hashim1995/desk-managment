/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IRooms } from '@/modules/rooms/types';

interface RoomsState {
  currentRoom?: IRooms; // User can be undefined initially
}

// Define the initial state
const initialState: RoomsState = {
  currentRoom: undefined // User is initially undefined
};

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setCurrentRoom: (state, action: PayloadAction<any>) => {
      state.currentRoom = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setCurrentRoom } = roomsSlice.actions;

export default roomsSlice.reducer;
