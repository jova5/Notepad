import WebView from 'react-native-webview';
import {forwardRef, Ref, useRef} from 'react';
import {useTheme} from 'react-native-paper';

const myHtmlFile = require('./TextEditor.html');

const Editor = forwardRef((props, ref: Ref<WebView>) => {
  const theme = useTheme();

  // const webViewRef = ref;
  //
  // const sendDataToWebView = () => {
  //   const data = {key: 'value'}; // Your data object
  //   const jsonData = JSON.stringify(data); // Convert data to JSON string
  //
  //   // Inject JavaScript code into the WebView to call the function with the data
  //   ref.current.injectJavaScript(`receiveDataFromReactNative(${jsonData})`);
  // };
  //
  // const onLoadWebView = () => {
  //   sendDataToWebView(); // Send data after the WebView is loaded
  // };

  return (
    <WebView
      ref={ref}
      originWhitelist={['*']}
      source={myHtmlFile}
      javaScriptEnabled={true}
      injectedJavaScriptBeforeContentLoaded={
        'receiveDataFromReactNative("test")'
      }
      style={{
        backgroundColor: theme.colors.background,
      }}
    />
  );
});

export default Editor;
