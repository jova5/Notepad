import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../store.ts';

interface NoteState {
  value: number;
  id?: number;
  title?: string;
  content?: string;
}

const initialState: NoteState = {
  value: 0,
};

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    setOpenNoteInfo: (state, action: PayloadAction<any>) => {
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.content = action.payload.content;
    },
  },
});

export const {setOpenNoteInfo} = noteSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectNote = (state: RootState) => state.notes.value;

export default noteSlice.reducer;
