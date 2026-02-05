import electron from "vite-plugin-electron/simple";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
    plugins: [
        electron({
            main: {
                entry: "src/main.ts",
                vite: {
                    build: {
                        outDir: "dist/electron",
                    },
                },
            },
            preload: {
                input: "src/preload.ts",
                vite: {
                    build: {
                        outDir: "dist/electron",
                    },
                },
            },
        }),
        tanstackRouter({
            target: "react",
            autoCodeSplitting: true,
            routesDirectory: "./src/routes",
            generatedRouteTree: "./src/routeTree.gen.ts",
        }),
        tailwindcss(),
        react(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
