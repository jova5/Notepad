import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../store.ts';

interface NoteState {
  notepadData: any[];
  id?: number;
  currentTitle: string;
  currentContent: string;
  newTitle: string;
  newContent: string;
  refreshingNotes: boolean;
}

const initialState: NoteState = {
  notepadData: [],
  currentTitle: '',
  currentContent: '',
  newTitle: '',
  newContent: '',
  refreshingNotes: false,
};

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    setNewTitle: (state, action: PayloadAction<string>) => {
      state.newTitle = action.payload;
    },
    setNewContent: (state, action: PayloadAction<string>) => {
      state.newContent = action.payload;
    },
    setCurrentTitle: (state, action: PayloadAction<string>) => {
      state.currentTitle = action.payload;
    },
    setCurrentContent: (state, action: PayloadAction<string>) => {
      state.currentContent = action.payload;
    },
    setNoteInfo: (state, action: PayloadAction<any>) => {
      state.id = action.payload.id;
      state.currentTitle = action.payload.title;
      state.currentContent = action.payload.content;
    },
    refreshNotes: state => {
      state.refreshingNotes = !state.refreshingNotes;
    },
  },
});

export const {
  setId,
  setNewTitle,
  setNewContent,
  setCurrentTitle,
  setCurrentContent,
  setNoteInfo,
  refreshNotes,
} = noteSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectNote = (state: RootState) => state.notes.value;

export default noteSlice.reducer;
