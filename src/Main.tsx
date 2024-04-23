import {
  Button,
  Card,
  FAB as Fab,
  Searchbar,
  Text,
  useTheme,
  Avatar,
} from 'react-native-paper';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import SQLite from 'react-native-sqlite-storage';
import {useAppDispatch} from './redux/hooks.ts';
import {setOpenNoteInfo} from './redux/feature/note/noteSlice.ts';

// const data = [
//   {id: 1, title: 'A', content: 'Random content'},
//   {id: 2, title: 'B', content: 'Some other content for B'},
//   {id: 3, title: 'C', content: 'Content for C'},
//   {id: 4, title: 'D', content: 'Additional content for D'},
//   {id: 5, title: 'E', content: 'Content for E goes here'},
//   {id: 6, title: 'F', content: 'Content for F'},
//   {id: 7, title: 'G', content: 'Last but not least, content for G'},
//   {id: 8, title: 'A', content: 'Random content'},
//   {
//     id: 9,
//     title: 'B',
//     content: 'Some other content for B dsa dasd asd asd asd as dasd asd as d',
//   },
//   {id: 10, title: 'C', content: 'Content for C'},
//   {id: 11, title: 'D', content: 'Additional content for D'},
//   {id: 12, title: 'E', content: 'Content for E goes here'},
//   {id: 13, title: 'F', content: 'Content for F'},
//   {id: 14, title: 'G', content: 'Last but not least, content for G'},
//   {id: 15, title: 'A', content: 'Random content'},
//   {id: 16, title: 'B', content: 'Some other content for B'},
//   {id: 17, title: 'C', content: 'Content for C'},
//   {id: 18, title: 'D', content: 'Additional content for D'},
//   {id: 19, title: 'E', content: 'Content for E goes here'},
//   {id: 20, title: 'F', content: 'Content for F'},
//   {id: 21, title: 'G', content: 'Last but not least, content for G'},
//   {id: 22, title: 'A', content: 'Random content'},
//   {
//     id: 23,
//     title: 'B',
//     content: 'Some other content for B dsa dasd asd asd asd as dasd asd as d',
//   },
//   {id: 24, title: 'C', content: 'Content for C'},
//   {id: 25, title: 'D', content: 'Additional content for D'},
//   {id: 26, title: 'E', content: 'Content for E goes here'},
//   {id: 27, title: 'F', content: 'Content for F'},
//   {id: 28, title: 'G', content: 'Last but not least, content for G'},
// ];

const RenderListItem = ({
  item,
  selectedIds,
  onLongPress,
  onPress,
}: {
  item: any;
  selectedIds: any[];
  onLongPress: (id: number) => void;
  onPress: (id: number) => void;
}) => {
  const theme = useTheme();

  if (item.empty) {
    return <View style={[styles.item, styles.itemInvisible]} />;
  }

  return (
    <Card
      style={[
        styles.item,
        {
          backgroundColor: selectedIds.includes(item.id)
            ? theme.colors.elevation.level5
            : theme.colors.elevation.level1,
        },
      ]}
      onPress={() => onPress(item.id)}
      onLongPress={() => onLongPress(item.id)}>
      <Card.Content>
        <Text variant="titleLarge">{item.title}</Text>
        <Text variant="bodyMedium" numberOfLines={5}>
          {item.content}
        </Text>
      </Card.Content>
    </Card>
  );
};

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

const Main = ({setOpen}: {setOpen: (prev: boolean) => void}) => {
  const theme = useTheme();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const [notepadData, setNotepadData] = useState<any[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const data = [];
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM notepad', [], (tx, result) => {
        for (let i = 0; i < result.rows.length; i++) {
          // console.log(result.rows.item(i));
          data.push({
            id: result.rows.item(i).id,
            title: result.rows.item(i).title,
            content: result.rows.item(i).content,
          });
        }
        setNotepadData(data);
      });
    });
  }, []);

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

      <ScrollView scrollEnabled={true}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            {notepadData.map((item, index) => {
              if (index % 2 === 0) {
                return (
                  <RenderListItem
                    key={item.id}
                    item={item}
                    selectedIds={selectedIds}
                    onLongPress={(id: number) =>
                      setSelectedIds(prev => [...prev, id])
                    }
                    onPress={(id: number) => {
                      if (selectedIds.includes(id)) {
                        setSelectedIds(prev =>
                          prev.filter(prevId => prevId !== id),
                        );
                      } else {
                        dispatch(setOpenNoteInfo(item));
                        navigation.navigate('NoteEdit');
                      }
                    }}
                  />
                );
              }
            })}
          </View>
          <View style={{flex: 1}}>
            {notepadData.map((item, index) => {
              if (index % 2 !== 0) {
                return (
                  <RenderListItem
                    key={item.id}
                    item={item}
                    selectedIds={selectedIds}
                    onLongPress={(id: number) =>
                      setSelectedIds(prev => [...prev, id])
                    }
                    onPress={(id: number) => {
                      if (selectedIds.includes(id)) {
                        setSelectedIds(prev =>
                          prev.filter(prevId => prevId !== id),
                        );
                      } else {
                        dispatch(setOpenNoteInfo(item));
                        navigation.navigate('NoteEdit');
                      }
                    }}
                  />
                );
              }
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexGrow: 1,
    padding: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  item: {
    margin: 5,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
});
