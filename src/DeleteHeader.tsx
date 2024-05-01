import {View} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {useCallback} from 'react';
import {deleteNotes, getDBConnection} from './db/db-service.ts';
import {useAppDispatch} from './redux/hooks.ts';
import {refreshNotes} from './redux/feature/note/noteSlice.ts';

const DeleteHeader = ({
  selectedIds,
  emptySelectedIds,
}: {
  selectedIds: Set<number>;
  emptySelectedIds: () => void;
}) => {
  const dispatch = useAppDispatch();
  const deleteSelectedNotes = useCallback(async (ids: Set<number>) => {
    try {
      const db = await getDBConnection();
      await deleteNotes(db, [...ids]);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View
        style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <IconButton icon={'close'} onPress={emptySelectedIds} />
        <Text variant="titleLarge">{selectedIds.size}</Text>
      </View>
      <View
        style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <IconButton
          icon={'delete'}
          onPress={() => {
            deleteSelectedNotes(selectedIds);
            dispatch(refreshNotes());
          }}
        />
      </View>
    </View>
  );
};

export default DeleteHeader;
