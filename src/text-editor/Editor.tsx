import WebView from 'react-native-webview';
import {forwardRef, Ref, useEffect, useRef, useState} from 'react';
import {TextInput, useTheme} from 'react-native-paper';
import {transparent} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import {useAppSelector} from '../redux/hooks.ts';

const myHtmlFile = require('./TextEditor.html');

const Editor = forwardRef((props, ref: Ref<WebView>) => {
  const theme = useTheme();
  const [htmlContent, setHtmlContent] = useState('');

  const id = useAppSelector(state => state.notes.id);
  const title = useAppSelector(state => state.notes.title);
  const content = useAppSelector(state => state.notes.content);

  // const webViewRef = ref;

  const onLoadWebView = () => {
    sendDataToWebView(); // Send data after the WebView is loaded
  };

  const sendDataToWebView = () => {
    // const data = {key: 'value'}; // Your data object
    // const jsonData = JSON.stringify(data); // Convert data to JSON string

    // Inject JavaScript code into the WebView to call the function with the data
    if (ref !== null) {
      ref.current.injectJavaScript(
        `receiveDataFromReactNative(${JSON.stringify(content)})`,
      );
    }
  };

  const handleMessage = event => {
    // Extract HTML content from the message
    const receivedHtmlContent = event.nativeEvent.data;
    // Update state with the received HTML content
    setHtmlContent(receivedHtmlContent);
  };

  useEffect(() => {
    console.log(htmlContent);
  }, [htmlContent]);

  return (
    <>
      <TextInput
        style={{backgroundColor: theme.colors.background}} //
        underlineStyle={{display: 'none'}}
        outlineStyle={{display: 'none'}}
        placeholder="Title"
        contentStyle={{fontSize: 24}}
        value={title}
      />
      <WebView
        ref={ref}
        originWhitelist={['*']}
        source={myHtmlFile}
        javaScriptEnabled={true}
        onLoad={onLoadWebView}
        // injectedJavaScriptBeforeContentLoaded={
        //   'receiveDataFromReactNative("test")'
        // }
        onMessage={handleMessage}
        style={{
          backgroundColor: theme.colors.background,
        }}
      />
    </>
  );
});

export default Editor;
