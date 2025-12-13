import type { Note } from "@/types/notes";
import type { NoteTheme } from "@/types/theme";
import { createSignal, For, Show } from "solid-js";
import { NoteEditorInline } from "./note-editor-inline";

// Orphan Panel Component
export function OrphanPanel(props: {
  notes: Note[];
  theme: NoteTheme;
  editingNoteId: string | null;
  onEditNote: (id: string) => void;
  onSaveNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  onCancelEdit: () => void;
}) {
  const [isCollapsed, setIsCollapsed] = createSignal(false);

  const truncate = (html: string, max: number = 50) => {
    const text = html.replace(/<[^>]*>/g, "");
    return text.length <= max ? text : text.slice(0, max) + "…";
  };

  return (
    <Show when={props.notes.length > 0}>
      <div
        class="sticker-ui"
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          "z-index": "2147483646",
          animation: "slideIn 0.3s ease-out"
        }}>
        <div
          style={{
            background: props.theme.noteBackground,
            "backdrop-filter": "blur(10px)",
            "-webkit-backdrop-filter": "blur(10px)",
            border: `1px solid ${props.theme.borderColor}`,
            "border-left": `4px solid ${props.theme.primaryColor}`,
            "border-radius": "12px",
            "box-shadow": "0 8px 32px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            width: "288px",
            "font-family": "system-ui, sans-serif"
          }}>
          {/* Header */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed())}
            style={{
              width: "100%",
              display: "flex",
              "align-items": "center",
              "justify-content": "space-between",
              padding: "8px 12px",
              background: "rgba(251, 191, 36, 0.1)",
              "border-bottom": "1px solid rgba(251, 191, 36, 0.2)",
              border: "none",
              cursor: "pointer"
            }}>
            <div
              style={{
                display: "flex",
                "align-items": "center",
                gap: "8px",
                color: "#b45309"
              }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span style={{ "font-size": "14px", "font-weight": "500" }}>
                Orphan Notes ({props.notes.length})
              </span>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b45309"
              stroke-width="2"
              style={{
                transform: isCollapsed() ? "rotate(0deg)" : "rotate(180deg)"
              }}>
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Notes list */}
          <Show when={!isCollapsed()}>
            <div style={{ "max-height": "320px", "overflow-y": "auto" }}>
              <For each={props.notes}>
                {(note) => (
                  <div
                    style={{ "border-bottom": "1px solid rgba(0,0,0,0.05)" }}>
                    <Show
                      when={props.editingNoteId === note.id}
                      fallback={
                        <div
                          style={{
                            padding: "8px 12px",
                            display: "flex",
                            "align-items": "center",
                            "justify-content": "space-between",
                            gap: "8px"
                          }}>
                          <span
                            style={{
                              "font-size": "14px",
                              color: "#4b5563",
                              flex: "1",
                              overflow: "hidden",
                              "text-overflow": "ellipsis",
                              "white-space": "nowrap"
                            }}>
                            {truncate(note.content)}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              gap: "4px",
                              "flex-shrink": "0"
                            }}>
                            <button
                              type="button"
                              onClick={() => props.onEditNote(note.id)}
                              style={{
                                padding: "4px",
                                background: "transparent",
                                border: "none",
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
                              onClick={() => props.onDeleteNote(note.id)}
                              style={{
                                padding: "4px",
                                background: "transparent",
                                border: "none",
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
                      }>
                      <div style={{ padding: "8px" }}>
                        <NoteEditorInline
                          initialContent={note.content}
                          onSave={(content) =>
                            props.onSaveNote(note.id, content)
                          }
                          onCancel={props.onCancelEdit}
                        />
                      </div>
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
}
