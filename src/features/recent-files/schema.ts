import { z } from "zod";

export const recentFileSchema = z.object({
    path: z.string(),
    name: z.string(),
    openedAt: z.string(),
});

export const recentFilesSchema = z.array(recentFileSchema);
