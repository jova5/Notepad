import {Appearance, useColorScheme, View} from 'react-native';
import {Drawer as PaperDrawer, IconButton, useTheme} from 'react-native-paper';
import Main from './Main.tsx';
import {Drawer} from 'react-native-drawer-layout';
import React from 'react';

const Home = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = useTheme();
  const [active, setActive] = React.useState('');
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer
      open={open}
      drawerStyle={{backgroundColor: theme.colors.background}}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerPosition={'right'}
      renderDrawerContent={() => {
        return (
          <View>
            <IconButton
              style={{
                alignSelf: 'flex-end',
              }}
              icon={isDarkMode ? 'white-balance-sunny' : 'moon-waxing-crescent'}
              size={25}
              onPress={() => {
                if (isDarkMode) {
                  Appearance.setColorScheme('light');
                } else {
                  Appearance.setColorScheme('dark');
                }
              }}
            />
            <PaperDrawer.Item
              label="First Item"
              active={active === 'first'}
              onPress={() => setActive('first')}
            />
            <PaperDrawer.Item
              label="Second Item"
              active={active === 'second'}
              onPress={() => setActive('second')}
            />
          </View>
        );
      }}>
      <Main setOpen={(prevOpen: boolean) => setOpen(prevOpen)} />
    </Drawer>
  );
};

export default Home;
