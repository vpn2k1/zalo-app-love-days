# AGENTS.md

Master rules for AI coding agents working in this repository.

## What This Codebase Is

This is **Love Days**, a Zalo Mini App for couples, built with React 18, TypeScript, Vite, `zmp-sdk`, `zmp-ui`, Supabase, TanStack Query, Jotai, React Hook Form, Tailwind CSS, and Sass.

The app requests Zalo user permission, stores or mocks user/couple data, lets a couple set their start date, tracks anniversaries, and supports invite links for adding a partner.

## Critical Rules

1. **Follow the React app structure.** Put screens in `src/pages/`, reusable UI in `src/components/`, form controls in `src/components/forms/`, service integrations in `src/services/`, domain types in `src/types/`, and pure helpers in `src/utils/`.
2. **Keep orchestration focused.** `src/love-days-app.tsx` coordinates app view state, React Query, and mutations. Extract UI into pages/components and extract service logic into `src/services/` when it grows.
3. **Keep files small.** Keep source files under 200 lines. Split large pages into child components and move bulky query/mutation orchestration into feature-local hooks.
4. **Use existing data layers.** Use TanStack Query for async server/mock data, React Hook Form for forms, and the existing service modules for Supabase/Zalo access. Do not bypass services from components.
5. **Preserve mock mode.** When Supabase env vars are missing, the app should keep working through `src/services/mockDb.ts`.
6. **Protect secrets.** Frontend env vars must be `VITE_*`. Never put Zalo app secrets, Supabase service-role keys, or backend secrets in client code.
7. **Imports.** Use the existing TypeScript/React style: external packages first, then `@/` aliases, then relative imports if needed. Remove unused imports.
8. **Styling.** Prefer existing `zmp-ui` primitives, Tailwind classes, and `src/css/app.scss`. Keep mobile Mini App constraints in mind, including safe areas and small screens.
9. **Types.** Reuse domain types from `src/types/`. Avoid duplicating service response shapes inside pages/components.
10. **Hands-off files.** Ask before changing dependency manifests, Vite/ZMP config, TypeScript config, global CSS setup, or Supabase schema unless the task directly requires it.
11. **Verification.** For code changes, run `npm run typecheck`. Run `npm run build` when changing bundling, env handling, assets, or ZMP deployment behavior.

## Architecture Quick Map

```text
src/
├── app.ts                  # React entrypoint, styles, app config, root mount
├── love-days-app.tsx       # top-level app orchestration and view state
├── pages/                  # screen-level React components
├── components/             # reusable UI and composed widgets
│   └── forms/              # shared React Hook Form-friendly inputs
├── services/               # Zalo, Supabase, invite, auth, couple, anniversary data logic
├── types/                  # domain TypeScript types
├── utils/                  # pure helpers
├── config/                 # app constants/config helpers
├── css/                    # Tailwind entry and Sass app styles
├── static/                 # source assets
└── www/                    # ZMP build output
```

## Feature Workflow

When adding or changing app behavior:

1. Identify whether the change belongs to a page, reusable component, service, type, or utility.
2. Keep Zalo/Supabase side effects in `src/services/`.
3. Keep async server/mock state in TanStack Query when it affects UI freshness.
4. Keep local-only UI state inside the owning component.
5. Extract child components and feature-local hooks before a source file exceeds 200 lines.
6. Update domain types in `src/types/` when service contracts change.
7. Verify with `npm run typecheck`.

## Sub-Agent Catalog

Use these roles when the host tool supports sub-agents and the user has allowed delegation:

| Agent | When to use |
|---|---|
| `brainstormer` | Explore product, flow, or UI direction for vague requests. |
| `planner` | Produce a file-level plan before broad routing/data/schema changes. |
| `reviewer` | Audit diffs for bugs, async state issues, Zalo/Supabase risks, UX, and maintainability. |
| `debugger` | Investigate failing typecheck/build/runtime behavior before fixing. |
| `researcher` | Answer read-only codebase or package questions with sources. |
| `ui-ux-designer` | Design or implement React/ZMP UI when the change is mainly presentation. |
| `feature-builder` | Add screens, components, services, mutations, or data flows. |
| `tester` | Add or improve verification coverage when requested or warranted. |
| `docs-writer` | Update this harness layer (`AGENTS.md`, `.agents`, `.codex`). |

## Skills Index

Project skills live in `.agents/skills/`:

- `react-feature-builder` — app feature workflow for React/Vite/Zalo Mini App changes.

## Rules Index

Hard constraints live in `.agents/rules/`:

- `naming-conventions`
- `function-length`
- `code-generators`
- `project-structure`
- `state-and-routing`
- `react-file-structure`
- `file-size-and-modules`
- `networking-and-data`
- `hands-off`
- `trailing-commas`
- `import-rules`
- `shared-defs`
- `localization`

## Knowledge Index

Reference facts live in `.agents/knowledge/`:

- `project-overview`
- `architecture`
- `app-logic-and-flows`
- `feature-build-guide`
- `networking-pipeline`
- `base-classes`
- `theming-and-ui`
- `platform-config`
- `ai-collaboration`

## Common Commands

```bash
npm install
npm run start
npm run typecheck
npm run build
npm run login
npm run deploy
```

## When To Ask First

Ask before:

- Adding a new dependency.
- Changing `vite.config.mts`, `tsconfig.json`, `src/app.ts`, or `src/index.html`.
- Editing global style setup in `src/css/tailwind.scss` or broad rules in `src/css/app.scss`.
- Changing Supabase schema, RLS assumptions, or deployed Edge Function behavior.
- Touching files outside the user-approved scope.
