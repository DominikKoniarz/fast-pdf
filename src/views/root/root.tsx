import { Outlet } from "@tanstack/react-router";

export function RootView() {
    return (
        <div className="h-screen w-screen overflow-hidden bg-background text-foreground">
            <Outlet />
        </div>
    );
}
