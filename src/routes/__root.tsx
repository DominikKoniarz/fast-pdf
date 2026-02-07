import { RootView } from "@/views/root/root";
import { createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
    component: RootView,
});
