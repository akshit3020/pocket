import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("pocket.db");

export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS vault_passwords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      username TEXT,
      password TEXT NOT NULL,
      website TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS vault_notes (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT,
      content TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      color TEXT,
      pinned INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS vault_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,       -- 'image' | 'document'
      uri TEXT NOT NULL,        -- local file path
      size INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
};
