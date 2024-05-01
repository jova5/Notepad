import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';

const tableName = 'note';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({name: 'Database', location: 'default'});
};

export const createTable = async (db: SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
    id integer primary key autoincrement,
    title varchar(255),
    content text
    );`;

  await db.executeSql(query);
};

export const getNotes = async (db: SQLiteDatabase): Promise<any[]> => {
  try {
    const notes: any[] = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName}`);

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        notes.push(result.rows.item(index));
      }
    });

    return notes;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get notes !!!');
  }
};

export const saveNote = async (db: SQLiteDatabase, note: any) => {
  const insertQuery = `INSERT OR REPLACE INTO ${tableName}(id, title, content) 
    values (${note.id}, '${note.title}', '${note.content}')`;

  return db.executeSql(insertQuery);
};

export const deleteEmptyNotes = async (db: SQLiteDatabase) => {
  const deleteQuery = `DELETE from ${tableName} where title = "" and content = ""`;
  await db.executeSql(deleteQuery);
};

export const deleteNotes = async (db: SQLiteDatabase, ids: number[]) => {
  const deleteQuery = `DELETE from ${tableName} where id IN (${ids})`;
  await db.executeSql(deleteQuery);
};

export const populateNotes = async (db: SQLiteDatabase, notes: any[]) => {
  const insertQuery =
    `INSERT INTO ${tableName}(id, title, content) values` +
    notes.map(i => `(${i.id}, '${i.title}', '${i.content}')`).join(',');

  return db.executeSql(insertQuery);
};
