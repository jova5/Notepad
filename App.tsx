import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/Home.tsx';
import NoteEdit from './src/NoteEdit.tsx';
import SQLite from 'react-native-sqlite-storage';

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

const db = SQLite.openDatabase(
  {
    name: 'Database',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  },
);

function App(): React.JSX.Element {
  useEffect(() => {
    createTable();
    // populateTable();
  }, []);

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS notepad ' +
          '(' +
          'id integer primary key autoincrement,' +
          'title varchar(255),' +
          'content text' +
          ');',
        [],
        () => {
          // console.log('success creating table');
        },
        error => {
          // console.log(error);
        },
      );
    });
  };

  const populateTable = () => {
    console.log('ttt');
    for (let d of data) {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO notepad (title, content) VALUES (?, ?)',
          [d.title, d.content],
          () => {
            // console.log('success insert');
          },
          error => {
            // console.log(error);
          },
        );
      });
    }
  };

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
