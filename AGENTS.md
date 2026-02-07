## Overview

I am building a desktop application called "Fast PDF". It is a desktop application that allows user to read, write and modify PDF files.

Your task is to build this application using the best practices and tools available. This app has to be both friendly, intuitive and functional.

Remember, it is not a web application, it is a desktop application. So I want it to look like a desktop application.

I want you to keep using these tools:

- Vite
- Tailwind CSS
- React
- LibPDF-js/core (https://github.com/LibPDF-js/core)
- Electron
- Typescript
- Shadcn/UI
- Tanstack Router
- Zod v4 (e.g. `import { z } from "zod/mini"`)

## Files and Directories Structure

Most important files and directories structure:

```
fast-pdf/
├── src/
│   ├── components/                             # Shared components
│   │   └── ui/                                 # Shadcn/UI components
│   ├── features/                               # Features (groups code by features)
│   │   └── recent-files/                       # Recent files feature
│   │       ├── hooks/                          # Hooks - client side logic
│   │       │   └── use-recent-files.ts
│   │       ├── schema.ts                       # Zod schema(s)
│   │       ├── services/                       # Services - logic for the feature
│   │       └── types.ts                        # Types
│   ├── lib/                                    # Library of functions and utilities
│   │   └── utils.ts
│   ├── routes/                                 # Tanstack Router routes
│   ├── views/                                  # Views
│   │   ├── main/
│   │   │   ├── components/                     # Components for the main view
│   │   │   └── main.tsx
│   │   └── root/
│   │       └── root.tsx
│   ├── app.tsx
│   ├── main.ts
│   ├── preload.ts
│   ├── renderer.tsx
│   └── vite-env.d.ts
├── components.json
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── vite.config.ts
```

## Rules

- Always use `import type` instead of `import` for types imports.
- When dealing with frontend design, follow the overall vibe of the application. Focus to use `frontend-design` skill when you are designing or building the frontend.
- Do not run `pnpm dev`. Assume it is already running.
- Use shadcn/ui components for the frontend. You can find them in the `src/components/ui` folder.
- Always use `kebab-case` for file names.
