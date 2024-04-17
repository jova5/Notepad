import WebView from 'react-native-webview';
import {forwardRef, Ref, useRef} from 'react';
import {TextInput, useTheme} from 'react-native-paper';
import {transparent} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

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
    <>
      <TextInput
        style={{backgroundColor: theme.colors.background}} //
        underlineStyle={{display: 'none'}}
        outlineStyle={{display: 'none'}}
        placeholder="Title"
        contentStyle={{fontSize: 24}}
      />
      <WebView
        ref={ref}
        originWhitelist={['*']}
        source={myHtmlFile}
        javaScriptEnabled={true}
        // injectedJavaScriptBeforeContentLoaded={
        //   'receiveDataFromReactNative("test")'
        // }
        style={{
          backgroundColor: theme.colors.background,
        }}
      />
    </>
  );
});

export default Editor;
