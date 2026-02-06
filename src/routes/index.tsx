import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: IndexPage,
});

function IndexPage() {
    return (
        <main className="flex h-full w-full items-center justify-center">
            <div className="text-sm text-muted-foreground">Fast PDF</div>
        </main>
    );
}
