import {FAB as Fab, Searchbar, useTheme} from 'react-native-paper';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import React from 'react';

const Main = ({setOpen}: {setOpen: (prev: boolean) => void}) => {
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}>
      <Fab
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('Pressed')}
        customSize={76}
        mode={'flat'}
      />
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        onIconPress={() => console.log('icon press')}
        traileringIcon={'menu'}
        onTraileringIconPress={() => setOpen(true)}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          display: 'flex',
        }}
      />
    </SafeAreaView>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexGrow: 1,
    padding: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
