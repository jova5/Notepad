import {Appbar, IconButton, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Editor from './text-editor/Editor.tsx';

const NoteEditHeader = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <Appbar.Header
      style={{
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outline,
      }}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content title="Title" />
    </Appbar.Header>
  );
};

const NoteEdit = () => {
  const theme = useTheme();

  return (
    <>
      <NoteEditHeader />
      <SafeAreaView
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
        }}>
        <Editor />
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
          <IconButton icon={'undo'} mode={'contained'} onPress={() => {}} />
          <IconButton icon={'redo'} mode={'contained'} onPress={() => {}} />
          <IconButton
            icon={'format-bold'}
            mode={'contained'}
            onPress={() => {}}
          />
          <IconButton
            icon={'format-underline'}
            mode={'contained'}
            onPress={() => {}}
          />
          <IconButton
            icon={'format-italic'}
            mode={'contained'}
            onPress={() => {}}
          />
          <IconButton
            icon={'format-strikethrough'}
            mode={'contained'}
            onPress={() => {}}
          />
        </View>
      </SafeAreaView>
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
