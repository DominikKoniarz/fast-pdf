import { PdfPageView } from "@/views/pdf-page/pdf-page";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/mini";

export const Route = createFileRoute("/pdf-page")({
    validateSearch: z.object({
        sessionId: z.optional(z.string()),
    }),
    component: PdfPageView,
    wrapInSuspense: true,
});
