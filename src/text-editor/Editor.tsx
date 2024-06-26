import WebView from 'react-native-webview';
import {forwardRef, Ref} from 'react';
import {TextInput, useTheme} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '../redux/hooks.ts';
import {
  setCurrentContent,
  setCurrentTitle,
  setId,
} from '../redux/feature/note/noteSlice.ts';
import {getDBConnection, saveNote} from '../db/db-service.ts';
import {Platform} from 'react-native';

const myHtmlFile = require('../assets/html/TextEditor.html');

const Editor = forwardRef((props, ref: Ref<WebView>) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const id = useAppSelector(state => state.notes.id);
  const title = useAppSelector(state => state.notes.currentTitle);
  const content = useAppSelector(state => state.notes.currentContent);

  const onLoadWebView = () => {
    sendDataToWebView(); // Send data after the WebView is loaded
  };

  const sendDataToWebView = () => {
    if (ref !== null) {
      // @ts-ignore
      ref.current.injectJavaScript(
        `receiveDataFromReactNative(${JSON.stringify(content)})`,
      );
      // @ts-ignore
      ref.current.injectJavaScript(
        `receiveTheme(${JSON.stringify(theme.colors.onBackground)})`,
      );
    }
  };

  // @ts-ignore
  const handleMessage = event => {
    const receivedHtmlContent = event.nativeEvent.data;

    dispatch(setCurrentContent(receivedHtmlContent));
    updateCurrentNote();
  };

  const updateCurrentNote = async () => {
    try {
      const db = await getDBConnection();
      const note = {id: id, title: title, content: content, type: 'NOTE'};
      const results = await saveNote(db, note);
      dispatch(setId(results[0].insertId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TextInput
        style={{backgroundColor: theme.colors.background}} //
        underlineStyle={{display: 'none'}}
        outlineStyle={{display: 'none'}}
        placeholder="Title"
        contentStyle={{fontSize: 24, fontFamily: '400-Roboto'}}
        defaultValue={title}
        onChangeText={text => {
          dispatch(setCurrentTitle(text));
          updateCurrentNote();
        }}
      />
      <WebView
        ref={ref}
        originWhitelist={['*']}
        source={
          Platform.OS === 'ios'
            ? require('../../src/assets/html/TextEditor.html')
            : {uri: 'file:///android_asset/html/TextEditor.html'}
        }
        allowFileAccess
        allowingReadAccessToURL={'file://'}
        allowUniversalAccessFromFileURLs
        allowFileAccessFromFileURLs
        javaScriptEnabled={true}
        onLoad={onLoadWebView}
        domStorageEnabled
        onMessage={handleMessage}
        style={{
          backgroundColor: theme.colors.background,
        }}
      />
    </>
  );
});

export default Editor;
