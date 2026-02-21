import type {
    PdfDocumentSummary,
    PdfPageContent,
} from "@/features/pdf-page/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

type ActivePdfSession = {
    sessionId: string;
    document: PdfDocumentSummary;
};

const pdfPagesQueryKey = (sessionId: string) =>
    ["pdf-pages", sessionId] as const;

async function openPdfSession(filePath: string): Promise<ActivePdfSession> {
    const openResult = await window.fastPdf.openPdfSession({ filePath });
    if (!openResult.ok) {
        throw new Error(openResult.error.message);
    }

    return {
        sessionId: openResult.sessionId,
        document: openResult.document,
    };
}

async function getPdfSession(sessionId: string): Promise<ActivePdfSession> {
    const sessionResult = await window.fastPdf.getPdfSession({ sessionId });
    if (!sessionResult.ok) {
        throw new Error(sessionResult.error.message);
    }

    return {
        sessionId: sessionResult.sessionId,
        document: sessionResult.document,
    };
}

export function usePdfPage(initialSessionId: string | null | undefined) {
    const [activeSession, setActiveSession] = useState<ActivePdfSession | null>(
        null,
    );
    const openedSessionIdsRef = useRef<string[]>([]);
    const autoHydratedSessionIdRef = useRef<string | null>(null);

    const pagesQuery = useQuery({
        queryKey: activeSession
            ? pdfPagesQueryKey(activeSession.sessionId)
            : (["pdf-pages", "idle"] as const),
        enabled: Boolean(activeSession),
        queryFn: async () => {
            if (!activeSession) {
                throw new Error("No active PDF session");
            }

            const pageIndexes = Array.from(
                { length: activeSession.document.pageCount },
                (_, pageIndex) => pageIndex,
            );

            return Promise.all(
                pageIndexes.map(async (pageIndex): Promise<PdfPageContent> => {
                    const pageResult = await window.fastPdf.getPdfPage({
                        sessionId: activeSession.sessionId,
                        pageIndex,
                    });
                    if (!pageResult.ok) {
                        throw new Error(pageResult.error.message);
                    }

                    return pageResult.page;
                }),
            );
        },
    });

    const openFromSessionIdMutation = useMutation({
        mutationFn: (sessionId: string) => getPdfSession(sessionId),
        onSuccess: (session) => {
            if (!openedSessionIdsRef.current.includes(session.sessionId)) {
                openedSessionIdsRef.current.push(session.sessionId);
            }

            setActiveSession(session);
        },
    });

    const openFromDialogMutation = useMutation({
        mutationFn: async () => {
            const selectedPath = await window.fastPdf.openFileDialog();
            if (!selectedPath) {
                return null;
            }

            return openPdfSession(selectedPath);
        },
        onSuccess: (session) => {
            if (!session) {
                return;
            }

            if (!openedSessionIdsRef.current.includes(session.sessionId)) {
                openedSessionIdsRef.current.push(session.sessionId);
            }

            setActiveSession(session);
        },
    });

    const closeSessionMutation = useMutation({
        mutationFn: async () => {
            if (!activeSession) {
                return null;
            }

            await window.fastPdf.closePdfSession({
                sessionId: activeSession.sessionId,
            });
            return activeSession.sessionId;
        },
        onSuccess: (closedSessionId) => {
            if (closedSessionId) {
                openedSessionIdsRef.current =
                    openedSessionIdsRef.current.filter(
                        (sessionId) => sessionId !== closedSessionId,
                    );
            }

            setActiveSession(null);
        },
    });

    useEffect(() => {
        if (!initialSessionId) {
            return;
        }

        if (autoHydratedSessionIdRef.current === initialSessionId) {
            return;
        }

        autoHydratedSessionIdRef.current = initialSessionId;
        void openFromSessionIdMutation.mutateAsync(initialSessionId);
    }, [initialSessionId, openFromSessionIdMutation]);

    useEffect(() => {
        return () => {
            for (const sessionId of openedSessionIdsRef.current) {
                void window.fastPdf.closePdfSession({ sessionId });
            }
        };
    }, []);

    const openError =
        openFromDialogMutation.error ??
        openFromSessionIdMutation.error ??
        null;

    return {
        activeSession,
        allPages: pagesQuery.data ?? [],
        isLoadingPages: pagesQuery.isFetching || pagesQuery.isLoading,
        pagesError: pagesQuery.error,
        openError,
        isOpeningDialog: openFromDialogMutation.isPending,
        isHydratingSession: openFromSessionIdMutation.isPending,
        isClosing: closeSessionMutation.isPending,
        openFromDialog: openFromDialogMutation.mutateAsync,
        closeSession: closeSessionMutation.mutateAsync,
    };
}
