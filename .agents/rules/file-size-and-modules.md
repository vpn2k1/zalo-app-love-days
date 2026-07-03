---
name: file-size-and-modules
description: Keep files under 200 lines by splitting feature UI, hooks, helpers, and service logic into focused modules.
---

# File Size And Modules

Keep every source file focused and easy to scan.

## Size Limit

- Target fewer than 200 lines per source file.
- If a file would exceed 200 lines, split it before finishing the task.
- Treat 200 lines as a hard review trigger, not a goal to fill.
- Prefer several clear feature-local files over one dense page or app file.
- Generated files, plain config/data lists, and build outputs may exceed this only when they are intentionally mechanical.

## React Splitting

- Keep screen files in `src/pages/` focused on page composition.
- Extract large page sections into page-local components beside the page when they are only used by that page.
- Promote components to `src/components/` only when shared across pages or clearly reusable.
- Keep presentational components mostly props-in/render-out; avoid burying query, mutation, Zalo, or Supabase behavior inside UI components.

## Hooks And Logic

- Move `useQuery`, `useMutation`, cache invalidation, permission flows, and form orchestration into custom hooks when they make a component hard to scan.
- Place feature-owned hooks beside the owning page or module, for example `src/pages/<feature>/hooks/` or `src/pages/<feature>/useX.ts`.
- Promote hooks to `src/services/`, `src/utils/`, or shared modules only when the behavior belongs at that layer or reuse is real.
- Keep service calls inside `src/services/`; hooks may orchestrate services but should not embed Supabase/Zalo SDK calls directly.

## Before Finishing

- Check changed files with `wc -l` or equivalent when a file looks close to the limit.
- If a file is still over 200 lines, mention why only when it is an allowed exception.
- Keep imports clean after extraction and run `npm run typecheck` for code changes.
