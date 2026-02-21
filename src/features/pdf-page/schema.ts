import { z } from "zod/mini";

export const pdfIpcErrorSchema = z.object({
    code: z.string(),
    message: z.string(),
});

export const pdfIpcErrorResultSchema = z.object({
    ok: z.literal(false),
    error: pdfIpcErrorSchema,
});

export const pdfDocumentSummarySchema = z.object({
    filePath: z.string(),
    fileName: z.string(),
    pdfVersion: z.string(),
    pageCount: z.number(),
});

export const pdfPageContentSchema = z.object({
    pageIndex: z.number(),
    textBlocks: z.array(z.string()),
});

export const openPdfFileDialogResultSchema = z.union([z.string(), z.null()]);

export const openPdfSessionRequestSchema = z.object({
    filePath: z.string(),
});

export const openPdfSessionSuccessSchema = z.object({
    ok: z.literal(true),
    sessionId: z.string(),
    document: pdfDocumentSummarySchema,
});

export const openPdfSessionResultSchema = z.union([
    openPdfSessionSuccessSchema,
    pdfIpcErrorResultSchema,
]);

export const getPdfPageRequestSchema = z.object({
    sessionId: z.string(),
    pageIndex: z.number(),
});

export const getPdfPageSuccessSchema = z.object({
    ok: z.literal(true),
    page: pdfPageContentSchema,
});

export const getPdfPageResultSchema = z.union([
    getPdfPageSuccessSchema,
    pdfIpcErrorResultSchema,
]);

export const getPdfSessionRequestSchema = z.object({
    sessionId: z.string(),
});

export const getPdfSessionSuccessSchema = z.object({
    ok: z.literal(true),
    sessionId: z.string(),
    document: pdfDocumentSummarySchema,
});

export const getPdfSessionResultSchema = z.union([
    getPdfSessionSuccessSchema,
    pdfIpcErrorResultSchema,
]);

export const closePdfSessionRequestSchema = z.object({
    sessionId: z.string(),
});

export const closePdfSessionSuccessSchema = z.object({
    ok: z.literal(true),
});

export const closePdfSessionResultSchema = z.union([
    closePdfSessionSuccessSchema,
    pdfIpcErrorResultSchema,
]);

export const savePdfSessionModeSchema = z.union([
    z.literal("incremental"),
    z.literal("full"),
]);

export const savePdfSessionRequestSchema = z.object({
    sessionId: z.string(),
    mode: savePdfSessionModeSchema,
    targetPath: z.optional(z.string()),
});

export const savePdfSessionSuccessSchema = z.object({
    ok: z.literal(true),
    savedPath: z.string(),
    bytesWritten: z.number(),
});

export const savePdfSessionResultSchema = z.union([
    savePdfSessionSuccessSchema,
    pdfIpcErrorResultSchema,
]);
