import React, {useCallback, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/Home.tsx';
import NoteEdit from './src/NoteEdit.tsx';
import {createTable, getDBConnection} from './src/db/db-service.ts';

// TODO: delete before production
const data = [
  {id: 1, title: 'A', content: 'Random content'},
  {id: 2, title: 'B', content: 'Some other content for B'},
  {id: 3, title: 'C', content: 'Content for C'},
  {id: 4, title: 'D', content: 'Additional content for D'},
  {id: 5, title: 'E', content: 'Content for E goes here'},
  {id: 6, title: 'F', content: 'Content for F'},
  {id: 7, title: 'G', content: 'Last but not least, content for G'},
  {id: 8, title: 'A', content: 'Random content'},
  {
    id: 9,
    title: 'B',
    content: 'Some other content for B dsa dasd asd asd asd as dasd asd as d',
  },
  {id: 10, title: 'C', content: 'Content for C'},
  {id: 11, title: 'D', content: 'Additional content for D'},
  {id: 12, title: 'E', content: 'Content for E goes here'},
  {id: 13, title: 'F', content: 'Content for F'},
  {id: 14, title: 'G', content: 'Last but not least, content for G'},
  {id: 15, title: 'A', content: 'Random content'},
  {id: 16, title: 'B', content: 'Some other content for B'},
  {id: 17, title: 'C', content: 'Content for C'},
  {id: 18, title: 'D', content: 'Additional content for D'},
  {id: 19, title: 'E', content: 'Content for E goes here'},
  {id: 20, title: 'F', content: 'Content for F'},
  {id: 21, title: 'G', content: 'Last but not least, content for G'},
  {id: 22, title: 'A', content: 'Random content'},
  {
    id: 23,
    title: 'B',
    content: 'Some other content for B dsa dasd asd asd asd as dasd asd as d',
  },
  {id: 24, title: 'C', content: 'Content for C'},
  {id: 25, title: 'D', content: 'Additional content for D'},
  {id: 26, title: 'E', content: 'Content for E goes here'},
  {id: 27, title: 'F', content: 'Content for F'},
  {id: 28, title: 'G', content: 'Last but not least, content for G'},
];

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const createTableCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      // TODO: delete before production
      // await populateNotes(db, data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    createTableCallback();
  }, [createTableCallback]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NoteEdit"
          component={NoteEdit}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
