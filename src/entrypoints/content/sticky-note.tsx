import { positionManager } from "@/lib/position-manager";
import { calculateNotePosition, NOTE_DIMENSIONS } from "@/lib/positioning";
import { findElement } from "@/lib/selector";
import type { Note } from "@/types/notes";
import { createSignal, onCleanup, Show } from "solid-js";
import { NoteEditorInline } from "./note-editor-inline";

// Sticky Note Component
export function StickyNote(props: {
  note: Note;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (content: string) => void;
  onDelete: () => void;
  onCancelEdit: () => void;
}) {
  const element = findElement(props.note.selector);
  if (!element) return null;

  // Initial position calculation
  const initialPosition = calculateNotePosition(element);
  const [position, setPosition] = createSignal(initialPosition.style);

  // Update position on scroll/resize to follow anchor element
  const updatePosition = () => {
    const el = findElement(props.note.selector);
    if (el) {
      const { style } = calculateNotePosition(el);
      setPosition(style);
    }
  };

  // Subscribe to shared position manager (single scroll/resize handler for all notes)
  const unsubscribe = positionManager.subscribe(updatePosition);

  onCleanup(() => {
    unsubscribe();
  });

  return (
    <div
      class="sticker-ui"
      style={{
        position: "fixed",
        top: position().top,
        left: position().left,
        width: `${NOTE_DIMENSIONS.width}px`,
        "z-index": "2147483646",
        animation: "scaleIn 0.2s ease-out"
      }}>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          "backdrop-filter": "blur(10px)",
          "-webkit-backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          "border-radius": "12px",
          "box-shadow": "0 8px 32px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          "font-family": "system-ui, sans-serif"
        }}>
        <Show
          when={props.isEditing}
          fallback={
            <>
              <div
                style={{
                  padding: "16px",
                  "font-size": "14px",
                  color: "#1f2937",
                  "min-height": "60px",
                  "max-height": "300px",
                  "overflow-y": "auto"
                }}
                innerHTML={props.note.content}
              />
              <div
                style={{
                  display: "flex",
                  "align-items": "center",
                  "justify-content": "space-between",
                  padding: "8px 12px",
                  "border-top": "1px solid rgba(0,0,0,0.05)"
                }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const el = findElement(props.note.selector);
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                      });
                    }
                  }}
                  style={{
                    padding: "4px",
                    background: "transparent",
                    border: "none",
                    "border-radius": "4px",
                    cursor: "pointer",
                    color: "#6b7280"
                  }}
                  title="Scroll to element">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
                  </svg>
                </button>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onEdit();
                    }}
                    style={{
                      padding: "4px",
                      background: "transparent",
                      border: "none",
                      "border-radius": "4px",
                      cursor: "pointer",
                      color: "#6b7280"
                    }}
                    title="Edit">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2">
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onDelete();
                    }}
                    style={{
                      padding: "4px",
                      background: "transparent",
                      border: "none",
                      "border-radius": "4px",
                      cursor: "pointer",
                      color: "#6b7280"
                    }}
                    title="Delete">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          }>
          <NoteEditorInline
            initialContent={props.note.content}
            onSave={props.onSave}
            onCancel={props.onCancelEdit}
          />
        </Show>
      </div>
    </div>
  );
}
