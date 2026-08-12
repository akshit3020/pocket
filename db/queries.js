import { db } from "./schema";

// ---- home screen ----

export const getMessagesCount = () =>
  db.getFirstSync("SELECT COUNT(*) as count FROM messages")?.count ?? 0;

export const getVaultItemsCount = () => {
  const p =
    db.getFirstSync("SELECT COUNT(*) as count FROM vault_passwords")?.count ??
    0;
  const n =
    db.getFirstSync("SELECT COUNT(*) as count FROM vault_notes")?.count ?? 0;
  const f =
    db.getFirstSync("SELECT COUNT(*) as count FROM vault_files")?.count ?? 0;
  return p + n + f;
};

export const getLastMessage = () => {
  return (
    db.getFirstSync("SELECT * FROM messages ORDER BY id DESC LIMIT 1") ?? null
  );
};

export const getPasswordsCount = () =>
  db.getFirstSync("SELECT COUNT(*) as count FROM vault_passwords")?.count ?? 0;

export const getNotesCount = () =>
  db.getFirstSync("SELECT COUNT(*) as count FROM vault_notes")?.count ?? 0;

export const getImagesCount = () =>
  db.getFirstSync(
    "SELECT COUNT(*) as count FROM vault_files WHERE type = 'image'",
  )?.count ?? 0;

export const getDocumentsCount = () =>
  db.getFirstSync(
    "SELECT COUNT(*) as count FROM vault_files WHERE type = 'document'",
  )?.count ?? 0;

// ***

// ---- password screen ----
export const getAllPasswords = () =>
  db.getAllSync("SELECT * FROM vault_passwords ORDER BY id DESC");

export const addPassword = ({ title, username, password, website }) => {
  db.runSync(
    "INSERT INTO vault_passwords (title, username, password, website) VALUES (?, ?, ?, ?)",
    [title, username, password, website ?? null],
  );
};

export const updatePassword = (id, { title, username, password, website }) => {
  db.runSync(
    "UPDATE vault_passwords SET title=?, username=?, password=?, website=? WHERE id=?",
    [title, username, password, website ?? null, id],
  );
};

export const deletePassword = (id) => {
  db.runSync("DELETE FROM vault_passwords WHERE id=?", [id]);
};

// ***

// ---- notes screen ----

export const getAllNotes = () =>
  db.getAllSync(
    "SELECT * FROM vault_notes ORDER BY pinned DESC, updatedAt DESC",
  );

// export const addNote = ({ title, content, color, pinned = 0 }) => {
//   const id = Date.now().toString();
//   const now = new Date().toISOString();
//   db.runSync(
//     "INSERT INTO vault_notes (id, title, content, createdAt, updatedAt, color, pinned) VALUES (?, ?, ?, ?, ?, ?, ?)",
//     [id, title ?? "", content ?? "", now, now, color ?? "#1f1f1f", pinned],
//   );
//   return id;
// };

export const addNote = ({ id, title, content, color, pinned = 0 }) => {
  const now = new Date().toISOString();
  db.runSync(
    "INSERT INTO notes (id, title, content, createdAt, updatedAt, color, pinned) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, title ?? "", content ?? "", now, now, color ?? "#171717", pinned],
  );
};

export const updateNote = (id, { title, content, color, pinned }) => {
  const now = new Date().toISOString();
  db.runSync(
    "UPDATE vault_notes SET title=?, content=?, color=?, pinned=?, updatedAt=? WHERE id=?",
    [title ?? "", content ?? "", color ?? "#1f1f1f", pinned ?? 0, now, id],
  );
};

export const deleteNote = (id) => {
  db.runSync("DELETE FROM vault_notes WHERE id=?", [id]);
};

export const getNoteById = (id) =>
  db.getFirstSync("SELECT * FROM vault_notes WHERE id=?", [id]) ?? null;

export const togglePinned = (id, pinned) => {
  db.runSync("UPDATE vault_notes SET pinned=? WHERE id=?", [pinned, id]);
};

// ***

// ---- messages ----

export function getAllMessages() {
  // newest first — matches what GiftedChat expects
  return db.getAllSync(
    `SELECT * FROM messages ORDER BY created_at DESC, id DESC`,
  );
}

export function addMessage(content) {
  const result = db.runSync(`INSERT INTO messages (content) VALUES (?)`, [
    content,
  ]);
  return result.lastInsertRowId;
}

export function deleteMessage(id) {
  db.runSync(`DELETE FROM messages WHERE id = ?`, [id]);
}

export function clearMessages() {
  db.runSync(`DELETE FROM messages`);
}
