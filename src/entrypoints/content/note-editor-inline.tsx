import { createSignal, Show } from "solid-js";
import { ToolbarButton } from "./toolbar-button";

/**
 * Validate URL - only allow http:// and https:// schemes
 * Prevents javascript: and data: URL injection
 */
const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    // If URL parsing fails, check if it's a relative URL or missing protocol
    // Allow URLs that start with common patterns
    if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) {
      return true;
    }
    // Try adding https:// to see if it becomes valid
    try {
      const withProtocol = new URL(`https://${url}`);
      return (
        withProtocol.protocol === "https:" &&
        withProtocol.hostname.includes(".")
      );
    } catch {
      return false;
    }
  }
};

/**
 * Normalize URL - add https:// if no protocol specified
 */
const normalizeUrl = (url: string): string => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) {
    return url;
  }
  return `https://${url}`;
};

/**
 * Execute formatting command using execCommand
 * Note: execCommand is deprecated but remains the most reliable way
 * to handle rich text formatting in contentEditable elements.
 * It has browser-level selection preservation that custom implementations lack.
 */
const execFormat = (
  command: string,
  editorRef: HTMLDivElement | undefined,
  value?: string
): void => {
  editorRef?.focus();
  document.execCommand(command, false, value);
};

/**
 * Insert a link with validated URL
 */
const insertLink = (
  url: string,
  editorRef: HTMLDivElement | undefined
): void => {
  if (!editorRef) return;
  editorRef.focus();
  document.execCommand("createLink", false, url);
};

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
  const [linkError, setLinkError] = createSignal("");
  let savedSelection: Range | null = null;

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelection = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelection && editorRef) {
      editorRef.focus();
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedSelection);
    }
  };

  const handleLinkSubmit = () => {
    const url = linkUrl().trim();
    if (!url) {
      setLinkError("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      setLinkError("Please enter a valid http:// or https:// URL");
      return;
    }

    const normalizedUrl = normalizeUrl(url);
    restoreSelection();
    insertLink(normalizedUrl, editorRef);

    setShowLinkPopup(false);
    setLinkUrl("");
    setLinkError("");
    savedSelection = null;
  };

  const handleLinkCancel = () => {
    setShowLinkPopup(false);
    setLinkUrl("");
    setLinkError("");
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
        execFormat("bold", editorRef);
      } else if (e.key === "i") {
        e.preventDefault();
        execFormat("italic", editorRef);
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
        <ToolbarButton
          onClick={() => execFormat("bold", editorRef)}
          title="Bold (Ctrl+B)">
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
          onClick={() => execFormat("italic", editorRef)}
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
          onClick={() => execFormat("underline", editorRef)}
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
          onClick={() => execFormat("insertUnorderedList", editorRef)}
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
              onInput={(e) => {
                setLinkUrl(e.currentTarget.value);
                setLinkError(""); // Clear error on input
              }}
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
                border: linkError() ? "1px solid #ef4444" : "1px solid #e5e7eb",
                "border-radius": "6px",
                outline: "none"
              }}
            />
            <Show when={linkError()}>
              <div
                style={{
                  "font-size": "11px",
                  color: "#ef4444",
                  "margin-top": "6px",
                  "text-align": "center"
                }}>
                {linkError()}
              </div>
            </Show>
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
