import { PDF } from "@libpdf/core";
import { readFile } from "fs/promises";
import path from "path";
import {
    pdfDocumentSummarySchema,
    pdfIpcErrorResultSchema,
    pdfPageContentSchema,
} from "../schema";
import type {
    PdfDocumentSummary,
    PdfIpcErrorResult,
    PdfPageContent,
} from "../types";

export async function loadPdfFromFile(filePath: string): Promise<{
    originalBytes: Uint8Array;
    pdf: PDF;
    document: PdfDocumentSummary;
}> {
    const originalBytes = await readFile(filePath);
    const pdf = await PDF.load(originalBytes);

    const document = pdfDocumentSummarySchema.parse({
        filePath,
        fileName: path.basename(filePath),
        pdfVersion: pdf.version,
        pageCount: pdf.getPageCount(),
    });

    return {
        originalBytes,
        pdf,
        document,
    };
}

export function readPdfPageContent(pdf: PDF, pageIndex: number): PdfPageContent {
    const pageCount = pdf.getPageCount();
    if (pageIndex < 0 || pageIndex >= pageCount) {
        throw new RangeError("Page index out of range");
    }

    const page = pdf.getPage(pageIndex);
    if (!page) {
        throw new RangeError("Page index out of range");
    }

    const pageText = page.extractText();
    const textBlocks = pageText.lines
        .map((line) => line.text.trim())
        .filter((text) => text.length > 0);

    return pdfPageContentSchema.parse({
        pageIndex,
        textBlocks,
    });
}

export function toPdfIpcErrorResult(
    code: string,
    message: string,
): PdfIpcErrorResult {
    return pdfIpcErrorResultSchema.parse({
        ok: false,
        error: {
            code,
            message,
        },
    });
}
