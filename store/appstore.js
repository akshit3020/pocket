import { create } from "zustand";
import {
  addMessage,
  addNote,
  addPassword,
  clearMessages,
  deleteMessage,
  deleteNote,
  deletePassword,
  getAllMessages,
  getAllNotes,
  getAllPasswords,
  getDocumentsCount,
  getImagesCount,
  getLastMessage,
  getMessagesCount,
  getNotesCount,
  getPasswordsCount,
  getVaultItemsCount,
  togglePinned,
  updateNote,
  updatePassword,
} from "../db/queries";

export const useAppStore = create((set, get) => ({
  messagesCount: 0,
  vaultCount: 0,
  lastMessage: null,
  passwordsCount: 0,
  notesCount: 0,
  imagesCount: 0,
  documentsCount: 0,

  loadCounts: () => {
    set({
      messagesCount: getMessagesCount(),
      vaultCount: getVaultItemsCount(),
      lastMessage: getLastMessage(),
      passwordsCount: getPasswordsCount(),
      notesCount: getNotesCount(),
      imagesCount: getImagesCount(),
      documentsCount: getDocumentsCount(),
    });
  },

  // passwords screen
  passwords: [],

  loadPasswords: () => set({ passwords: getAllPasswords() }),

  addPasswordEntry: (data) => {
    addPassword(data);
    get().loadPasswords();
    get().loadCounts();
  },

  updatePasswordEntry: (id, data) => {
    updatePassword(id, data);
    get().loadPasswords();
  },

  deletePasswordEntry: (id) => {
    deletePassword(id);
    get().loadPasswords();
    get().loadCounts();
  },

  // notes screen
  notes: [],

  loadNotes: () => set({ notes: getAllNotes() }),

  addNoteEntry: (data) => {
    addNote(data);
    get().loadNotes();
    get().loadCounts();
  },

  updateNoteEntry: (id, data) => {
    updateNote(id, data);
    get().loadNotes();
  },

  deleteNoteEntry: (id) => {
    deleteNote(id);
    get().loadNotes();
    get().loadCounts();
  },

  togglePinnedEntry: (id, pinned) => {
    togglePinned(id, pinned);
    get().loadNotes();
  },

  // chat screen
  messages: [],

  loadMessages: () => set({ messages: getAllMessages() }),

  sendMessage: (content) => {
    if (!content?.trim()) return;
    addMessage(content.trim());
    get().loadMessages();
    get().loadCounts();
  },

  deleteMessageEntry: (id) => {
    deleteMessage(id);
    get().loadMessages();
    get().loadCounts();
  },

  clearAllMessages: () => {
    clearMessages();
    get().loadMessages();
    get().loadCounts();
  },
}));
