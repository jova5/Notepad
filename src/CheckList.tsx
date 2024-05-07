import {TextInput, View} from 'react-native';
import React from 'react';
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
} from './redux/feature/note/noteSlice.ts';
import {useAppDispatch, useAppSelector} from './redux/hooks.ts';
import {Checklist} from './types/Checklist.ts';
import uuid from 'react-native-uuid';

const RenderItem = ({item}: {item: Checklist}) => {
  const dispatch = useAppDispatch();

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
        }}
      />
      <PaperTextInput
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
            dispatch(removeCheckItem({id: item.id}));
          }
        }}
        onSubmitEditing={() => {
          dispatch(addNewCheckItem({order: item.order + 1}));
        }}
        onChangeText={text => {
          dispatch(updateCheckListContent({id: item.id, content: text}));
          // updateCurrentNote();
        }}
      />
    </View>
  );
};

const CheckList = () => {
  const [checked, setChecked] = React.useState(false);
  const theme = useTheme();
  const title = useAppSelector(state => state.notes.currentTitle);
  const dispatch = useAppDispatch();
  const checkList: Checklist[] = useAppSelector(
    state => state.notes.openedCheckList,
  );

  return (
    <View
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
          // updateCurrentNote();
        }}
      />
      {checkList.map(item => (
        <RenderItem key={item.id} item={item} />
      ))}
    </View>
  );
};

export default CheckList;
