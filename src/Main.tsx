import {
  Card,
  Checkbox,
  FAB as Fab,
  Searchbar,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import {
  Animated,
  Appearance,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import React, {createRef, useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from './redux/hooks.ts';
import {
  refreshNotes,
  setCurrentType,
  setNoteInfo,
} from './redux/feature/note/noteSlice.ts';
import {deleteEmptyNotes, getDBConnection, getNotes} from './db/db-service.ts';
import DeleteHeader from './DeleteHeader.tsx';
import {Checklist} from './types/Checklist.ts';

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
  const tempCheckList: Checklist[] =
    item.type === 'TODO' ? JSON.parse(item.content) : null;

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
      {item.type === 'NOTE' ? (
        <Card.Content>
          <Text
            variant="titleLarge"
            style={{fontFamily: '400-Roboto', fontSize: 23}}>
            {item.title}
          </Text>
          <Text
            variant="bodyMedium"
            style={{fontFamily: '300-Roboto', fontSize: 17}}
            numberOfLines={5}>
            {item.content.startsWith('<div>')
              ? item.content
                  .substring('<div>'.length)
                  .replace(/<div>/g, '\n')
                  .replace(/&nbsp;/g, ' ')
                  .replace(/<[^>]*>/g, '')
              : item.content
                  .replace(/<div>/g, '\n')
                  .replace(/<[^>]*>/g, '')
                  .replace(/&nbsp;/g, ' ')}
          </Text>
        </Card.Content>
      ) : (
        <Card.Content>
          <Text
            variant="titleLarge"
            style={{fontFamily: '400-Roboto', fontSize: 23}}>
            {item.title}
          </Text>
          {tempCheckList.map((tempItem, index) => {
            return (
              index < 5 && (
                <View
                  key={tempItem.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Checkbox
                    status={tempItem.checked === 1 ? 'checked' : 'unchecked'}
                  />
                  <Text
                    style={{
                      flex: 1,
                      paddingLeft: 5,
                      fontFamily: '300-Roboto',
                      fontSize: 17,
                      textDecorationLine:
                        tempItem.checked === 1 ? 'line-through' : 'none',
                    }}
                    variant="bodyMedium">
                    {tempItem.content}
                  </Text>
                </View>
              )
            );
          })}
        </Card.Content>
      )}
    </Card>
  );
};

const Main = ({setOpen}: {setOpen: (prev: boolean) => void}) => {
  const theme = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [notesData, setNotesData] = useState<any[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const refreshingNotes = useAppSelector(state => state.notes.refreshingNotes);
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 60);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 60],
    outputRange: [0, -60],
  });
  const [snackBarVisible, setSnackBarVisible] = useState<boolean>(false);

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      const storedNotes = await getNotes(db);
      setNotesData(storedNotes);
      setFilteredNotes(storedNotes);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const deleteEmptyDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      const resultSets = await deleteEmptyNotes(db);
      if (resultSets[0].rowsAffected >= 1) {
        setSnackBarVisible(true);
      }
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

  useEffect(() => {
    setFilteredNotes(
      notesData.filter(item => {
        const tempCheckList: Checklist[] =
          item.type === 'TODO' ? JSON.parse(item.content) : null;
        const todoContent =
          tempCheckList !== null
            ? tempCheckList.map(t => t.content).join(' ')
            : '';
        return (
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.type === 'NOTE'
            ? item.content
                .replace(/<[^>]*>/g, '')
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            : todoContent.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }),
    );
  }, [searchQuery]);

  const ref = createRef<TextInput>();

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
          dispatch(setCurrentType('NOTE'));
          navigation.navigate('NoteEdit');
        }}
        customSize={76}
        mode={'flat'}
      />
      {selectedIds.size === 0 ? (
        <Animated.View
          style={{
            transform: [{translateY: translateY}],
            elevation: 1,
            zIndex: 1,
          }}>
          <Searchbar
            ref={ref}
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            traileringIcon={
              isDarkMode ? 'white-balance-sunny' : 'moon-waxing-crescent'
            }
            // onTraileringIconPress={() => setOpen(true)}
            onTraileringIconPress={() => {
              if (isDarkMode) {
                Appearance.setColorScheme('light');
              } else {
                Appearance.setColorScheme('dark');
              }
            }}
            inputStyle={{
              fontFamily: '300-Roboto',
              fontSize: 17,
            }}
            style={{
              marginLeft: 5,
              marginTop: 5,
              marginRight: 5,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          />
        </Animated.View>
      ) : (
        <DeleteHeader
          selectedIds={selectedIds}
          emptySelectedIds={() => setSelectedIds(new Set<number>())}
        />
      )}

      <ScrollView
        scrollEnabled={true}
        onScroll={e => {
          scrollY.setValue(e.nativeEvent.contentOffset.y);
        }}>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: selectedIds.size > 0 ? 0 : 60,
          }}>
          <View style={{flex: 1}}>
            {filteredNotes.map((item, index) => {
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
            {filteredNotes.map((item, index) => {
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
      <Snackbar
        style={{marginBottom: 100}}
        visible={snackBarVisible}
        onDismiss={() => setSnackBarVisible(false)}
        duration={2000}>
        Empty note discarded.
      </Snackbar>
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
