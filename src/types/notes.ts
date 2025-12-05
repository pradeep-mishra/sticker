export type NotePosition = "left" | "right" | "top" | "bottom";

export interface Note {
  id: string;
  url: string;
  selector: string;
  content: string; // HTML content from editor
  position: NotePosition;
  createdAt: number;
  updatedAt: number;
}

export interface PageNotes {
  [url: string]: Note[];
}
