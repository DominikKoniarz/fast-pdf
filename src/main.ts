import {
    closePdfSessionRequestSchema,
    closePdfSessionResultSchema,
    getPdfSessionRequestSchema,
    getPdfSessionResultSchema,
    getPdfPageRequestSchema,
    getPdfPageResultSchema,
    openPdfSessionRequestSchema,
    openPdfSessionResultSchema,
} from "@/features/pdf-page/schema";
import {
    loadPdfFromFile,
    readPdfPageContent,
    toPdfIpcErrorResult,
} from "@/features/pdf-page/services/pdf-page-reader";
import {
    clearPdfSessions,
    closePdfSession as closeStoredPdfSession,
    createPdfSession,
    getPdfSession,
    touchPdfSession,
} from "@/features/pdf-page/services/pdf-session-store";
import {
    addRecentFile,
    readRecentFiles,
} from "@/features/recent-files/services/recent-files-storage";
import { findAvailablePort } from "@/lib/electron";
import { ipcChannels } from "@/lib/ipc-channels";
import type { OpenDialogOptions } from "electron";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { readFile } from "fs/promises";
import { createServer, type Server } from "http";
import path from "path";

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
    ? process.env.DIST
    : path.join(process.env.DIST, "../public");

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

let win: BrowserWindow | null;
let staticServer: Server | null = null;

const mimeTypes: Record<string, string> = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".json": "application/json",
    ".map": "application/json",
    ".txt": "text/plain",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
};

function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}

ipcMain.handle(ipcChannels.openFileDialog, async () => {
    const browserWindow = BrowserWindow.getFocusedWindow() ?? win ?? null;
    const options: OpenDialogOptions = {
        properties: ["openFile"],
        filters: [{ name: "PDF Files", extensions: ["pdf"] }],
    };
    const result = browserWindow
        ? await dialog.showOpenDialog(browserWindow, options)
        : await dialog.showOpenDialog(options);

    if (result.canceled || result.filePaths.length === 0) {
        return null;
    }

    return result.filePaths[0];
});

ipcMain.handle(ipcChannels.getRecentFiles, async () => readRecentFiles());

ipcMain.handle(ipcChannels.addRecentFile, async (_event, filePath: string) =>
    addRecentFile(filePath),
);

ipcMain.handle(ipcChannels.openPdfSession, async (_event, payload: unknown) => {
    const parsedRequest = openPdfSessionRequestSchema.safeParse(payload);
    if (!parsedRequest.success) {
        return toPdfIpcErrorResult(
            "INVALID_OPEN_PDF_SESSION_REQUEST",
            "Invalid openPdfSession request payload",
        );
    }

    try {
        const loaded = await loadPdfFromFile(parsedRequest.data.filePath);
        const sessionId = createPdfSession({
            document: loaded.document,
            originalBytes: loaded.originalBytes,
            pdf: loaded.pdf,
        });

        return openPdfSessionResultSchema.parse({
            ok: true,
            sessionId,
            document: loaded.document,
        });
    } catch (error) {
        return toPdfIpcErrorResult(
            "OPEN_PDF_SESSION_FAILED",
            getErrorMessage(error, "Failed to open PDF session"),
        );
    }
});

ipcMain.handle(ipcChannels.getPdfSession, async (_event, payload: unknown) => {
    const parsedRequest = getPdfSessionRequestSchema.safeParse(payload);
    if (!parsedRequest.success) {
        return toPdfIpcErrorResult(
            "INVALID_GET_PDF_SESSION_REQUEST",
            "Invalid getPdfSession request payload",
        );
    }

    const session = getPdfSession(parsedRequest.data.sessionId);
    if (!session) {
        return toPdfIpcErrorResult(
            "PDF_SESSION_NOT_FOUND",
            "PDF session not found",
        );
    }

    touchPdfSession(parsedRequest.data.sessionId);

    return getPdfSessionResultSchema.parse({
        ok: true,
        sessionId: parsedRequest.data.sessionId,
        document: session.document,
    });
});

ipcMain.handle(ipcChannels.getPdfPage, async (_event, payload: unknown) => {
    const parsedRequest = getPdfPageRequestSchema.safeParse(payload);
    if (!parsedRequest.success) {
        return toPdfIpcErrorResult(
            "INVALID_GET_PDF_PAGE_REQUEST",
            "Invalid getPdfPage request payload",
        );
    }

    const session = getPdfSession(parsedRequest.data.sessionId);
    if (!session) {
        return toPdfIpcErrorResult(
            "PDF_SESSION_NOT_FOUND",
            "PDF session not found",
        );
    }

    try {
        const page = readPdfPageContent(session.pdf, parsedRequest.data.pageIndex);
        touchPdfSession(parsedRequest.data.sessionId);

        return getPdfPageResultSchema.parse({
            ok: true,
            page,
        });
    } catch (error) {
        return toPdfIpcErrorResult(
            "GET_PDF_PAGE_FAILED",
            getErrorMessage(error, "Failed to read PDF page"),
        );
    }
});

ipcMain.handle(
    ipcChannels.closePdfSession,
    async (_event, payload: unknown) => {
        const parsedRequest = closePdfSessionRequestSchema.safeParse(payload);
        if (!parsedRequest.success) {
            return toPdfIpcErrorResult(
                "INVALID_CLOSE_PDF_SESSION_REQUEST",
                "Invalid closePdfSession request payload",
            );
        }

        const closed = closeStoredPdfSession(parsedRequest.data.sessionId);
        if (!closed) {
            return toPdfIpcErrorResult(
                "PDF_SESSION_NOT_FOUND",
                "PDF session not found",
            );
        }

        return closePdfSessionResultSchema.parse({
            ok: true,
        });
    },
);

async function startStaticServer(): Promise<string> {
    if (staticServer) {
        const address = staticServer.address();
        if (address && typeof address === "object") {
            return `http://127.0.0.1:${address.port}`;
        }
    }

    const port = await findAvailablePort();
    const root = process.env.DIST!;

    staticServer = createServer(async (req, res) => {
        if (!req.url) {
            res.statusCode = 400;
            res.end();
            return;
        }

        const requestUrl = new URL(req.url, "http://127.0.0.1");
        let pathname = decodeURIComponent(requestUrl.pathname);
        if (pathname === "/") {
            pathname = "/index.html";
        }

        const requestedPath = path.normalize(path.join(root, pathname));
        if (!requestedPath.startsWith(root)) {
            res.statusCode = 403;
            res.end();
            return;
        }

        try {
            const data = await readFile(requestedPath);
            const ext = path.extname(requestedPath).toLowerCase();
            res.setHeader(
                "Content-Type",
                mimeTypes[ext] ?? "application/octet-stream",
            );
            res.end(data);
        } catch {
            try {
                const indexPath = path.join(root, "index.html");
                const html = await readFile(indexPath);
                res.setHeader("Content-Type", "text/html");
                res.end(html);
            } catch {
                res.statusCode = 404;
                res.end("Not found");
            }
        }
    });

    await new Promise<void>((resolve) => {
        staticServer!.listen(port, "127.0.0.1", () => resolve());
    });

    return `http://127.0.0.1:${port}`;
}

async function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC!, "logo.svg"),
        webPreferences: {
            preload: path.join(__dirname, "./preload.js"),
        },
    });

    // Test active push message to Renderer-process.
    win.webContents.on("did-finish-load", () => {
        win?.webContents.send(
            "main-process-message",
            new Date().toLocaleString(),
        );
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        win.webContents.openDevTools();
        hotReloadPreload(win);
    } else {
        win.maximize();
    }

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        const serverUrl = await startStaticServer();
        win.loadURL(serverUrl);
    }
}

function hotReloadPreload(win: BrowserWindow) {
    process.on("message", (msg) => {
        console.log("[electron/main]:", msg);

        if (msg === "electron-vite&type=hot-reload") {
            win.webContents.reload();
        }
    });
}

app.on("window-all-closed", () => {
    app.quit();
    win = null;
});

app.on("before-quit", () => {
    clearPdfSessions();
    staticServer?.close();
    staticServer = null;
});

app.whenReady().then(createWindow);
