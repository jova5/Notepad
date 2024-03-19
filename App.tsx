import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

function App(): React.JSX.Element {
  return (
    <SafeAreaView>
      <Button onPress={() => console.log('dsds')}>Press me</Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default App;
