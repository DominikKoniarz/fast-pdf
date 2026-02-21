import { app } from "electron";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { recentFilesSchema } from "../schema";
import type { RecentFile } from "../types";

const RECENT_FILES_FILENAME = "recent-files.json";
const MAX_RECENT_FILES = 20;

function getRecentFilesPath() {
    return path.join(app.getPath("userData"), RECENT_FILES_FILENAME);
}

export async function readRecentFiles(): Promise<RecentFile[]> {
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

async function writeRecentFiles(files: RecentFile[]): Promise<void> {
    const filePath = getRecentFilesPath();
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(files, null, 2), "utf-8");
}

function createRecentFile(filePath: string): RecentFile {
    return {
        path: filePath,
        name: path.basename(filePath),
        openedAt: new Date().toISOString(),
    };
}

export async function addRecentFile(filePath: string): Promise<RecentFile[]> {
    const trimmed = filePath.trim();
    if (!trimmed) {
        return readRecentFiles();
    }

    if (!path.extname(trimmed).toLowerCase().endsWith(".pdf")) {
        return readRecentFiles();
    }

    const normalized = path.normalize(trimmed);
    const existing = await readRecentFiles();

    const filtered = existing
        .filter((file) => path.normalize(file.path) !== normalized)
        .filter((file) =>
            path.extname(file.path).toLowerCase().endsWith(".pdf"),
        );

    const next = [createRecentFile(trimmed), ...filtered].slice(
        0,
        MAX_RECENT_FILES,
    );

    await writeRecentFiles(next);

    return next;
}
