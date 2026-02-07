import { Button } from "@/components/ui/button";
import { formatRecentTimestamp } from "@/features/recent-files/helpers";
import { useRecentFiles } from "@/features/recent-files/use-recent-files";
import {
    RiFilePdfLine,
    RiFolderOpenLine,
    RiTimeLine,
    RiArrowRightSLine,
} from "@remixicon/react";

export function MainView() {
    const { recentFiles, openFile, openRecent } = useRecentFiles();

    return (
        <div className="relative flex h-full flex-col items-center justify-center">
            {/* Soft radial spotlight */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,var(--color-accent)/15,transparent)]" />

            <div className="relative z-10 flex flex-col items-center gap-10 px-6">
                {/* Logo */}
                <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center justify-center rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-sm">
                        <RiFilePdfLine className="size-10 text-foreground/80" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <h1 className="text-lg font-bold tracking-tight">
                            Fast PDF
                        </h1>
                        <p className="text-[11px] text-muted-foreground">
                            Read, write & modify PDF files
                        </p>
                    </div>
                </div>

                {/* Open File */}
                <div className="flex flex-col items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                    <Button size="lg" onClick={openFile}>
                        <RiFolderOpenLine data-icon="inline-start" />
                        Open File
                    </Button>
                    <kbd className="select-none text-xs text-muted-foreground/60">
                        ⌘O
                    </kbd>
                </div>

                {/* Recent Files */}
                {/* {recentFiles.length > 0 && ( */}
                <div className="w-80 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                    <div className="mb-1.5 flex items-center gap-1.5 px-1">
                        <RiTimeLine className="size-3 text-muted-foreground/50" />
                        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">
                            Recent
                        </span>
                    </div>
                    <div className="flex flex-col rounded-lg border border-border/40 bg-card/30 p-1 max-h-50 justify-center min-h-50">
                        <div className="flex h-full flex-col gap-1 overflow-y-auto pr-1">
                            {recentFiles.length > 0 ? (
                                recentFiles.map((file) => (
                                    <Button
                                        key={file.path}
                                        variant="ghost"
                                        onClick={() => openRecent(file)}
                                        className="group h-auto w-full justify-start gap-3 rounded-md px-2.5 py-2 text-left"
                                    >
                                        <RiFilePdfLine className="size-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover/button:text-foreground/60" />
                                        <div className="flex min-w-0 flex-1 flex-col gap-px">
                                            <span className="truncate text-xs font-medium">
                                                {file.name}
                                            </span>
                                            <span className="truncate text-[10px] leading-tight text-muted-foreground/50">
                                                {file.path}
                                            </span>
                                        </div>
                                        <span className="shrink-0 text-[10px] text-muted-foreground/30">
                                            {formatRecentTimestamp(
                                                file.openedAt
                                            )}
                                        </span>
                                        <RiArrowRightSLine className="size-3 shrink-0 text-muted-foreground/20 opacity-0 transition-opacity group-hover/button:opacity-100" />
                                    </Button>
                                ))
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <p className="text-sm text-muted-foreground">
                                        {/* No recent files */}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* )} */}
            </div>
        </div>
    );
}
