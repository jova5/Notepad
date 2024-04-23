import {MD3DarkTheme, MD3LightTheme, PaperProvider} from 'react-native-paper';
import App from './App.tsx';
import {useColorScheme} from 'react-native';
import {darkThemeColors} from './colors/darkThemColors';
import {lightThemeColors} from './colors/lightThemeColors';
import {Provider} from 'react-redux';
import {store} from './src/redux/store.ts';

const AppWrapper = () => {
  const colorScheme = useColorScheme();

  const newTheme =
    colorScheme === 'dark'
      ? {...MD3DarkTheme, colors: {...darkThemeColors}}
      : {...MD3LightTheme, colors: {...lightThemeColors}};

  return (
    <Provider store={store}>
      <PaperProvider theme={newTheme}>
        <App />
      </PaperProvider>
    </Provider>
  );
};

export default AppWrapper;
