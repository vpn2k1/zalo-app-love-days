---
name: project-structure
description: Source layout and boundaries for the React/Vite Zalo Mini App.
---

# Project Structure

Primary layout:

```text
src/app.ts                 React entrypoint and root mount
src/love-days-app.tsx      top-level app orchestration
src/pages/                 screen-level React components
src/components/            reusable UI widgets
src/components/forms/      shared form controls
src/services/              Zalo, Supabase, mock, auth, couple, invite, anniversary logic
src/types/                 domain TypeScript types
src/utils/                 pure helpers
src/config/                app constants/config helpers
src/css/                   Tailwind and Sass styles
src/static/                source assets
src/www/                   Zalo Mini App build output
supabase/                  schema and Edge Functions
```

Rules:

- Put full screens in `src/pages/`.
- Put reusable widgets in `src/components/`.
- Put reusable form controls in `src/components/forms/`.
- Put SDK, network, persistence, and mock logic in `src/services/`.
- Put pure data/date/string helpers in `src/utils/`.
- Put shared domain types in `src/types/`.
- Keep `src/love-days-app.tsx` as the coordinator for top-level app flow; extract when logic becomes feature-specific.
- Use the `@/` alias for app-local imports.
