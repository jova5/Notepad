import WebView from 'react-native-webview';
import {createRef} from 'react';
import {useTheme} from 'react-native-paper';

const myHtmlFile = require('./TextEditor.html');

const Editor = () => {
  const ref = createRef<WebView>();
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
};

export default Editor;
