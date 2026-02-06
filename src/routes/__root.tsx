import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
    component: RootLayout,
});

function RootLayout() {
    return (
        <div className="h-screen w-screen overflow-hidden bg-background text-foreground">
            <Outlet />
        </div>
    );
}
