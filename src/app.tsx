import QueryClientProvider from "@/components/providers/query-client-provider";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
    routeTree,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    return (
        <QueryClientProvider>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}
