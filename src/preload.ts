import { contextBridge, ipcRenderer } from "electron";

/**
 * Expose fastPdf API to the Renderer process
 */
contextBridge.exposeInMainWorld("fastPdf", {
    openFileDialog: () => ipcRenderer.invoke("open-file-dialog"),
    getRecentFiles: () => ipcRenderer.invoke("get-recent-files"),
    addRecentFile: (filePath: string) =>
        ipcRenderer.invoke("add-recent-file", filePath),
});
