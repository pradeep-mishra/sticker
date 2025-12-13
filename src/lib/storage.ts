import type { Note, PageNotes } from "@/types/notes";
import { DEFAULT_THEME_ID, type ThemeId } from "@/types/theme";
import { browser } from "wxt/browser";

const STORAGE_KEY = "sticker_notes";
const VISIBILITY_KEY = "sticker_visible";
const THEME_KEY = "sticker_theme";

export const getAllNotes = async (): Promise<PageNotes> => {
  const result = await browser.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as PageNotes) ?? ({} as PageNotes);
};

export const getNotesForUrl = async (url: string): Promise<Note[]> => {
  const allNotes = await getAllNotes();
  return allNotes[url] ?? [];
};

export const saveNote = async (note: Note): Promise<void> => {
  const allNotes = await getAllNotes();
  const pageNotes = allNotes[note.url] ?? [];

  const existingIndex = pageNotes.findIndex((n) => n.id === note.id);
  if (existingIndex >= 0) {
    pageNotes[existingIndex] = note;
  } else {
    pageNotes.push(note);
  }

  allNotes[note.url] = pageNotes;
  await browser.storage.local.set({ [STORAGE_KEY]: allNotes });
};

export const deleteNote = async (
  url: string,
  noteId: string
): Promise<void> => {
  const allNotes = await getAllNotes();
  const pageNotes = allNotes[url] ?? [];

  allNotes[url] = pageNotes.filter((n) => n.id !== noteId);

  // Clean up empty URL entries
  if (allNotes[url].length === 0) {
    delete allNotes[url];
  }

  await browser.storage.local.set({ [STORAGE_KEY]: allNotes });
};

export const updateNote = async (
  url: string,
  noteId: string,
  content: string
): Promise<void> => {
  const allNotes = await getAllNotes();
  const pageNotes = allNotes[url] ?? [];

  const noteIndex = pageNotes.findIndex((n) => n.id === noteId);
  if (noteIndex >= 0) {
    pageNotes[noteIndex] = {
      ...pageNotes[noteIndex],
      content,
      updatedAt: Date.now()
    };
    allNotes[url] = pageNotes;
    await browser.storage.local.set({ [STORAGE_KEY]: allNotes });
  }
};

export const getNotesVisibility = async (): Promise<boolean> => {
  const result = await browser.storage.local.get(VISIBILITY_KEY);
  return (result[VISIBILITY_KEY] as boolean | undefined) ?? false;
};

export const setNotesVisibility = async (visible: boolean): Promise<void> => {
  await browser.storage.local.set({ [VISIBILITY_KEY]: visible });
};

export const getNoteCount = async (url: string): Promise<number> => {
  const notes = await getNotesForUrl(url);
  return notes.length;
};

export const generateNoteId = (): string => {
  return crypto.randomUUID();
};

export const getNoteTheme = async (): Promise<ThemeId> => {
  const result = await browser.storage.local.get(THEME_KEY);
  return (result[THEME_KEY] as ThemeId | undefined) ?? DEFAULT_THEME_ID;
};

export const setNoteTheme = async (themeId: ThemeId): Promise<void> => {
  await browser.storage.local.set({ [THEME_KEY]: themeId });
};
