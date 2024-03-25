import {Appbar, IconButton, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Editor from './text-editor/Editor.tsx';
import WebView from 'react-native-webview';
import {createRef} from 'react';

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
  const ref = createRef<WebView>();

  const executeFunctionInWebView = (command: string) => {
    const script = `formatDoc('${command}')`;
    if (ref.current) {
      ref.current.injectJavaScript(script);
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
        <Editor ref={ref} />
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
