import {Card, FAB as Fab, Searchbar, Text, useTheme} from 'react-native-paper';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from './redux/hooks.ts';
import {
  refreshNotes,
  setNewTitle,
  setNoteInfo,
} from './redux/feature/note/noteSlice.ts';
import {deleteEmptyNotes, getDBConnection, getNotes} from './db/db-service.ts';
import DeleteHeader from './DeleteHeader.tsx';

const RenderListItem = ({
  item,
  selectedIds,
  onLongPress,
  onPress,
}: {
  item: any;
  selectedIds: Set<number>;
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
          backgroundColor: selectedIds.has(item.id)
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

const Main = ({setOpen}: {setOpen: (prev: boolean) => void}) => {
  const theme = useTheme();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [notesData, setNotesData] = useState<any[]>([]);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const refreshingNotes = useAppSelector(state => state.notes.refreshingNotes);

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      const storedNotes = await getNotes(db);
      setNotesData(storedNotes);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const deleteEmptyDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await deleteEmptyNotes(db);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadDataCallback();
    setSelectedIds(new Set<number>());
  }, [loadDataCallback]);

  useEffect(() => {
    if (refreshingNotes) {
      deleteEmptyDataCallback().then(() => {
        loadDataCallback();
        dispatch(refreshNotes());
        setSelectedIds(new Set<number>());
      });
    }
  }, [loadDataCallback, refreshingNotes]);

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
        onPress={() => {
          navigation.navigate('NoteEdit');
        }}
        customSize={76}
        mode={'flat'}
      />
      {selectedIds.size === 0 ? (
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          onIconPress={() => console.log('icon press')}
          traileringIcon={'menu'}
          onTraileringIconPress={() => setOpen(true)}
          style={{marginLeft: 5, marginTop: 5, marginRight: 5}}
        />
      ) : (
        <DeleteHeader
          selectedIds={selectedIds}
          emptySelectedIds={() => setSelectedIds(new Set<number>())}
        />
      )}

      <ScrollView scrollEnabled={true}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            {notesData.map((item, index) => {
              if (index % 2 === 0) {
                return (
                  <RenderListItem
                    key={item.id}
                    item={item}
                    selectedIds={selectedIds}
                    onLongPress={(id: number) =>
                      setSelectedIds(prev => new Set([...prev, id]))
                    }
                    onPress={(id: number) => {
                      if (selectedIds.has(id)) {
                        setSelectedIds(
                          prev =>
                            new Set([...prev].filter(prevId => prevId !== id)),
                        );
                      } else if (selectedIds.size > 0) {
                        setSelectedIds(prev => new Set([...prev, id]));
                      } else {
                        dispatch(setNoteInfo(item));
                        navigation.navigate('NoteEdit');
                      }
                    }}
                  />
                );
              }
            })}
          </View>
          <View style={{flex: 1}}>
            {notesData.map((item, index) => {
              if (index % 2 !== 0) {
                return (
                  <RenderListItem
                    key={item.id}
                    item={item}
                    selectedIds={selectedIds}
                    onLongPress={(id: number) =>
                      setSelectedIds(prev => new Set([...prev, id]))
                    }
                    onPress={(id: number) => {
                      if (selectedIds.has(id)) {
                        setSelectedIds(
                          prev =>
                            new Set([...prev].filter(prevId => prevId !== id)),
                        );
                      } else if (selectedIds.size > 0) {
                        setSelectedIds(prev => new Set([...prev, id]));
                      } else {
                        dispatch(setNewTitle(undefined));
                        dispatch(setNoteInfo(item));
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
