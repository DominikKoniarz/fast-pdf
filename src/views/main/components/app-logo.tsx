import { RiFilePdfLine } from "@remixicon/react";

export function AppLogo() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col items-center gap-4 duration-500">
            <div className="border-border/60 bg-card/60 flex items-center justify-center rounded-2xl border p-5 shadow-sm backdrop-blur-sm">
                <RiFilePdfLine className="text-foreground/80 size-10" />
            </div>
            <div className="flex flex-col items-center gap-1">
                <h1 className="text-lg font-bold tracking-tight">Fast PDF</h1>
                <p className="text-muted-foreground text-[11px]">
                    Read, write & modify PDF files
                </p>
            </div>
        </div>
    );
}
