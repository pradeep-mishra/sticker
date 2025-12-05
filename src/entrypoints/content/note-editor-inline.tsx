import { createSignal, Show } from "solid-js";
import { ToolbarButton } from "./toolbar-button";

// Inline Note Editor Component
export function NoteEditorInline(props: {
  initialContent?: string;
  onSave: (content: string) => void;
  onCancel: () => void;
  autoFocus?: boolean;
}) {
  let editorRef: HTMLDivElement | undefined;
  let linkInputRef: HTMLInputElement | undefined;
  const [showLinkPopup, setShowLinkPopup] = createSignal(false);
  const [linkUrl, setLinkUrl] = createSignal("");
  let savedSelection: Range | null = null;

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelection = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelection) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedSelection);
    }
  };

  const handleLinkSubmit = () => {
    const url = linkUrl().trim();
    if (url) {
      restoreSelection();
      editorRef?.focus();
      document.execCommand("createLink", false, url);
    }
    setShowLinkPopup(false);
    setLinkUrl("");
    savedSelection = null;
  };

  const handleLinkCancel = () => {
    setShowLinkPopup(false);
    setLinkUrl("");
    savedSelection = null;
    editorRef?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      props.onCancel();
    }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
    // Keyboard shortcuts for formatting
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b") {
        e.preventDefault();
        execFormat("bold");
      } else if (e.key === "i") {
        e.preventDefault();
        execFormat("italic");
      }
    }
  };

  const handleSave = () => {
    const content = editorRef?.innerHTML?.trim() ?? "";
    if (content && content !== "<br>") {
      props.onSave(content);
    } else {
      props.onCancel();
    }
  };

  const execFormat = (command: string, value?: string) => {
    editorRef?.focus();
    document.execCommand(command, false, value);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* RTE Toolbar */}
      <div
        style={{
          display: "flex",
          "align-items": "center",
          gap: "2px",
          padding: "6px 8px",
          "border-bottom": "1px solid rgba(0,0,0,0.05)",
          background: "rgba(0,0,0,0.02)"
        }}>
        <ToolbarButton onClick={() => execFormat("bold")} title="Bold (Ctrl+B)">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execFormat("italic")}
          title="Italic (Ctrl+I)">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5">
            <line x1="19" y1="4" x2="10" y2="4" />
            <line x1="14" y1="20" x2="5" y2="20" />
            <line x1="15" y1="4" x2="9" y2="20" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execFormat("underline")}
          title="Underline (Ctrl+U)">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M6 4v6a6 6 0 0 0 12 0V4" />
            <line x1="4" y1="20" x2="20" y2="20" />
          </svg>
        </ToolbarButton>
        <div
          style={{
            width: "1px",
            height: "16px",
            background: "rgba(0,0,0,0.1)",
            margin: "0 4px"
          }}
        />
        <ToolbarButton
          onClick={() => {
            saveSelection();
            setShowLinkPopup(true);
            setTimeout(() => linkInputRef?.focus(), 0);
          }}
          title="Insert Link">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </ToolbarButton>
        <div
          style={{
            width: "1px",
            height: "16px",
            background: "rgba(0,0,0,0.1)",
            margin: "0 4px"
          }}
        />
        <ToolbarButton
          onClick={() => execFormat("insertUnorderedList")}
          title="Bullet List">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">
            <line x1="9" y1="6" x2="20" y2="6" />
            <line x1="9" y1="12" x2="20" y2="12" />
            <line x1="9" y1="18" x2="20" y2="18" />
            <circle cx="4" cy="6" r="1.5" fill="currentColor" />
            <circle cx="4" cy="12" r="1.5" fill="currentColor" />
            <circle cx="4" cy="18" r="1.5" fill="currentColor" />
          </svg>
        </ToolbarButton>
      </div>
      {/* Editor */}
      <div
        ref={(el) => {
          editorRef = el;
          if (props.autoFocus) {
            // Focus after render using setTimeout to ensure DOM is ready
            setTimeout(() => el.focus(), 0);
          }
        }}
        contentEditable
        style={{
          "min-height": "80px",
          "max-height": "200px",
          "overflow-y": "auto",
          padding: "12px",
          "font-size": "14px",
          color: "#1f2937",
          outline: "none"
        }}
        innerHTML={props.initialContent ?? ""}
        onKeyDown={handleKeyDown}
        data-placeholder="Type your note..."
      />
      <div
        style={{
          display: "flex",
          "align-items": "center",
          "justify-content": "space-between",
          "border-top": "1px solid rgba(0,0,0,0.05)",
          padding: "8px 12px"
        }}>
        <span style={{ "font-size": "11px", color: "#9ca3af" }}>
          Ctrl+Enter to save
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={props.onCancel}
            style={{
              padding: "4px 12px",
              "font-size": "12px",
              color: "#6b7280",
              background: "transparent",
              border: "none",
              cursor: "pointer"
            }}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: "4px 12px",
              "font-size": "12px",
              color: "white",
              background: "#3B82F6",
              "border-radius": "4px",
              border: "none",
              cursor: "pointer"
            }}>
            Save
          </button>
        </div>
      </div>
      {/* Link URL Overlay - covers editor and footer */}
      <Show when={showLinkPopup()}>
        <div
          style={{
            position: "absolute",
            top: "33px",
            left: "0",
            right: "0",
            bottom: "0",
            background: "rgba(255,255,255,0.97)",
            display: "flex",
            "flex-direction": "column",
            "border-radius": "0 0 12px 12px"
          }}
          onClick={(e) => e.stopPropagation()}>
          {/* Content */}
          <div
            style={{
              flex: "1",
              display: "flex",
              "flex-direction": "column",
              "align-items": "center",
              "justify-content": "center",
              padding: "12px"
            }}>
            <div
              style={{
                "font-size": "13px",
                color: "#6b7280",
                "font-weight": "500",
                "margin-bottom": "12px"
              }}>
              Enter link URL
            </div>
            <input
              ref={(el) => (linkInputRef = el)}
              type="url"
              placeholder="https://example.com"
              value={linkUrl()}
              onInput={(e) => setLinkUrl(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLinkSubmit();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  handleLinkCancel();
                }
              }}
              style={{
                width: "100%",
                "max-width": "240px",
                padding: "8px 12px",
                "font-size": "13px",
                border: "1px solid #e5e7eb",
                "border-radius": "6px",
                outline: "none"
              }}
            />
          </div>
          {/* Footer */}
          <div
            style={{
              display: "flex",
              "align-items": "center",
              "justify-content": "flex-end",
              "border-top": "1px solid rgba(0,0,0,0.05)",
              padding: "8px 12px",
              gap: "8px"
            }}>
            <button
              type="button"
              onClick={handleLinkCancel}
              style={{
                padding: "4px 12px",
                "font-size": "12px",
                color: "#6b7280",
                background: "transparent",
                border: "none",
                cursor: "pointer"
              }}>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLinkSubmit}
              style={{
                padding: "4px 12px",
                "font-size": "12px",
                color: "white",
                background: "#3B82F6",
                "border-radius": "4px",
                border: "none",
                cursor: "pointer"
              }}>
              Add
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
}
