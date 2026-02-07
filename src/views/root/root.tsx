import { Outlet } from "@tanstack/react-router";

export function RootView() {
    return (
        <div className="bg-background text-foreground h-screen w-screen overflow-hidden">
            <Outlet />
        </div>
    );
}
