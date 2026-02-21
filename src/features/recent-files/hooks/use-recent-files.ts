import type { RecentFile } from "@/features/recent-files/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const RECENT_FILES_QUERY_KEY = ["recent-files"] as const;

export function useRecentFiles() {
    const queryClient = useQueryClient();

    const { data: recentFiles = [] } = useQuery({
        queryKey: RECENT_FILES_QUERY_KEY,
        queryFn: () => window.fastPdf.getRecentFiles(),
    });

    const { mutate: openFile } = useMutation({
        mutationFn: async () => {
            const selectedPath = await window.fastPdf.openFileDialog();

            if (!selectedPath) return null;

            return window.fastPdf.addRecentFile(selectedPath);
        },
        onSuccess: (data) => {
            if (data) {
                queryClient.setQueryData(RECENT_FILES_QUERY_KEY, data);
            }
        },
    });

    const { mutate: openRecent } = useMutation({
        mutationFn: (file: RecentFile) =>
            window.fastPdf.addRecentFile(file.path),
        onSuccess: (data) => {
            queryClient.setQueryData(RECENT_FILES_QUERY_KEY, data);
        },
    });

    return {
        recentFiles,
        openFile,
        openRecent,
    };
}
