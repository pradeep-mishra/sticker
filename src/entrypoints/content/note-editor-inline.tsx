import {
  BoldIcon,
  BulletListIcon,
  ItalicIcon,
  LinkIcon,
  UnderlineIcon
} from "@/components/ui/icons";
import { createSignal, onCleanup, onMount, Show } from "solid-js";
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
  let containerRef: HTMLDivElement | undefined;
  let editorRef: HTMLDivElement | undefined;
  let linkInputRef: HTMLInputElement | undefined;
  const [showLinkPopup, setShowLinkPopup] = createSignal(false);
  const [linkUrl, setLinkUrl] = createSignal("");
  const [linkError, setLinkError] = createSignal("");
  let savedSelection: Range | null = null;

  /**
   * Block keyboard events from propagating to webpage.
   * Registered on document level in capture phase to intercept before webpage handlers.
   * Only blocks events that originate from within our container.
   * Uses composedPath() to properly handle Shadow DOM event retargeting.
   */
  const documentKeyHandler = (e: KeyboardEvent) => {
    // Use composedPath to check if event originated from our container (works with Shadow DOM)
    const path = e.composedPath();
    if (containerRef && path.includes(containerRef)) {
      // Stop propagation but NOT immediate - allow our element handlers to run
      e.stopPropagation();

      // Re-focus editor if focus was stolen (some sites move focus on keydown)
      // Use microtask to run after any synchronous focus changes
      queueMicrotask(() => {
        const shadowRoot = containerRef.getRootNode() as ShadowRoot;
        const shadowActive = shadowRoot?.activeElement;

        // If focus moved outside our editor, restore it
        if (
          editorRef &&
          shadowActive !== editorRef &&
          shadowActive !== linkInputRef
        ) {
          editorRef.focus();
        }
      });
    }
  };

  // Register capture-phase listeners on DOCUMENT level to intercept events
  // before any webpage handlers can process them
  onMount(() => {
    // Keyboard events - most important for shortcuts
    document.addEventListener("keydown", documentKeyHandler, true);
    document.addEventListener("keyup", documentKeyHandler, true);
    document.addEventListener("keypress", documentKeyHandler, true);
  });

  onCleanup(() => {
    document.removeEventListener("keydown", documentKeyHandler, true);
    document.removeEventListener("keyup", documentKeyHandler, true);
    document.removeEventListener("keypress", documentKeyHandler, true);
  });

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

  /**
   * Stop all event propagation to prevent webpage shortcuts from triggering.
   * Uses stopImmediatePropagation to stop all other handlers on same element.
   */
  const stopAllPropagation = (e: Event) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Block all keyboard events from reaching the webpage

    stopAllPropagation(e);

    if (e.key === "Escape") {
      e.preventDefault();
      props.onCancel();
      return;
    }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
      return;
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
    <div ref={containerRef} style={{ position: "relative" }}>
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
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execFormat("italic", editorRef)}
          title="Italic (Ctrl+I)">
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execFormat("underline", editorRef)}
          title="Underline (Ctrl+U)">
          <UnderlineIcon />
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
          <LinkIcon />
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
          <BulletListIcon />
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
        onKeyUp={stopAllPropagation}
        onKeyPress={stopAllPropagation}
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
                stopAllPropagation(e);
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLinkSubmit();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  handleLinkCancel();
                }
              }}
              onKeyUp={stopAllPropagation}
              onKeyPress={stopAllPropagation}
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
