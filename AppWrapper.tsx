import {MD3DarkTheme, MD3LightTheme, PaperProvider} from 'react-native-paper';
import App from './App.tsx';
import {darkThemeColors} from './colors/darkThemColors';
import {useColorScheme} from 'react-native';
import {lightThemeColors} from './colors/lightThemeColors';

const AppWrapper = () => {
  const colorScheme = useColorScheme();

  const theme =
    colorScheme === 'dark'
      ? {...MD3DarkTheme, colors: darkThemeColors}
      : {...MD3LightTheme, colors: lightThemeColors};

  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
};

export default AppWrapper;
