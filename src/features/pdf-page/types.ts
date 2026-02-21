import type { z } from "zod";
import type {
    closePdfSessionRequestSchema,
    closePdfSessionResultSchema,
    getPdfSessionRequestSchema,
    getPdfSessionResultSchema,
    getPdfPageRequestSchema,
    getPdfPageResultSchema,
    openPdfFileDialogResultSchema,
    openPdfSessionRequestSchema,
    openPdfSessionResultSchema,
    pdfDocumentSummarySchema,
    pdfIpcErrorResultSchema,
    pdfIpcErrorSchema,
    pdfPageContentSchema,
    savePdfSessionModeSchema,
    savePdfSessionRequestSchema,
    savePdfSessionResultSchema,
} from "./schema";

export type PdfIpcError = z.infer<typeof pdfIpcErrorSchema>;
export type PdfIpcErrorResult = z.infer<typeof pdfIpcErrorResultSchema>;

export type PdfDocumentSummary = z.infer<typeof pdfDocumentSummarySchema>;
export type PdfPageContent = z.infer<typeof pdfPageContentSchema>;

export type OpenPdfFileDialogResult = z.infer<typeof openPdfFileDialogResultSchema>;

export type OpenPdfSessionRequest = z.infer<typeof openPdfSessionRequestSchema>;
export type OpenPdfSessionResult = z.infer<typeof openPdfSessionResultSchema>;

export type GetPdfPageRequest = z.infer<typeof getPdfPageRequestSchema>;
export type GetPdfPageResult = z.infer<typeof getPdfPageResultSchema>;

export type GetPdfSessionRequest = z.infer<typeof getPdfSessionRequestSchema>;
export type GetPdfSessionResult = z.infer<typeof getPdfSessionResultSchema>;

export type ClosePdfSessionRequest = z.infer<typeof closePdfSessionRequestSchema>;
export type ClosePdfSessionResult = z.infer<typeof closePdfSessionResultSchema>;

export type SavePdfSessionMode = z.infer<typeof savePdfSessionModeSchema>;
export type SavePdfSessionRequest = z.infer<typeof savePdfSessionRequestSchema>;
export type SavePdfSessionResult = z.infer<typeof savePdfSessionResultSchema>;
