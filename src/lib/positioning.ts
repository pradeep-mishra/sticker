import type { NotePosition } from "@/types/notes";

const NOTE_WIDTH = 280;
const NOTE_MARGIN = 12;
const VIEWPORT_PADDING = 16;

interface PositionResult {
  position: NotePosition;
  style: {
    top: string;
    left: string;
    right?: string;
    bottom?: string;
  };
}

/**
 * Calculate the best position for a note relative to an element
 * Prefers: right > left > bottom > top
 * Avoids: viewport edges
 */
export const calculateNotePosition = (element: Element): PositionResult => {
  const rect = element.getBoundingClientRect();
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  // Calculate available space on each side
  const spaceRight = viewport.width - rect.right - NOTE_MARGIN;
  const spaceLeft = rect.left - NOTE_MARGIN;
  const spaceBottom = viewport.height - rect.bottom - NOTE_MARGIN;
  const spaceTop = rect.top - NOTE_MARGIN;

  // Determine best horizontal position
  let position: NotePosition;
  let style: PositionResult["style"];

  if (spaceRight >= NOTE_WIDTH + VIEWPORT_PADDING) {
    // Position on right
    position = "right";
    style = {
      top: `${Math.max(VIEWPORT_PADDING, rect.top)}px`,
      left: `${rect.right + NOTE_MARGIN}px`
    };
  } else if (spaceLeft >= NOTE_WIDTH + VIEWPORT_PADDING) {
    // Position on left
    position = "left";
    style = {
      top: `${Math.max(VIEWPORT_PADDING, rect.top)}px`,
      left: `${rect.left - NOTE_WIDTH - NOTE_MARGIN}px`
    };
  } else if (spaceBottom >= 150) {
    // Position below (minimum height check)
    position = "bottom";
    style = {
      top: `${rect.bottom + NOTE_MARGIN}px`,
      left: `${Math.max(VIEWPORT_PADDING, Math.min(rect.left, viewport.width - NOTE_WIDTH - VIEWPORT_PADDING))}px`
    };
  } else {
    // Position above
    position = "top";
    style = {
      top: `${Math.max(VIEWPORT_PADDING, rect.top - NOTE_MARGIN - 150)}px`,
      left: `${Math.max(VIEWPORT_PADDING, Math.min(rect.left, viewport.width - NOTE_WIDTH - VIEWPORT_PADDING))}px`
    };
  }

  // Ensure the note doesn't go off-screen vertically
  const topValue = parseInt(style.top);
  if (topValue + 200 > viewport.height) {
    style.top = `${Math.max(VIEWPORT_PADDING, viewport.height - 200 - VIEWPORT_PADDING)}px`;
  }

  return { position, style };
};

export const NOTE_DIMENSIONS = {
  width: NOTE_WIDTH,
  margin: NOTE_MARGIN,
  padding: VIEWPORT_PADDING
};
