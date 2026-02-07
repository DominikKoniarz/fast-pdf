import path from "path";
import { createServer, type Server } from "http";
import { mkdir, readFile, writeFile } from "fs/promises";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import type { OpenDialogOptions } from "electron";
import { z } from "zod";
import { findAvailablePort } from "./main-helpers";

const PREFERRED_PORT = 4000;

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
// The built directory structure
//
// ├─┬ dist
// │ ├─┬ electron
// │ │ ├── main.js
// │ │ └── preload.js
// │ ├── index.html
// │ ├── ...other-static-files-from-public
// │
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

const RECENT_FILES_FILENAME = "recent-files.json";

const recentFileSchema = z.object({
    path: z.string(),
    name: z.string(),
    openedAt: z.string(),
});

const recentFilesSchema = z.array(recentFileSchema);

type RecentFileRecord = z.infer<typeof recentFileSchema>;

function getRecentFilesPath() {
    return path.join(app.getPath("userData"), RECENT_FILES_FILENAME);
}

async function readRecentFiles(): Promise<RecentFileRecord[]> {
    const filePath = getRecentFilesPath();

    try {
        const raw = await readFile(filePath, "utf-8");
        const parsed = JSON.parse(raw);
        const parsedResult = recentFilesSchema.safeParse(parsed);
        if (!parsedResult.success) {
            return [];
        }

        return parsedResult.data;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return [];
        }

        throw error;
    }
}

async function writeRecentFiles(files: RecentFileRecord[]): Promise<void> {
    const filePath = getRecentFilesPath();
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(files, null, 2), "utf-8");
}

function createRecentFile(filePath: string): RecentFileRecord {
    return {
        path: filePath,
        name: path.basename(filePath),
        openedAt: new Date().toISOString(),
    };
}

async function addRecentFile(filePath: string): Promise<RecentFileRecord[]> {
    const trimmed = filePath.trim();
    if (!trimmed) {
        return readRecentFiles();
    }

    const normalized = path.normalize(trimmed);
    const existing = await readRecentFiles();

    const filtered = existing.filter(
        (file) => path.normalize(file.path) !== normalized
    );

    const next = [createRecentFile(trimmed), ...filtered];

    await writeRecentFiles(next);
    return next;
}

ipcMain.handle("open-file-dialog", async () => {
    const browserWindow = BrowserWindow.getFocusedWindow() ?? win ?? null;
    const options: OpenDialogOptions = {
        properties: ["openFile"],
        filters: [
            { name: "PDF Files", extensions: ["pdf"] },
            { name: "All Files", extensions: ["*"] },
        ],
    };
    const result = browserWindow
        ? await dialog.showOpenDialog(browserWindow, options)
        : await dialog.showOpenDialog(options);

    if (result.canceled || result.filePaths.length === 0) {
        return null;
    }

    return result.filePaths[0];
});

ipcMain.handle("get-recent-files", async () => readRecentFiles());

ipcMain.handle("add-recent-file", async (_event, filePath: string) =>
    addRecentFile(filePath)
);

async function startStaticServer(): Promise<string> {
    if (staticServer) {
        const address = staticServer.address();
        if (address && typeof address === "object") {
            return `http://127.0.0.1:${address.port}`;
        }
    }

    const port = await findAvailablePort(PREFERRED_PORT);
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
                mimeTypes[ext] ?? "application/octet-stream"
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
            new Date().toLocaleString()
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
    staticServer?.close();
    staticServer = null;
});

app.whenReady().then(createWindow);
