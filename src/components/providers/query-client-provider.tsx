"use client";

import {
    QueryClient,
    QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
        },
    },
});

export default function QueryClientProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TanstackQueryClientProvider client={queryClient}>
            {children}
        </TanstackQueryClientProvider>
    );
}
