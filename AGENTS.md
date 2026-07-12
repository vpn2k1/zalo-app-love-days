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
8. **Styling.** Prefer official ZaUI/`zmp-ui` primitives, Tailwind classes, and `src/css/app.scss`. Keep mobile Mini App constraints in mind, including safe areas and small screens.
9. **Types.** Reuse domain types from `src/types/`. Avoid duplicating service response shapes inside pages/components.
10. **Hands-off files.** Ask before changing dependency manifests, Vite/ZMP config, TypeScript config, global CSS setup, or Supabase schema unless the task directly requires it.
11. **Verification.** For code changes, run `npm run typecheck`. Run `npm run build` when changing bundling, env handling, assets, or ZMP deployment behavior.
12. **Control flow.** Do not add ternary operators, `else`/`else if`, or `switch`/`case`. Use guard clauses, early returns, and false-case-first checks.
13. **Shared UI state.** When UI state is used across unrelated components, create a typed custom hook in `src/hooks/` with module-local listeners, show/hide helpers, `useEffect` subscription, and cleanup.
14. **Zalo docs.** Before adding or changing `zmp-sdk` APIs or `zmp-ui`/ZaUI component behavior, read the official docs at `https://docs.zaloplatforms.com/docs/MA/api` or `https://docs.zaloplatforms.com/docs/MA/zaui` and check installed package versions.
## Ponytail Mode — Lazy Senior Dev

Use Ponytail mode for all code changes in this repository. Lazy means efficient, not careless. The best code is the code never written.

Before writing code, understand the task and trace the real flow end to end. Then stop at the first rung that solves the problem:

1. Does this need to be built at all?
2. Does it already exist in this codebase?
3. Does a helper, util, component, hook, service, or pattern already cover it?
4. Does TypeScript, React, browser API, or standard JavaScript already do it?
5. Does `zmp-ui`, `zmp-sdk`, TanStack Query, Jotai, React Hook Form, Supabase, Tailwind, or another already-installed dependency cover it?
6. Can this be solved with a small local change?
7. Only then, write the minimum code that works.

Rules:

* Prefer deletion over addition.
* Prefer boring code over clever code.
* Prefer the shortest correct diff after understanding the real flow.
* Reuse existing project structure, services, hooks, types, UI components, and helpers before creating new ones.
* Do not add abstractions unless explicitly requested or clearly required by repeated code.
* Do not add dependencies unless the user approves it.
* Do not add boilerplate nobody asked for.
* Fix the root cause, not only the reported symptom.
* When touching a shared function, component, hook, or service, check its callers before changing behavior.
* Avoid broad rewrites when a localized fix solves the issue.
* Keep changes within the smallest reasonable set of files.
* If two approaches are similarly small, choose the safer edge-case-correct option.
* Mark intentional shortcuts with a `ponytail:` comment only when the shortcut has a known ceiling and an obvious upgrade path.

Not lazy about:

* Understanding the problem before editing.
* Input validation at trust boundaries.
* Error handling that prevents data loss.
* Security and secret handling.
* Accessibility.
* Zalo Mini App mobile constraints, safe areas, and real-device behavior.
* Supabase mock-mode compatibility.
* Anything explicitly requested by the user.

For non-trivial logic, leave the smallest runnable verification behind. Prefer `npm run typecheck`; run `npm run build` when bundling, env handling, assets, or ZMP deployment behavior changes.

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
- `zalo-platform-docs` — workflow for reading and applying official Zalo Mini App API and ZaUI docs.
- `page-structure-builder` — workflow for building or refactoring pages using `src/pages/setup` as the folder/module blueprint.
- `zaui-ui-builder` — UI workflow for using official ZaUI/`zmp-ui` components from Zalo Mini App docs.
- `guard-clause-refactor` — code style workflow for replacing ternaries, else branches, and switch/case with guard clauses.
- `shared-state-hook-builder` — workflow for reusable custom hooks that coordinate shared client UI state.
- `render-performance-auditor` — workflow for auditing and improving React screen/component re-render performance.

## Rules Index

Hard constraints live in `.agents/rules/`:

- `naming-conventions`
- `function-length`
- `code-generators`
- `project-structure`
- `state-and-routing`
- `react-file-structure`
- `page-module-structure`
- `file-size-and-modules`
- `networking-and-data`
- `hands-off`
- `trailing-commas`
- `import-rules`
- `shared-defs`
- `localization`
- `zalo-platform-docs`
- `zaui-components`
- `guard-clause-control-flow`
- `shared-state-hooks`

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
