---
name: react-feature-builder
description: Build or modify React/Vite/Zalo Mini App features using the existing pages, components, services, types, and utils structure.
---

# React Feature Builder

Use this skill when the user asks to add, change, or repair behavior in the Love Days React/Zalo Mini App.

## Step 1 - Locate The Change

Classify the request:

- Screen/UI flow -> `src/pages/` and possibly `src/love-days-app.tsx`.
- Reusable widget -> `src/components/`.
- Form control -> `src/components/forms/`.
- Zalo, Supabase, invite, auth, couple, anniversary, or mock data -> `src/services/`.
- Domain shape -> `src/types/`.
- Pure date/string/URL helper -> `src/utils/`.
- Styling -> `src/css/app.scss` or local Tailwind classes.

## Step 2 - Preserve Data Flow

Keep this path intact:

```text
UI event
  -> LoveDaysApp query/mutation or feature callback
  -> service module
  -> Supabase or mockDb
  -> TanStack Query cache update/invalidation
  -> page/component props
```

Do not call Supabase or Zalo SDK directly from presentational components.

## Step 3 - Implement React Changes

- Keep pages focused on rendering one screen.
- Keep reusable UI in `src/components/`.
- Keep service side effects in `src/services/`.
- Keep props typed near the component unless shared.
- Reuse `zmp-ui` components and existing form controls.
- Keep Vietnamese user-facing copy concise and natural.

## Step 4 - Verify

Run:

```bash
npm run typecheck
```

Run `npm run build` too when touching Vite config, env handling, assets, `src/app.ts`, `src/index.html`, or ZMP packaging behavior.
