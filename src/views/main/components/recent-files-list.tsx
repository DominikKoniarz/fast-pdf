import { Button } from "@/components/ui/button";
import { formatRecentTimestamp } from "@/features/recent-files/services/format-recent-timestamp";
import type { RecentFile } from "@/features/recent-files/types";
import { RiArrowRightSLine, RiFilePdfLine, RiTimeLine } from "@remixicon/react";

type RecentFilesListProps = {
    recentFiles: RecentFile[];
    onOpenRecent: (file: RecentFile) => Promise<void>;
};

export function RecentFilesList({
    recentFiles,
    onOpenRecent,
}: RecentFilesListProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 w-80 delay-200 duration-500">
            <div className="mb-1.5 flex items-center gap-1.5 px-1">
                <RiTimeLine className="text-muted-foreground/50 size-3" />
                <span className="text-muted-foreground/50 text-[10px] font-medium tracking-widest uppercase">
                    Recent
                </span>
            </div>
            <div className="border-border/40 bg-card/30 flex max-h-50 min-h-50 flex-col justify-center rounded-lg border p-1">
                <div className="flex h-full flex-col gap-1 overflow-y-auto pr-1">
                    {recentFiles.length > 0 ? (
                        recentFiles.map((file) => (
                            <Button
                                key={file.path}
                                variant="ghost"
                                onClick={() => {
                                    void onOpenRecent(file);
                                }}
                                className="group h-auto w-full justify-start gap-3 rounded-md px-2.5 py-2 text-left"
                            >
                                <RiFilePdfLine className="text-muted-foreground/40 group-hover/button:text-foreground/60 size-3.5 shrink-0 transition-colors" />
                                <div className="flex min-w-0 flex-1 flex-col gap-px">
                                    <span className="truncate text-xs font-medium">
                                        {file.name}
                                    </span>
                                    <span className="text-muted-foreground/50 truncate text-[10px] leading-tight">
                                        {file.path}
                                    </span>
                                </div>
                                <span className="text-muted-foreground/30 shrink-0 text-[10px]">
                                    {formatRecentTimestamp(file.openedAt)}
                                </span>
                                <RiArrowRightSLine className="text-muted-foreground/20 size-3 shrink-0 opacity-0 transition-opacity group-hover/button:opacity-100" />
                            </Button>
                        ))
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-muted-foreground text-sm">
                                No recent files
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
