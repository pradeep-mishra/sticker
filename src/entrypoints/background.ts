import { getNoteCount } from "@/lib/storage";
import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";

export default defineBackground({
  main() {
    // Update badge when tab changes
    browser.tabs.onActivated.addListener(async (activeInfo) => {
      await updateBadgeForTab(activeInfo.tabId);
    });

    // Update badge when tab URL changes
    browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete" && tab.url) {
        await updateBadgeForTab(tabId);
      }
    });

    // Handle keyboard shortcuts
    browser.commands.onCommand.addListener(async (command) => {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true
      });

      if (!tab?.id) return;

      switch (command) {
        case "add-note":
          await browser.tabs.sendMessage(tab.id, {
            type: "START_SELECTION_MODE"
          });
          break;
        case "toggle-visibility":
          await browser.tabs.sendMessage(tab.id, { type: "TOGGLE_VISIBILITY" });
          break;
      }
    });

    // Handle messages from popup/content scripts
    browser.runtime.onMessage.addListener((message: any, sender: any) => {
      if (message.type === "UPDATE_BADGE") {
        const tabId = message.tabId ?? sender.tab?.id;
        if (tabId) {
          setBadgeCount(tabId, message.count);
        }
      }
      // Don't return true - no async response needed
    });
  }
});

async function updateBadgeForTab(tabId: number): Promise<void> {
  try {
    const tab = await browser.tabs.get(tabId);
    if (
      tab.url &&
      !tab.url.startsWith("chrome://") &&
      !tab.url.startsWith("about:")
    ) {
      const count = await getNoteCount(tab.url);
      await setBadgeCount(tabId, count);
    } else {
      // Clear badge for browser pages
      await browser.action.setBadgeText({ text: "", tabId });
    }
  } catch (error) {
    console.error("Failed to update badge:", error);
  }
}

async function setBadgeCount(tabId: number, count: number): Promise<void> {
  const text = count > 0 ? count.toString() : "";
  await browser.action.setBadgeText({ text, tabId });
  await browser.action.setBadgeBackgroundColor({ color: "#3B82F6", tabId });
}
