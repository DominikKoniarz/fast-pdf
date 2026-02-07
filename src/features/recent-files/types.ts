import type { z } from "zod";
import type { recentFileSchema } from "./schema";

export type RecentFile = z.infer<typeof recentFileSchema>;
