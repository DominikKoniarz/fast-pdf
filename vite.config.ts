import electron from "vite-plugin-electron/simple";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const sourceAlias = {
    "@": path.resolve(__dirname, "./src"),
};

export default defineConfig({
    plugins: [
        electron({
            main: {
                entry: "src/main.ts",
                vite: {
                    build: {
                        outDir: "dist-electron",
                    },
                    resolve: {
                        alias: sourceAlias,
                    },
                },
            },
            preload: {
                input: "src/preload.ts",
                vite: {
                    build: {
                        outDir: "dist-electron",
                    },
                    resolve: {
                        alias: sourceAlias,
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
        alias: sourceAlias,
    },
});
