import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import type {RootState} from '../../store.ts';
import {Checklist} from '../../../types/Checklist.ts';
import {getDBConnection} from '../../../db/db-service.ts';

interface NoteState {
  id: number | null;
  currentTitle: string;
  currentContent: string;
  currentType: string;
  refreshingNotes: boolean;
  openedCheckList?: Checklist[];
  updateToDo: boolean;

  isSwitchingModeDialogShowing: boolean;
}

const initialState: NoteState = {
  id: null,
  currentTitle: '',
  currentContent: '',
  currentType: '',
  refreshingNotes: false,
  updateToDo: false,

  isSwitchingModeDialogShowing: false,
};

export const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    setCurrentTitle: (state, action: PayloadAction<string>) => {
      state.currentTitle = action.payload;
    },
    setCurrentContent: (state, action: PayloadAction<string>) => {
      state.currentContent = action.payload;
    },
    setCurrentType: (state, action: PayloadAction<string>) => {
      state.currentType = action.payload;
    },
    setNoteInfo: (state, action: PayloadAction<any>) => {
      state.id = action.payload.id;
      state.currentTitle = action.payload.title;
      state.currentContent = action.payload.content;
      state.currentType = action.payload.type;
      if (action.payload.type === 'TODO') {
        if (action.payload.content === '') {
          state.openedCheckList = [];
        } else {
          const tempCheckList: Checklist[] = JSON.parse(action.payload.content);
          state.openedCheckList = tempCheckList.sort(
            (a, b) => a.order - b.order,
          );
        }
      }
    },
    refreshNotes: state => {
      state.refreshingNotes = !state.refreshingNotes;
    },
    updateCheckListContent: (state, action: PayloadAction<any>) => {
      let tempCheckList = state.openedCheckList;
      const checkListIndex = tempCheckList!.findIndex(
        item => item.id === action.payload.id,
      );
      tempCheckList![checkListIndex].content = action.payload.content;
      state.openedCheckList = tempCheckList;
    },
    checkCheckList: (state, action: PayloadAction<any>) => {
      let tempCheckList = state.openedCheckList;
      const checkListIndex = tempCheckList!.findIndex(
        item => item.id === action.payload.id,
      );
      if (tempCheckList![checkListIndex].checked === 1) {
        tempCheckList![checkListIndex].checked = 0;
      } else {
        tempCheckList![checkListIndex].checked = 1;
      }
      state.openedCheckList = tempCheckList;
    },
    addNewCheckItem: (state, action: PayloadAction<any>) => {
      let tempCheckList = state.openedCheckList;
      tempCheckList!.map(item => {
        if (item.order >= action.payload.order) {
          item.order = item.order + 1;
        }
      });
      tempCheckList!.push({
        id: action.payload.id,
        checked: 0,
        content: '',
        order: action.payload.order,
      });
      state.openedCheckList = tempCheckList!.sort((a, b) => a.order - b.order);
    },
    removeCheckItem: (state, action: PayloadAction<any>) => {
      let tempCheckList = state.openedCheckList;
      const toBeRemovedIndex = tempCheckList!.findIndex(
        item => item.id === action.payload.id,
      );
      const removedOrderNumber = tempCheckList![toBeRemovedIndex].order;
      tempCheckList = tempCheckList!.filter(
        item => item.id !== action.payload.id,
      );
      tempCheckList.map(item => {
        if (item.order >= removedOrderNumber) {
          item.order = item.order - 1;
        }
      });
      state.openedCheckList = tempCheckList;
    },
    updateToDoState: state => {
      state.updateToDo = !state.updateToDo;
    },
    setSwitchingModeDialogShow: state => {
      state.isSwitchingModeDialogShowing = true;
    },
    setSwitchingModeDialogHide: state => {
      state.isSwitchingModeDialogShowing = false;
    },
  },
});

export const {
  setId,
  setCurrentTitle,
  setCurrentContent,
  setCurrentType,
  setNoteInfo,
  refreshNotes,
  updateCheckListContent,
  checkCheckList,
  addNewCheckItem,
  removeCheckItem,
  updateToDoState,
  setSwitchingModeDialogShow,
  setSwitchingModeDialogHide,
} = noteSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectNote = (state: RootState) => state.notes.value;

export default noteSlice.reducer;
