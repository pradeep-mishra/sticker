# Super Sticker

A browser extension that lets you attach sticky notes to any element on any webpage. Notes persist and reappear when you revisit the page.

## Features

- **Attach Notes to Elements** — Click "Add Note" button in extension popup and then click any element on a webpage to add a sticky note
- **See All Notes in the page** — Click "Show Notes" button in extension popup
- **Smart Positioning** — Notes automatically position themselves to avoid viewport edges
- **Glassmorphism Design** — Beautiful frosted glass aesthetic
- **Persistent Storage** — Notes are saved and restored when you revisit pages
- **Orphan Notes Panel** — Notes for removed elements can be accessed from a collapsible panel
- **Keyboard Shortcuts** — Quick access without touching the mouse
- **Cross-Browser Support** — Works on Chrome, Brave, Edge, and Firefox

## How It Works

1. Click the extension icon and select "Add Note"
2. Hover over any element — it highlights with a dashed border
3. Click the element to attach a note
4. Type your note and save
5. Continue adding notes or click "Done Adding" to exit

## ⌨️ Keyboard Shortcuts

| Shortcut          | Action                               |
| ----------------- | ------------------------------------ |
| `Alt + Shift + A` | Enter Add Note mode                  |
| `Alt + Shift + V` | Toggle note visibility               |
| `Escape`          | Exit selection mode / Cancel editing |

## Installation

### From Source

1. Clone the repository:

   ```bash
   git clone https://github.com/pradeep-mishra/sticker.git
   cd sticker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:

   ```bash
   # For Chrome/Brave/Edge
   npm build

   # For Firefox
   npm build:firefox
   ```

4. Load the extension in your browser:

   **Chrome/Brave/Edge:**
   - Open `chrome://extensions/` (or `brave://extensions/`, `edge://extensions/`)
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `.output/chrome-mv3` folder

   **Firefox:**
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select any file in `.output/firefox-mv2` folder

## Development

Start the development server with hot reload:

```bash
# Chrome (default)
npm run dev

# Firefox
npm run dev:firefox
```

### Available Scripts

| Command                 | Description                      |
| ----------------------- | -------------------------------- |
| `npm run dev`           | Start dev server (Chrome)        |
| `npm run dev:firefox`   | Start dev server (Firefox)       |
| `npm run build`         | Production build (Chrome)        |
| `npm run build:firefox` | Production build (Firefox)       |
| `npm run zip`           | Create store-ready zip (Chrome)  |
| `npm run zip:firefox`   | Create store-ready zip (Firefox) |
| `npm run lint`          | Run ESLint                       |
| `npm run format`        | Format with Prettier             |
| `npm run typecheck`     | TypeScript type check            |

## Project Structure

```
├── src/
│   ├── entrypoints/
│   │   ├── popup/           # Extension popup UI
│   │   ├── background.ts    # Service worker
│   │   ├── content.tsx      # Content script (renders notes)
│   │   └── content/         # Content script components
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities (storage, positioning, selectors)
│   └── types/               # TypeScript definitions
├── public/                  # Static assets (icons)
└── wxt.config.ts           # WXT configuration
```

## 🌐 Browser Compatibility

| Browser | Engine   | Status       |
| ------- | -------- | ------------ |
| Chrome  | Chromium | ✅ Supported |
| Brave   | Chromium | ✅ Supported |
| Edge    | Chromium | ✅ Supported |
| Firefox | Gecko    | ✅ Supported |

## License

This project is licensed under the [MIT License](LICENSE).

© 2025 [Pradeep Mishra](https://github.com/pradeep-mishra)
