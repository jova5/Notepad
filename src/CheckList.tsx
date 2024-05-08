import {ScrollView, View} from 'react-native';
import React, {createRef, useEffect} from 'react';
import {
  Checkbox,
  TextInput as PaperTextInput,
  useTheme,
} from 'react-native-paper';
import {
  addNewCheckItem,
  checkCheckList,
  removeCheckItem,
  setCurrentTitle,
  updateCheckListContent,
  updateToDoState,
} from './redux/feature/note/noteSlice.ts';
import {useAppDispatch, useAppSelector} from './redux/hooks.ts';
import {Checklist} from './types/Checklist.ts';
import uuid from 'react-native-uuid';
import {getDBConnection, saveNote} from './db/db-service.ts';

let lastToDoId = null;
let lastAction = null;
let lastOrder = null;

const RenderItem = ({item}: {item: Checklist}) => {
  const dispatch = useAppDispatch();
  const ref = createRef();

  setTimeout(() => {
    if (
      ref !== null &&
      ref.current !== null &&
      lastAction === 'REMOVE_TODO' &&
      lastOrder === item.order
    ) {
      ref.current.focus();
    }
    if (
      ref !== null &&
      ref.current !== null &&
      lastAction === 'ADD_TODO' &&
      lastToDoId === item.id
    ) {
      ref.current.focus();
    }
  }, 2);

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
      }}>
      <Checkbox
        status={item.checked === 1 ? 'checked' : 'unchecked'}
        onPress={() => {
          dispatch(checkCheckList({id: item.id}));
          dispatch(updateToDoState());
        }}
      />
      <PaperTextInput
        ref={ref}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}
        underlineStyle={{display: 'none'}}
        outlineStyle={{display: 'none'}}
        contentStyle={{
          fontSize: 18,
          paddingLeft: 5,
          textDecorationLine: item.checked === 1 ? 'line-through' : 'none',
        }}
        value={item.content}
        onKeyPress={event => {
          if (event.nativeEvent.key === 'Backspace' && item.content === '') {
            lastOrder = item.order === 1 ? 1 : item.order - 1;
            lastAction = 'REMOVE_TODO';
            dispatch(removeCheckItem({id: item.id}));
            dispatch(updateToDoState());
          }
        }}
        onSubmitEditing={() => {
          const newId = JSON.stringify(uuid.v4());
          lastToDoId = newId;
          lastAction = 'ADD_TODO';
          dispatch(
            addNewCheckItem({
              id: newId,
              order: item.order + 1,
            }),
          );
          dispatch(updateToDoState());
        }}
        blurOnSubmit={false}
        onChangeText={text => {
          dispatch(updateCheckListContent({id: item.id, content: text}));
          dispatch(updateToDoState());
        }}
      />
    </View>
  );
};

const CheckList = () => {
  const theme = useTheme();
  const title = useAppSelector(state => state.notes.currentTitle);
  const dispatch = useAppDispatch();
  const checkList: Checklist[] = useAppSelector(
    state => state.notes.openedCheckList,
  );

  const id = useAppSelector(state => state.notes.id);
  const currentTitle = useAppSelector(state => state.notes.currentTitle);
  const updateToDo = useAppSelector(state => state.notes.updateToDo);
  const currentOpenedCheckList = useAppSelector(
    state => state.notes.openedCheckList,
  );

  const updateCurrentToDo = async () => {
    try {
      const db = await getDBConnection();
      let note;
      note = {
        id: id,
        title: currentTitle,
        content: JSON.stringify(currentOpenedCheckList),
        type: 'TODO',
      };
      await saveNote(db, note);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (updateToDo) {
      updateCurrentToDo();
      dispatch(updateToDoState());
    }
  }, [updateToDo]);

  return (
    <ScrollView
      keyboardShouldPersistTaps={'handled'}
      style={{
        display: 'flex',
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      <PaperTextInput
        style={{backgroundColor: theme.colors.background}} //
        underlineStyle={{display: 'none'}}
        outlineStyle={{display: 'none'}}
        placeholder="Title"
        contentStyle={{fontSize: 24}}
        defaultValue={title}
        onChangeText={text => {
          dispatch(setCurrentTitle(text));
          updateCurrentToDo();
        }}
      />
      {checkList.map(item => (
        <RenderItem key={item.id} item={item} />
      ))}
    </ScrollView>
  );
};

export default CheckList;
