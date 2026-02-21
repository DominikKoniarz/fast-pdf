import { contextBridge, ipcRenderer } from "electron";
import { ipcChannels } from "./lib/ipc-channels";

/**
 * Expose fastPdf API to the Renderer process
 */
contextBridge.exposeInMainWorld("fastPdf", {
    openFileDialog: () => ipcRenderer.invoke(ipcChannels.openFileDialog),
    getRecentFiles: () => ipcRenderer.invoke(ipcChannels.getRecentFiles),
    addRecentFile: (filePath: string) =>
        ipcRenderer.invoke(ipcChannels.addRecentFile, filePath),
    openPdfSession: (payload: { filePath: string }) =>
        ipcRenderer.invoke(ipcChannels.openPdfSession, payload),
    getPdfSession: (payload: { sessionId: string }) =>
        ipcRenderer.invoke(ipcChannels.getPdfSession, payload),
    getPdfPage: (payload: { sessionId: string; pageIndex: number }) =>
        ipcRenderer.invoke(ipcChannels.getPdfPage, payload),
    closePdfSession: (payload: { sessionId: string }) =>
        ipcRenderer.invoke(ipcChannels.closePdfSession, payload),
});
