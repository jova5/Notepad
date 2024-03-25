import WebView from 'react-native-webview';
import {forwardRef, Ref} from 'react';
import {useTheme} from 'react-native-paper';

const myHtmlFile = require('./TextEditor.html');

const Editor = forwardRef((props, ref: Ref<WebView>) => {
  const theme = useTheme();

  return (
    <WebView
      ref={ref}
      originWhitelist={['*']}
      source={myHtmlFile}
      style={{
        backgroundColor: theme.colors.background,
      }}
    />
  );
});

export default Editor;
