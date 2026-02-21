import type { PDF } from "@libpdf/core";
import { randomUUID } from "crypto";
import type { PdfDocumentSummary } from "../types";

export type PdfSessionState = {
    document: PdfDocumentSummary;
    originalBytes: Uint8Array;
    pdf: PDF;
    createdAt: string;
    updatedAt: string;
    dirty: boolean;
};

export type SessionId = string;

const pdfSessionStore = new Map<SessionId, PdfSessionState>();

export function createPdfSession(
    sessionState: Omit<PdfSessionState, "createdAt" | "updatedAt" | "dirty">,
): string {
    const now = new Date().toISOString();
    const sessionId = randomUUID();

    pdfSessionStore.set(sessionId, {
        ...sessionState,
        createdAt: now,
        updatedAt: now,
        dirty: false,
    });

    return sessionId;
}

export function getPdfSession(sessionId: string): PdfSessionState | undefined {
    return pdfSessionStore.get(sessionId);
}

export function touchPdfSession(sessionId: string): void {
    const existing = pdfSessionStore.get(sessionId);

    if (!existing) {
        return;
    }

    existing.updatedAt = new Date().toISOString();
}

export function closePdfSession(sessionId: string): boolean {
    return pdfSessionStore.delete(sessionId);
}

export function clearPdfSessions(): void {
    pdfSessionStore.clear();
}
