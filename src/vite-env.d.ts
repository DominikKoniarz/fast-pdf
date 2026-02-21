/// <reference types="vite/client" />

import type { RecentFile } from "@/features/recent-files/types";
import type {
    ClosePdfSessionRequest,
    ClosePdfSessionResult,
    GetPdfSessionRequest,
    GetPdfSessionResult,
    GetPdfPageRequest,
    GetPdfPageResult,
    OpenPdfSessionRequest,
    OpenPdfSessionResult,
} from "@/features/pdf-page/types";

interface ImportMetaEnv {
    readonly VITE_SERVER_URL?: string;
    readonly VITE_APP_MODE?: "1" | "2" | "3" | "4";
}

// Extend ImportMeta to include env property
/* eslint-disable-next-line */
interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare global {
    // Global constants defined in vite.config.mts
    const __APP_VERSION__: string;

    interface Window {
        fastPdf: {
            openFileDialog: () => Promise<string | null>;
            getRecentFiles: () => Promise<RecentFile[]>;
            addRecentFile: (filePath: string) => Promise<RecentFile[]>;
            openPdfSession: (
                payload: OpenPdfSessionRequest,
            ) => Promise<OpenPdfSessionResult>;
            getPdfSession: (
                payload: GetPdfSessionRequest,
            ) => Promise<GetPdfSessionResult>;
            getPdfPage: (payload: GetPdfPageRequest) => Promise<GetPdfPageResult>;
            closePdfSession: (
                payload: ClosePdfSessionRequest,
            ) => Promise<ClosePdfSessionResult>;
        };
    }
}

export {};
