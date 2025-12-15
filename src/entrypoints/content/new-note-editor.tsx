import { positionManager } from "@/lib/position-manager";
import { calculateNotePosition, NOTE_DIMENSIONS } from "@/lib/positioning";
import { createSignal, onCleanup } from "solid-js";
import { NoteEditorInline } from "./note-editor-inline";

// New Note Editor Component
export function NewNoteEditor(props: {
  element: Element;
  onSave: (content: string) => void;
  onCancel: () => void;
}) {
  // Track position reactively to follow element on scroll/resize
  const initialPosition = calculateNotePosition(props.element);
  const [position, setPosition] = createSignal(initialPosition.style);

  const updatePosition = () => {
    const { style } = calculateNotePosition(props.element);
    setPosition(style);
  };

  // Subscribe to shared position manager
  const unsubscribe = positionManager.subscribe(updatePosition);
  onCleanup(() => unsubscribe());

  return (
    <div
      class="sticker-ui"
      style={{
        position: "fixed",
        top: position().top,
        left: position().left,
        width: `${NOTE_DIMENSIONS.width}px`,
        "z-index": "9999",
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
        <NoteEditorInline
          onSave={props.onSave}
          onCancel={props.onCancel}
          autoFocus
        />
      </div>
    </div>
  );
}
