# 📌 Sticker — Web Sticky Notes Extension

## Complete Project Specification

---

## Overview

A browser extension that allows users to attach sticky notes to any element on any webpage. Notes persist and reappear when revisiting the page.

---

## Core Features

### 1. Note Creation Flow

```
User clicks extension icon
        ↓
Popup opens with options:
  • "Add Note" button
  • "Show/Hide Notes" toggle
  • List of notes on current page
        ↓
User clicks "Add Note"
        ↓
Popup closes, enters SELECTION MODE
  • Cursor changes to indicate mode
  • Elements highlight with border on hover
        ↓
User clicks an element
        ↓
Sticky note editor appears beside element
  • Smart positioning (opposite side, avoid edges)
  • Glassmorphism style
  • Lexical rich text editor
        ↓
User types note and clicks Save (or clicks outside)
        ↓
Note saved, SELECTION MODE CONTINUES
  • User can add more notes
  • Exit by: Extension icon → "Done Adding"
```

---

### 2. Note Display

| Aspect                 | Behavior                                                 |
| ---------------------- | -------------------------------------------------------- |
| **Default visibility** | Always visible when page loads (if notes exist)          |
| **Style**              | Glassmorphism (frosted glass, blur, subtle border)       |
| **Position**           | Smart: opposite side of element, respects viewport edges |
| **Actions**            | Edit (in place), Delete button on each note              |

---

### 3. Orphan Notes

When a note's element is not found (CSS selector fails):

| Aspect             | Behavior                           |
| ------------------ | ---------------------------------- |
| **Location**       | Fixed panel, top-right of viewport |
| **Display**        | Collapsible list                   |
| **Actions**        | Edit icon, Delete icon per note    |
| **Click behavior** | No action (element doesn't exist)  |

---

### 4. Extension Popup

```
┌─────────────────────────────┐
│  📌 Sticker                 │
├─────────────────────────────┤
│  [➕ Add Note]              │
│  [👁️ Show/Hide Notes: ON]   │
├─────────────────────────────┤
│  Notes on this page (3):    │
│  ┌─────────────────────┐    │
│  │ "Remember to check…"│ ✏️🗑️│
│  └─────────────────────────┘│
│  ┌─────────────────────┐    │
│  │ "Important link he…"│ ✏️🗑️│
│  └─────────────────────────┘│
└─────────────────────────────┘
```

**States:**

- When in selection mode: Button changes to "Done Adding"
- Toggle reflects current visibility state

---

### 5. Extension Icon Badge

- Shows count of notes on current page
- Example: `3` displayed on icon
- Updates when notes added/deleted

---

### 6. Keyboard Shortcuts

Unique combinations to avoid page conflicts:

| Shortcut          | Action                               |
| ----------------- | ------------------------------------ |
| `Alt + Shift + A` | Enter Add Note mode                  |
| `Alt + Shift + V` | Toggle note visibility               |
| `Escape`          | Exit selection mode / Cancel editing |

---

## Technical Specifications

### Data Model

```typescript
interface Note {
  id: string; // UUID
  url: string; // Exact page URL
  selector: string; // CSS selector path
  content: string; // Rich text (Lexical JSON or HTML)
  position: "left" | "right" | "top" | "bottom"; // Computed on render
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
}

interface PageNotes {
  [url: string]: Note[];
}
```

### Storage

- **API**: `browser.storage.local`
- **Structure**: Notes indexed by exact URL
- **Limit**: ~5MB total (plenty for text notes)

### Element Selection

```typescript
// Generate CSS selector for clicked element
const getSelector = (element: Element): string => {
  // Build path like: body > div.container > article > p:nth-child(3)
  // Use IDs when available, fallback to nth-child
};

// Find element by selector (returns null if not found → orphan)
const findElement = (selector: string): Element | null => {
  return document.querySelector(selector);
};
```

### Smart Positioning Logic

```typescript
const getPosition = (element: Element): Position => {
  const rect = element.getBoundingClientRect();
  const viewport = { width: window.innerWidth, height: window.innerHeight };

  // If element is in right half → position note on left
  // If element is in left half → position note on right
  // If near bottom → position above
  // If near top → position below
};
```

---

## UI Components

### 1. Sticky Note Component

```
┌─────────────────────────────────────┐
│ ░░░░░░░░░ GLASSMORPHISM ░░░░░░░░░░ │
│                                     │
│  Rich text content here...          │
│  Can have **bold**, _italic_, etc.  │
│                                     │
│                          [✏️] [🗑️]  │
└─────────────────────────────────────┘

Style:
- background: rgba(255, 255, 255, 0.7)
- backdrop-filter: blur(10px)
- border: 1px solid rgba(255, 255, 255, 0.3)
- border-radius: 12px
- box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)
```

### 2. Orphan Notes Panel

```
┌──────────────────────┐  ← Fixed top-right
│ ⚠️ Orphan Notes (2) ▼│  ← Collapsible header
├──────────────────────┤
│ "Note text prev…" ✏️🗑️│
│ "Another note…"   ✏️🗑️│
└──────────────────────┘
```

### 3. Selection Mode Indicator

- Element borders on hover: `outline: 2px dashed #3B82F6`
- Cursor: `crosshair` or custom cursor
- Optional: Dim overlay on page with tooltip "Click an element to add a note"

---

## Architecture

```
entrypoints/
├── popup/                    # Extension popup UI
│   ├── index.html
│   ├── app.tsx              # Popup component
│   └── popup.css
├── background.ts            # Service worker (badge updates, shortcuts)
├── content.ts               # Injected into pages (notes rendering)
└── content/
    └── styles.css           # Injected styles

src/
├── components/
│   ├── ui/
│   │   └── button.tsx
│   ├── sticky-note.tsx      # Note display/edit component
│   ├── note-editor.tsx      # Lexical RTE wrapper
│   ├── orphan-panel.tsx     # Orphan notes panel
│   └── selection-overlay.tsx # Selection mode UI
├── stores/
│   └── notes-store.ts       # Notes state management
├── lib/
│   ├── selector.ts          # CSS selector generation
│   ├── positioning.ts       # Smart note positioning
│   └── storage.ts           # browser.storage helpers
└── types/
    └── notes.ts             # TypeScript interfaces
```

---

## Implementation Phases

### Phase 1: Foundation

- [ ] Project setup (WXT + SolidJS + Tailwind + Lexical)
- [ ] Storage utilities
- [ ] CSS selector generation & element finding
- [ ] Basic note data model

### Phase 2: Core Note System

- [ ] Selection mode (element highlighting, click capture)
- [ ] Note creation with Lexical editor
- [ ] Smart positioning logic
- [ ] Note persistence (save/load)

### Phase 3: Note Display

- [ ] Glassmorphism sticky note component
- [ ] Notes rendering on page load
- [ ] Edit in place
- [ ] Delete functionality

### Phase 4: Orphan Handling

- [ ] Detect orphan notes (selector fails)
- [ ] Orphan panel UI (collapsible, fixed)
- [ ] Orphan note edit/delete

### Phase 5: Popup & Controls

- [ ] Popup UI (Add Note, Toggle, List)
- [ ] Badge count updates
- [ ] Show/Hide all notes toggle
- [ ] Selection mode exit ("Done Adding")

### Phase 6: Polish

- [ ] Keyboard shortcuts
- [ ] Animations & transitions
- [ ] Edge case handling
- [ ] Cross-browser testing (Chrome, Firefox, Edge, Brave)

---

## Decisions Log

| Question                | Decision                                                  |
| ----------------------- | --------------------------------------------------------- |
| Element identification  | CSS selector path                                         |
| Orphan notes            | Show in collapsible fixed panel at top-right              |
| Note positioning        | Smart positioning (opposite side of element, avoid edges) |
| Visibility toggle       | Via popup + keyboard shortcut                             |
| Default visibility      | Always visible when page loads                            |
| Storage                 | `browser.storage.local`                                   |
| URL matching            | Exact URL match                                           |
| Note content            | Rich text using Lexical                                   |
| Visual style            | Glassmorphism                                             |
| Selection mode behavior | Continues until user clicks "Done Adding"                 |
| Extension icon badge    | Yes, shows note count                                     |
| Note width              | Fixed width (~280px)                                      |
| Edit mode               | Click edit icon to edit                                   |

---

## Open Items

1. **Note width**: Fixed width (280px) — confirm or adjust? Confirm
2. **Maximum notes per page**: No limit for now, revisit if performance issues
3. **Empty state in popup**: Show "No notes on this page" message
4. **Extension name**: "Sticker" — confirmed
