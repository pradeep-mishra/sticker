import { calculateNotePosition } from "@/lib/positioning";
import { findElement, generateSelector } from "@/lib/selector";
import {
  deleteNote as deleteNoteFromStorage,
  generateNoteId,
  getNotesForUrl,
  saveNote,
  setNotesVisibility,
  updateNote as updateNoteInStorage
} from "@/lib/storage";
import type { Note } from "@/types/notes";
import { createEffect, createSignal, For, Show } from "solid-js";
import { render } from "solid-js/web";
import { browser } from "wxt/browser";
import { createShadowRootUi } from "wxt/utils/content-script-ui/shadow-root";
import { defineContentScript } from "wxt/utils/define-content-script";

import { NewNoteEditor } from "./content/new-note-editor";
import { OrphanPanel } from "./content/orphan-panel";
import { SelectionOverlay } from "./content/selection-overlay";
import { StickyNote } from "./content/sticky-note";
import { getStyles } from "./content/styles";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "manual",

  async main(ctx) {
    // State signals
    const [notes, setNotes] = createSignal<Note[]>([]);
    const [orphanNotes, setOrphanNotes] = createSignal<Note[]>([]);
    const [isSelectionMode, setIsSelectionMode] = createSignal(false);
    const [notesVisible, setNotesVisible] = createSignal(false);
    const [editingNoteId, setEditingNoteId] = createSignal<string | null>(null);
    const [pendingElement, setPendingElement] = createSignal<Element | null>(
      null
    );

    // Event handlers - must be defined before render
    const handleElementSelected = (element: Element) => {
      setIsSelectionMode(false); // Exit selection mode first
      setPendingElement(element);
    };

    const handleCreateNote = async (content: string) => {
      const element = pendingElement();
      if (!element) return;

      const selector = generateSelector(element);
      const { position } = calculateNotePosition(element);
      const url = window.location.href;

      const note: Note = {
        id: generateNoteId(),
        url,
        selector,
        content,
        position,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await saveNote(note);
      setNotes((prev) => [...prev, note]);
      setPendingElement(null);

      // Update badge (signal already updated, use current count)
      browser.runtime.sendMessage({
        type: "UPDATE_BADGE",
        count: notes().length + orphanNotes().length
      });
    };

    const handleSaveNote = async (noteId: string, content: string) => {
      const url = window.location.href;
      await updateNoteInStorage(url, noteId, content);

      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, content, updatedAt: Date.now() } : n
        )
      );
      setOrphanNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, content, updatedAt: Date.now() } : n
        )
      );
      setEditingNoteId(null);
    };

    const handleDeleteNote = async (noteId: string) => {
      const url = window.location.href;
      await deleteNoteFromStorage(url, noteId);

      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      setOrphanNotes((prev) => prev.filter((n) => n.id !== noteId));

      // Update badge (signal already updated, use current count)
      browser.runtime.sendMessage({
        type: "UPDATE_BADGE",
        count: notes().length + orphanNotes().length
      });
    };

    // Load notes on init
    const loadNotes = async () => {
      const url = window.location.href;
      const allNotes = await getNotesForUrl(url);

      const active: Note[] = [];
      const orphans: Note[] = [];

      for (const note of allNotes) {
        const element = findElement(note.selector);
        if (element) {
          active.push(note);
        } else {
          orphans.push(note);
        }
      }

      setNotes(active);
      setOrphanNotes(orphans);
      // Notes always start hidden on page reload

      // Update badge
      browser.runtime.sendMessage({
        type: "UPDATE_BADGE",
        count: allNotes.length
      });
    };

    // Track highlighted anchor elements for cleanup
    const highlightedElements = new Set<HTMLElement>();

    // Highlight/unhighlight anchor elements based on visibility
    const updateAnchorHighlights = () => {
      // Clear previous highlights
      highlightedElements.forEach((el) => {
        el.style.outline = "";
        el.dataset.stickerHighlight = "";
      });
      highlightedElements.clear();

      // Add highlights if notes are visible
      if (notesVisible()) {
        for (const note of notes()) {
          const element = findElement(note.selector) as HTMLElement | null;
          if (element) {
            element.style.outline = "2px dashed #3B82F6";
            element.dataset.stickerHighlight = "true";
            highlightedElements.add(element);
          }
        }
      }
    };

    // Effect to update highlights when visibility or notes change
    createEffect(() => {
      // Access reactive dependencies
      const visible = notesVisible();
      const notesList = notes();
      updateAnchorHighlights();
    });

    // Create shadow DOM UI
    const ui = await createShadowRootUi(ctx, {
      name: "sticker-notes",
      position: "inline",
      anchor: "body",
      append: "first",
      onMount: (container) => {
        // Inject styles
        const style = document.createElement("style");
        style.textContent = getStyles();
        container.appendChild(style);

        // Render SolidJS app
        const root = document.createElement("div");
        root.id = "sticker-root";
        container.appendChild(root);

        render(
          () => (
            <>
              {/* Selection Mode Overlay - independent of visibility */}
              <Show when={isSelectionMode()}>
                <SelectionOverlay
                  onElementSelected={handleElementSelected}
                  onCancel={() => setIsSelectionMode(false)}
                />
              </Show>

              {/* New Note Editor - independent of visibility */}
              <Show when={pendingElement()}>
                <NewNoteEditor
                  element={pendingElement()!}
                  onSave={handleCreateNote}
                  onCancel={() => setPendingElement(null)}
                />
              </Show>

              {/* Notes and Orphan Panel - visibility controlled */}
              <Show when={notesVisible()}>
                {/* Active Notes */}
                <For each={notes()}>
                  {(note) => (
                    <StickyNote
                      note={note}
                      isEditing={editingNoteId() === note.id}
                      onEdit={() => setEditingNoteId(note.id)}
                      onSave={(content) => handleSaveNote(note.id, content)}
                      onDelete={() => handleDeleteNote(note.id)}
                      onCancelEdit={() => setEditingNoteId(null)}
                    />
                  )}
                </For>

                {/* Orphan Notes Panel */}
                <OrphanPanel
                  notes={orphanNotes()}
                  editingNoteId={editingNoteId()}
                  onEditNote={setEditingNoteId}
                  onSaveNote={handleSaveNote}
                  onDeleteNote={handleDeleteNote}
                  onCancelEdit={() => setEditingNoteId(null)}
                />
              </Show>
            </>
          ),
          root
        );

        return root;
      }
    });

    ui.mount();

    // Reset visibility state on page load (notes start hidden)
    await setNotesVisibility(false);

    // Load notes after mount
    await loadNotes();

    // Message listener for popup communication
    // Note: WXT 0.20 removed webextension-polyfill, so async responses must use sendResponse callback
    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      switch (message.type) {
        case "START_SELECTION_MODE":
          setIsSelectionMode(true);
          break;
        case "STOP_SELECTION_MODE":
          setIsSelectionMode(false);
          break;
        case "GET_STATE":
          sendResponse({ isSelectionMode: isSelectionMode() });
          return; // Synchronous response sent
        case "SET_VISIBILITY":
          setNotesVisible(message.visible);
          break;
        case "TOGGLE_VISIBILITY": {
          const newVisibility = !notesVisible();
          setNotesVisible(newVisibility);
          setNotesVisibility(newVisibility);
          break;
        }
        case "VIEW_NOTE": {
          // Find the note and scroll to its anchor if not orphan
          const allPageNotes = [...notes(), ...orphanNotes()];
          const targetNote = allPageNotes.find((n) => n.id === message.noteId);
          if (targetNote) {
            const anchorElement = findElement(targetNote.selector);
            if (anchorElement) {
              // Not an orphan - scroll to element and show notes in read mode
              anchorElement.scrollIntoView({
                behavior: "smooth",
                block: "center"
              });
            }
            // Show notes and persist to storage so popup reflects correct state
            setNotesVisible(true);
            setNotesVisibility(true);
          }
          break;
        }
        case "EDIT_NOTE":
          setEditingNoteId(message.noteId);
          break;
        case "NOTE_DELETED":
          setNotes((prev) => prev.filter((n) => n.id !== message.noteId));
          setOrphanNotes((prev) => prev.filter((n) => n.id !== message.noteId));
          break;
      }
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (isSelectionMode()) {
          setIsSelectionMode(false);
        }
        if (pendingElement()) {
          setPendingElement(null);
        }
        if (editingNoteId()) {
          setEditingNoteId(null);
        }
      }
    });
  }
});
