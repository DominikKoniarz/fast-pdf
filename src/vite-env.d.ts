/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SERVER_URL?: string;
    readonly VITE_APP_MODE?: "1" | "2" | "3" | "4";
}

// Extend ImportMeta to include env property
interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// Global constants defined in vite.config.mts
declare const __APP_VERSION__: string;

declare global {
    interface Window {
        fastPdf: {
            openFileDialog: () => Promise<string | null>;
            getRecentFiles: () => Promise<
                Array<{
                    path: string;
                    name: string;
                    openedAt: string;
                }>
            >;
            addRecentFile: (
                filePath: string
            ) => Promise<
                Array<{
                    path: string;
                    name: string;
                    openedAt: string;
                }>
            >;
        };
    }
}

export {};
