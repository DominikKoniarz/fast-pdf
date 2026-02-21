import type { RecentFile } from "@/features/recent-files/types";
import { useRecentFiles } from "@/features/recent-files/hooks/use-recent-files";
import { useNavigate } from "@tanstack/react-router";
import { AppLogo } from "@/views/main/components/app-logo";
import { OpenFileButton } from "./components/open-file-button";
import { RecentFilesList } from "./components/recent-files-list";

export function MainView() {
    const navigate = useNavigate();
    const { recentFiles, openFile, openRecent } = useRecentFiles();

    const handleOpenFile = async () => {
        const sessionId = await openFile();
        if (!sessionId) {
            return;
        }

        await navigate({
            to: "/pdf-page",
            search: {
                sessionId,
            },
        });
    };

    const handleOpenRecent = async (file: RecentFile) => {
        const sessionId = await openRecent(file);
        await navigate({
            to: "/pdf-page",
            search: {
                sessionId,
            },
        });
    };

    return (
        <div className="relative flex h-full flex-col items-center justify-center">
            {/* Soft radial spotlight */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,var(--color-accent)/15,transparent)]" />

            <div className="relative z-10 flex flex-col items-center gap-10 px-6">
                <AppLogo />
                <OpenFileButton onOpenFile={handleOpenFile} />
                <RecentFilesList
                    recentFiles={recentFiles}
                    onOpenRecent={handleOpenRecent}
                />
            </div>
        </div>
    );
}
