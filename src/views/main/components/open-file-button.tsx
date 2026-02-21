import { Button } from "@/components/ui/button";
import { RiFolderOpenLine } from "@remixicon/react";

type OpenFileButtonProps = {
    onOpenFile: () => void;
};

export function OpenFileButton({ onOpenFile }: OpenFileButtonProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col items-center gap-1.5 delay-100 duration-500">
            <Button size="lg" onClick={onOpenFile}>
                <RiFolderOpenLine data-icon="inline-start" />
                Open File
            </Button>
            <kbd className="text-muted-foreground/60 text-xs select-none">
                ⌘O
            </kbd>
        </div>
    );
}
