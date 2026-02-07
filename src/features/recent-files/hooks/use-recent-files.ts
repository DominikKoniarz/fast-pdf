import type { RecentFile } from "@/features/recent-files/types";
import { useCallback, useEffect, useState } from "react";

export function useRecentFiles() {
    const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);

    const loadRecentFiles = useCallback(async () => {
        const files = await window.fastPdf.getRecentFiles();
        setRecentFiles(files);
    }, []);

    useEffect(() => {
        let isActive = true;

        const load = async () => {
            const files = await window.fastPdf.getRecentFiles();
            if (isActive) {
                setRecentFiles(files);
            }
        };

        load();

        return () => {
            isActive = false;
        };
    }, []);

    const openFile = useCallback(async () => {
        const selectedPath = await window.fastPdf.openFileDialog();

        if (!selectedPath) {
            return;
        }

        const nextFiles = await window.fastPdf.addRecentFile(selectedPath);

        setRecentFiles(nextFiles);
    }, []);

    const openRecent = useCallback(async (file: RecentFile) => {
        const nextFiles = await window.fastPdf.addRecentFile(file.path);

        setRecentFiles(nextFiles);
    }, []);

    return {
        recentFiles,
        loadRecentFiles,
        openFile,
        openRecent,
    };
}
