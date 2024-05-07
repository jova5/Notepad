import React, {useCallback, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/Home.tsx';
import NoteEdit from './src/NoteEdit.tsx';
import {
  createTable,
  getDBConnection,
  populateNotes,
} from './src/db/db-service.ts';

// TODO: delete before production
const data = [
  {
    id: 1,
    title: 'ToDo',
    content:
      '[{"id": "46767a75-b8c0-4aa5-acad-c7e6e631fcd4", "order": 1, "checked": 0, "content": "popravi"},' +
      '{"id": "46767a75-b8c0-4aa5-acad-c7e6e631fcd5", "order": 2, "checked": 1, "content": "popravi2"}]',
    type: 'TODO',
  },
  {id: 2, title: 'B', content: 'Some other content for B', type: 'NOTE'},
  {id: 3, title: 'C', content: 'Content for C', type: 'NOTE'},
  {id: 4, title: 'D', content: 'Additional content for D', type: 'NOTE'},
  {id: 5, title: 'E', content: 'Content for E goes here', type: 'NOTE'},
  {id: 6, title: 'F', content: 'Content for F', type: 'NOTE'},
  {
    id: 7,
    title: 'G',
    content: 'Last but not least, content for G',
    type: 'NOTE',
  },
  {id: 8, title: 'A', content: 'Random content', type: 'NOTE'},
  {
    id: 9,
    title: 'B',
    content: 'Some other content for B dsa dasd asd asd asd as dasd asd as d',
    type: 'NOTE',
  },
  {id: 10, title: 'C', content: 'Content for C', type: 'NOTE'},
  {id: 11, title: 'D', content: 'Additional content for D', type: 'NOTE'},
  {id: 12, title: 'E', content: 'Content for E goes here', type: 'NOTE'},
  {id: 13, title: 'F', content: 'Content for F', type: 'NOTE'},
  {
    id: 14,
    title: 'G',
    content: 'Last but not least, content for G',
    type: 'NOTE',
  },
  {id: 15, title: 'A', content: 'Random content', type: 'NOTE'},
  {id: 16, title: 'B', content: 'Some other content for B', type: 'NOTE'},
  {id: 17, title: 'C', content: 'Content for C', type: 'NOTE'},
  {id: 18, title: 'D', content: 'Additional content for D', type: 'NOTE'},
  {id: 19, title: 'E', content: 'Content for E goes here', type: 'NOTE'},
  {id: 20, title: 'F', content: 'Content for F', type: 'NOTE'},
  {
    id: 21,
    title: 'G',
    content: 'Last but not least, content for G',
    type: 'NOTE',
  },
  {id: 22, title: 'A', content: 'Random content', type: 'NOTE'},
  {
    id: 23,
    title: 'B',
    content: 'Some other content for B dsa dasd asd asd asd as dasd asd as d',
    type: 'NOTE',
  },
  {id: 24, title: 'C', content: 'Content for C', type: 'NOTE'},
  {id: 25, title: 'D', content: 'Additional content for D', type: 'NOTE'},
  {id: 26, title: 'E', content: 'Content for E goes here', type: 'NOTE'},
  {id: 27, title: 'F', content: 'Content for F', type: 'NOTE'},
  {
    id: 28,
    title: 'G',
    content: 'Last but not least, content for G',
    type: 'NOTE',
  },
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
