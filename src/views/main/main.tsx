import { useRecentFiles } from "@/features/recent-files/hooks/use-recent-files";
import { AppLogo } from "@/views/main/components/app-logo";
import { OpenFileButton } from "./components/open-file-button";
import { RecentFilesList } from "./components/recent-files-list";

export function MainView() {
    const { recentFiles, openFile, openRecent } = useRecentFiles();

    return (
        <div className="relative flex h-full flex-col items-center justify-center">
            {/* Soft radial spotlight */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,var(--color-accent)/15,transparent)]" />

            <div className="relative z-10 flex flex-col items-center gap-10 px-6">
                <AppLogo />
                <OpenFileButton onOpenFile={() => openFile()} />
                <RecentFilesList
                    recentFiles={recentFiles}
                    onOpenRecent={openRecent}
                />
            </div>
        </div>
    );
}
