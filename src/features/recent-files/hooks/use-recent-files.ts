import type { RecentFile } from "@/features/recent-files/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const RECENT_FILES_QUERY_KEY = ["recent-files"] as const;

export function useRecentFiles() {
    const queryClient = useQueryClient();

    const { data: recentFiles = [] } = useQuery({
        queryKey: RECENT_FILES_QUERY_KEY,
        queryFn: () => window.fastPdf.getRecentFiles(),
    });

    const openFileMutation = useMutation({
        mutationFn: async () => {
            const selectedPath = await window.fastPdf.openFileDialog();

            if (!selectedPath) {
                return null;
            }

            const openSessionResult = await window.fastPdf.openPdfSession({
                filePath: selectedPath,
            });
            if (!openSessionResult.ok) {
                throw new Error(openSessionResult.error.message);
            }

            const updatedRecentFiles = await window.fastPdf.addRecentFile(selectedPath);

            return {
                sessionId: openSessionResult.sessionId,
                updatedRecentFiles,
            };
        },
        onSuccess: (data) => {
            if (data) {
                queryClient.setQueryData(
                    RECENT_FILES_QUERY_KEY,
                    data.updatedRecentFiles,
                );
            }
        },
    });

    const openRecentMutation = useMutation({
        mutationFn: async (file: RecentFile) => {
            const openSessionResult = await window.fastPdf.openPdfSession({
                filePath: file.path,
            });
            if (!openSessionResult.ok) {
                throw new Error(openSessionResult.error.message);
            }

            return {
                sessionId: openSessionResult.sessionId,
                updatedRecentFiles: await window.fastPdf.addRecentFile(file.path),
            };
        },
        onSuccess: (data) => {
            queryClient.setQueryData(RECENT_FILES_QUERY_KEY, data.updatedRecentFiles);
        },
    });

    const openFile = async () => {
        const result = await openFileMutation.mutateAsync();
        return result?.sessionId ?? null;
    };

    const openRecent = async (file: RecentFile) => {
        const result = await openRecentMutation.mutateAsync(file);
        return result.sessionId;
    };

    return {
        recentFiles,
        openFile,
        openRecent,
    };
}
