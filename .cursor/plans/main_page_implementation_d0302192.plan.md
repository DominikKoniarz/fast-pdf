---
name: Main Page Implementation
overview: Implement the main page with a desktop-native look, including a logo, open file button, and recent files list using Electron IPC and Tanstack Router.
todos:
    - id: setup-router
      content: Setup Tanstack Router (Root & Index routes)
      status: pending
    - id: todo-1770403306966-5cx93bfz1
      content: Build Main Page UI (Logo, Button, Recent List)
      status: pending
    - id: implement-ipc
      content: Implement IPC handlers in main.ts and preload.ts
      status: pending
    - id: connect-logic
      content: Connect UI to IPC and verify persistence
      status: pending
isProject: false
---

# Main Page Implementation Plan

## Phase 1: Routing Setup

- Create `src/routes` directory.
- Create `src/routes/__root.tsx` for the root layout (Tanstack Router).
- Create `src/routes/index.tsx` for the Main Page.
- Update `src/app.tsx` to initialize and render the `RouterProvider`.
- Ensure strict desktop styling (no default scrollbars, fixed layout).

## Phase 2: Frontend Implementation

- Implement `src/routes/index.tsx`:
    - **Logo**: Placeholder SVG/Icon centered.
    - **Action**: "Open File" button using `shadcn/ui` Button.
    - **Recent List**: Clean list of recent files (reading from IPC).
        - Show filename and path.
        - Click to open.
- Use `@remixicon/react` for icons.
- Styling: Centered layout, "empty state" feel but functional.

## Phase 3: Backend Logic (IPC & Persistence)

- Update `src/main.ts` to handle IPC events:
    - `open-file-dialog`: trigger `dialog.showOpenDialog`.
    - `get-recent-files`: read from a local JSON file in `userData`.
    - `add-recent-file`: update the JSON file.
- Update `src/preload.ts` to expose these methods via `contextBridge` (or use `ipcRenderer.invoke`).

## Phase 4: Integration

- Connect "Open File" button to IPC.
- On file selection, add to recent files and (placeholder) log the path.
- Load recent files on mount.
