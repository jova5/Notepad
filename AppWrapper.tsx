import {MD3DarkTheme, MD3LightTheme, PaperProvider} from 'react-native-paper';
import App from './App.tsx';
import {useColorScheme} from 'react-native';
import {darkThemeColors} from './colors/darkThemColors';
import {lightThemeColors} from './colors/lightThemeColors';

const AppWrapper = () => {
  const colorScheme = useColorScheme();

  const newTheme =
    colorScheme === 'dark'
      ? {...MD3DarkTheme, colors: {...darkThemeColors}}
      : {...MD3LightTheme, colors: {...lightThemeColors}};

  return (
    <PaperProvider theme={newTheme}>
      <App />
    </PaperProvider>
  );
};

export default AppWrapper;
