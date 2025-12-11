import {
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  PlusIcon,
  StickerIcon,
  SuperStickerIcon,
  TrashIcon
} from "@/components/ui/icons";
import {
  deleteNote,
  getNotesForUrl,
  getNotesVisibility,
  setNotesVisibility
} from "@/lib/storage";
import type { Note } from "@/types/notes";
import {
  Component,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show
} from "solid-js";
import { browser } from "wxt/browser";

// Platform detection for keyboard shortcuts (using modern API with fallback)
const getPlatform = (): "mac" | "windows" | "linux" => {
  // Modern API (Chromium browsers)
  const uaData = (
    navigator as Navigator & { userAgentData?: { platform: string } }
  ).userAgentData;
  if (uaData?.platform) {
    const platform = uaData.platform.toLowerCase();
    if (platform === "macos") return "mac";
    if (platform === "windows") return "windows";
    return "linux";
  }

  // Fallback for Firefox and older browsers
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mac")) return "mac";
  if (ua.includes("win")) return "windows";
  return "linux";
};

// Get modifier key display based on platform
const getModifierKeys = () => {
  const platform = getPlatform();
  if (platform === "mac") {
    return { alt: "⌥", shift: "⇧" };
  }
  return { alt: "Alt", shift: "Shift" };
};

// Keyboard shortcut component
const KeyboardShortcut: Component<{
  keys: string[];
  label: string;
}> = (props) => {
  return (
    <div class="flex items-center gap-2">
      <span class="text-gray-400 text-[9px] font-medium uppercase tracking-wide min-w-[52px]">
        {props.label}
      </span>
      <div class="flex items-center gap-0.5">
        <For each={props.keys}>
          {(key, index) => (
            <>
              <kbd class="bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-gray-600 text-[10px] font-semibold shadow-sm min-w-[20px] text-center">
                {key}
              </kbd>
              <Show when={index() < props.keys.length - 1}>
                <span class="text-gray-300 text-[9px]">+</span>
              </Show>
            </>
          )}
        </For>
      </div>
    </div>
  );
};

const App: Component = () => {
  const [notes, setNotes] = createSignal<Note[]>([]);
  const [notesVisible, setNotesVisible] = createSignal(false);
  const [isSelectionMode, setIsSelectionMode] = createSignal(false);
  const [currentUrl, setCurrentUrl] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(true);
  const [currentTabId, setCurrentTabId] = createSignal<number | null>(null);
  const [isAccordionOpen, setIsAccordionOpen] = createSignal(false);

  // Load popup state from storage and content script
  const loadState = async () => {
    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true
      });

      if (tab?.url && tab?.id) {
        setCurrentTabId(tab.id);
        setCurrentUrl(tab.url);

        // Load notes for this URL
        const pageNotes = await getNotesForUrl(tab.url);
        setNotes(pageNotes);

        // Get visibility state from storage
        const visible = await getNotesVisibility();
        setNotesVisible(visible);

        // Check if selection mode is active
        const response = (await browser.tabs
          .sendMessage(tab.id, {
            type: "GET_STATE"
          })
          .catch(() => ({ isSelectionMode: false }))) as {
          isSelectionMode?: boolean;
        };
        setIsSelectionMode(response?.isSelectionMode ?? false);
      }
    } catch (error) {
      console.error("Failed to load popup data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    loadState();

    // Listen for tab updates (page reload) to refresh state
    const handleTabUpdated = (
      tabId: number,
      changeInfo: { status?: string }
    ) => {
      // When current tab finishes loading, refresh state
      if (tabId === currentTabId() && changeInfo.status === "complete") {
        loadState();
      }
    };

    browser.tabs.onUpdated.addListener(handleTabUpdated);

    onCleanup(() => {
      browser.tabs.onUpdated.removeListener(handleTabUpdated);
    });
  });

  const handleAddNote = async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true
    });

    if (tab?.id) {
      await browser.tabs.sendMessage(tab.id, { type: "START_SELECTION_MODE" });
      setIsSelectionMode(true);
      window.close();
    }
  };

  const handleDoneAdding = async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true
    });

    if (tab?.id) {
      await browser.tabs.sendMessage(tab.id, { type: "STOP_SELECTION_MODE" });
      setIsSelectionMode(false);
    }
  };

  const handleToggleVisibility = async () => {
    const newVisibility = !notesVisible();
    await setNotesVisibility(newVisibility);
    setNotesVisible(newVisibility);

    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true
    });

    if (tab?.id) {
      await browser.tabs.sendMessage(tab.id, {
        type: "SET_VISIBILITY",
        visible: newVisibility
      });
    }
  };

  const handleViewNote = async (noteId: string) => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true
    });

    if (tab?.id) {
      await browser.tabs.sendMessage(tab.id, {
        type: "VIEW_NOTE",
        noteId
      });
      window.close();
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(currentUrl(), noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));

    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true
    });

    if (tab?.id) {
      await browser.tabs.sendMessage(tab.id, {
        type: "NOTE_DELETED",
        noteId
      });
      // Update badge
      await browser.runtime.sendMessage({
        type: "UPDATE_BADGE",
        tabId: tab.id,
        count: notes().length
      });
    }
  };

  const truncateContent = (html: string, maxLength: number = 60): string => {
    const text = html.replace(/<[^>]*>/g, "");
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "…";
  };

  return (
    <div class="flex flex-col min-h-[200px] max-h-[500px] bg-gray-50/50 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header class="px-5 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div class="flex items-center gap-2.5">
          <div class="p-1.5 bg-blue-50 rounded-lg text-sticker-primary">
            <SuperStickerIcon class="w-5 h-5" />
          </div>
          <h1 class="text-lg font-bold tracking-tight text-gray-900">
            Super Sticker
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main class="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Action Buttons - Fixed */}
        <div class="shrink-0 p-4 pb-0 grid grid-cols-1 gap-3">
          <Show
            when={!isSelectionMode()}
            fallback={
              <button
                onClick={handleDoneAdding}
                class="group flex items-center justify-center gap-3 w-full py-3 px-4 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl font-semibold shadow-lg shadow-gray-500/20 hover:shadow-gray-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                <span class="relative flex h-2.5 w-2.5 mr-1">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
                Done Adding
              </button>
            }>
            <button
              onClick={handleAddNote}
              class="group flex items-center justify-center gap-3 w-full py-3 px-4 bg-gradient-to-br from-sticker-primary to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
              <div class="p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                <PlusIcon class="w-4 h-4" />
              </div>
              Add Note
            </button>
          </Show>

          <button
            onClick={handleToggleVisibility}
            class="group flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.99]">
            <Show
              when={notesVisible()}
              fallback={
                <EyeOffIcon class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              }>
              <EyeIcon class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </Show>
            {notesVisible() ? "Hide Notes" : "Show Notes"}
          </button>
        </div>

        {/* Notes List Section - Scrollable */}
        <div class="flex-1 min-h-0 overflow-y-auto popup-main p-4 space-y-3">
          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen())}
            class="flex items-center justify-between w-full px-1 py-1 hover:bg-gray-100/50 rounded-lg transition-colors group">
            <h2 class="text-[11px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-500 transition-colors">
              On this page ({notes().length})
            </h2>
            <ChevronDownIcon
              class={`w-4 h-4 text-gray-400 group-hover:text-gray-500 transition-all duration-200 ${
                isAccordionOpen() ? "rotate-0" : "-rotate-90"
              }`}
            />
          </button>

          <Show when={isAccordionOpen()}>
            <div class="overflow-hidden animate-accordion-open">
              <Show
                when={!isLoading()}
                fallback={
                  <div class="py-12 flex flex-col items-center justify-center text-gray-400 space-y-2">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-sticker-primary"></div>
                    <span class="text-xs font-medium">Loading notes...</span>
                  </div>
                }>
                <Show
                  when={notes().length > 0}
                  fallback={
                    <div class="py-8 flex flex-col items-center text-center p-6 border-2 border-dashed border-gray-100 rounded-2xl bg-white/50">
                      <div class="w-12 h-12 bg-blue-50/50 rounded-full flex items-center justify-center text-blue-200 mb-3">
                        <StickerIcon class="w-6 h-6" />
                      </div>
                      <p class="text-gray-900 font-medium text-sm">
                        No notes yet
                      </p>
                      <p class="text-gray-400 text-xs mt-1 max-w-[180px] leading-relaxed">
                        Click{" "}
                        <span class="text-sticker-primary font-medium">
                          Add Note
                        </span>{" "}
                        to highlight anything on this page.
                      </p>
                    </div>
                  }>
                  <div class="space-y-2.5 pb-4">
                    <For each={notes()}>
                      {(note) => (
                        <div
                          onClick={() => handleViewNote(note.id)}
                          class="group relative bg-white p-3.5 rounded-xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-blue-100/50 transition-all duration-300 animate-slide-in cursor-pointer">
                          <p class="text-sm text-gray-600 leading-relaxed line-clamp-2 pr-6 font-medium">
                            {truncateContent(note.content)}
                          </p>

                          {/* Note Actions - Visible on Hover */}
                          <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNote(note.id);
                              }}
                              class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Note">
                              <TrashIcon class="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
              </Show>
            </div>
          </Show>
        </div>
      </main>

      {/* Footer - Keyboard Shortcuts */}
      <footer class="px-4 py-3 bg-gradient-to-b from-gray-50/50 to-gray-100/50 border-t border-gray-100 select-none">
        <div class="flex justify-between gap-1.5">
          <KeyboardShortcut
            keys={[getModifierKeys().alt, getModifierKeys().shift, "A"]}
            label="Add note"
          />
          <KeyboardShortcut
            keys={[getModifierKeys().alt, getModifierKeys().shift, "V"]}
            label="Toggle"
          />
        </div>
      </footer>
    </div>
  );
};

export default App;
