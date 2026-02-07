import { MainView } from "@/views/main/main";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: MainView,
    wrapInSuspense: true,
});
