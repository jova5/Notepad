import {
  Appbar,
  Button,
  Dialog,
  IconButton,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Editor from './text-editor/Editor.tsx';
import WebView from 'react-native-webview';
import {createRef} from 'react';
import {useAppDispatch, useAppSelector} from './redux/hooks.ts';
import {
  redoCheckList,
  refreshNotes,
  resetCheckListHistory,
  setNoteInfo,
  setSwitchingModeDialogHide,
  setSwitchingModeDialogShow,
  undoCheckList,
} from './redux/feature/note/noteSlice.ts';
import {getDBConnection, saveNote} from './db/db-service.ts';
import CheckList from './CheckList.tsx';
import uuid from 'react-native-uuid';
import {Checklist} from './types/Checklist.ts';

const transformNoteInToDoContent = (noteContent: string) => {
  if (noteContent === '' || noteContent === null) {
    return JSON.stringify([
      {
        id: JSON.stringify(uuid.v4()),
        checked: 0,
        order: 1,
        content: '',
      },
    ]);
  }

  const divContentRegex = /<div>(.*?)<\/div>/g;
  let match;
  const noteContentList = [];

  while ((match = divContentRegex.exec(noteContent)) !== null) {
    noteContentList.push(match[1]);
  }

  return JSON.stringify(
    noteContentList.map((content, index) => ({
      id: JSON.stringify(uuid.v4()),
      checked: 0,
      order: index,
      content: content,
    })),
  );
};

export const transformToDoInNoteContent = (todoContentList: Checklist[]) => {
  if (todoContentList.length === 1 && todoContentList[0].content === '') {
    return '';
  }
  return todoContentList
    .map(item => '<div>' + item.content + '</div>')
    .join('');
};

const NoteEditHeader = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const id = useAppSelector(state => state.notes.id);
  const currentTitle = useAppSelector(state => state.notes.currentTitle);
  const currentContent = useAppSelector(state => state.notes.currentContent);
  const currentType = useAppSelector(state => state.notes.currentType);
  const currentOpenedCheckList = useAppSelector(
    state => state.notes.openedCheckList,
  );

  const updateCurrentNote = async () => {
    try {
      const db = await getDBConnection();
      let note;
      if (currentType === 'NOTE') {
        note = {
          id: id,
          title: currentTitle,
          content: currentContent,
          type: currentType,
        };
      } else {
        note = {
          id: id,
          title: currentTitle,
          content: JSON.stringify(currentOpenedCheckList),
          type: currentType,
        };
      }
      await saveNote(db, note);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Appbar.Header
      style={{
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outline,
      }}>
      <Appbar.BackAction
        onPress={() => {
          navigation.goBack();
          updateCurrentNote();
          dispatch(setNoteInfo({id: null, title: '', content: ''}));
          dispatch(refreshNotes());
          dispatch(resetCheckListHistory());
        }}
      />
      <View
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <IconButton
          icon={
            currentType === 'NOTE' ? 'checkbox-marked-outline' : 'note-outline'
          }
          mode={'contained-tonal'}
          containerColor={'transparent'}
          onPress={() => {
            if (currentType === 'NOTE' && currentContent !== '') {
              dispatch(setSwitchingModeDialogShow());
            } else if (currentType === 'NOTE') {
              const content = transformNoteInToDoContent(currentContent);
              dispatch(
                setNoteInfo({
                  id: id,
                  title: currentTitle,
                  type: 'TODO',
                  content: content,
                }),
              );
            } else if (
              (currentType === 'TODO' &&
                currentOpenedCheckList!.length === 1 &&
                currentOpenedCheckList![0].content !== '') ||
              currentOpenedCheckList!.length >= 2
            ) {
              dispatch(setSwitchingModeDialogShow());
            } else {
              console.log(currentOpenedCheckList);
              const content = transformToDoInNoteContent(
                currentOpenedCheckList!,
              );
              dispatch(
                setNoteInfo({
                  id: id,
                  title: currentTitle,
                  type: 'NOTE',
                  content: content,
                }),
              );
            }
          }}
        />
      </View>
    </Appbar.Header>
  );
};

const NoteEdit = () => {
  const theme = useTheme();
  const ref = createRef<WebView>();
  const noteType = useAppSelector(state => state.notes.currentType);
  const dispatch = useAppDispatch();
  const isSwitchingModeDialogShowing = useAppSelector(
    state => state.notes.isSwitchingModeDialogShowing,
  );
  const id = useAppSelector(state => state.notes.id);
  const currentTitle = useAppSelector(state => state.notes.currentTitle);
  const currentContent = useAppSelector(state => state.notes.currentContent);
  const currentType = useAppSelector(state => state.notes.currentType);
  const currentOpenedCheckList = useAppSelector(
    state => state.notes.openedCheckList,
  );

  const executeFunctionInWebView = (command: string) => {
    if (currentType === 'NOTE') {
      const script = `formatDoc('${command}')`;
      if (ref.current) {
        ref.current.injectJavaScript(script);
      }
    } else if (command === 'undo') {
      dispatch(undoCheckList());
    } else if (command === 'redo') {
      dispatch(redoCheckList());
    }
  };

  return (
    <>
      <NoteEditHeader />
      <SafeAreaView
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
        }}>
        {noteType === 'NOTE' ? <Editor ref={ref} /> : <CheckList />}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderStyle: 'solid',
            borderTopColor: theme.colors.outline,
            borderTopWidth: 1,
          }}>
          <IconButton
            icon={'undo'}
            mode={'contained'}
            onPress={() => executeFunctionInWebView('undo')}
          />
          <IconButton
            icon={'redo'}
            mode={'contained'}
            onPress={() => executeFunctionInWebView('redo')}
          />
          {noteType === 'NOTE' && (
            <>
              <IconButton
                icon={'format-bold'}
                mode={'contained'}
                onPress={() => executeFunctionInWebView('bold')}
              />
              <IconButton
                icon={'format-underline'}
                mode={'contained'}
                onPress={() => executeFunctionInWebView('underline')}
              />
              <IconButton
                icon={'format-italic'}
                mode={'contained'}
                onPress={() => executeFunctionInWebView('italic')}
              />
              <IconButton
                icon={'format-strikethrough'}
                mode={'contained'}
                onPress={() => executeFunctionInWebView('strikeThrough')}
              />
            </>
          )}
        </View>
      </SafeAreaView>
      <Portal>
        <Dialog
          visible={isSwitchingModeDialogShowing}
          onDismiss={() => dispatch(setSwitchingModeDialogHide())}>
          <Dialog.Title style={{fontFamily: '400-Roboto'}}>Alert</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyLarge" style={{fontFamily: '400-Roboto'}}>
              {currentType === 'NOTE'
                ? 'You are about to switch to checklist. Confirm your choice.'
                : 'You are about to switch to note. Confirm your choice.'}
            </Text>
          </Dialog.Content>
          <Dialog.Actions
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Button
              labelStyle={{fontFamily: '500-Roboto', fontSize: 18}}
              onPress={() => dispatch(setSwitchingModeDialogHide())}>
              Cancel
            </Button>
            <Button
              labelStyle={{fontFamily: '500-Roboto', fontSize: 18}}
              onPress={() => {
                dispatch(setSwitchingModeDialogHide());

                const content =
                  currentType === 'NOTE'
                    ? transformNoteInToDoContent(currentContent)
                    : transformToDoInNoteContent(currentOpenedCheckList!);
                dispatch(
                  setNoteInfo({
                    id: id,
                    title: currentTitle,
                    type: currentType === 'NOTE' ? 'TODO' : 'NOTE',
                    content: content,
                  }),
                );
              }}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default NoteEdit;

const styles = StyleSheet.create({
  segmentedButton: {
    backgroundColor: 'blue',
    flex: 1,
    justifyContent: 'center',
    margin: 0,
    padding: 0,
    width: 20,
    maxWidth: 50,
  },
});
