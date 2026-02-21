export const ipcChannels = {
    openFileDialog: "open-file-dialog",
    getRecentFiles: "get-recent-files",
    addRecentFile: "add-recent-file",
    openPdfSession: "open-pdf-session",
    getPdfSession: "get-pdf-session",
    getPdfPage: "get-pdf-page",
    closePdfSession: "close-pdf-session",
    savePdfSession: "save-pdf-session",
} as const;

export type PdfPageIpcChannel =
    (typeof ipcChannels)[keyof Pick<
        typeof ipcChannels,
        | "openPdfSession"
        | "getPdfSession"
        | "getPdfPage"
        | "closePdfSession"
        | "savePdfSession"
    >];
