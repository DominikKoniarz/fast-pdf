import path from "path";
import { z } from "zod/mini";

export const recentFileSchema = z.object({
    path: z.string(),
    name: z.string(),
    openedAt: z.string(),
});

export const recentFilesSchema = z.pipe(
    z.array(recentFileSchema),
    z.transform((files) =>
        files.filter((file) =>
            path.extname(file.path).toLowerCase().endsWith(".pdf"),
        ),
    ),
);
