---
name: react-file-structure
description: React file organization, component boundaries, hooks, and side-effect conventions.
---

# React File Structure

Use this structure when a task cannot be solved by a small local edit.

## Components

- Keep `src/app.ts` limited to bootstrapping, global styles, config exposure, and root mounting.
- Keep `src/love-days-app.tsx` focused on top-level flow, queries, mutations, and page composition.
- Place screen-level components in `src/pages/`.
- Place reusable widgets in `src/components/`.
- Place reusable form fields in `src/components/forms/`.
- Keep page-local subcomponents in the same page file until reuse is real.

## Hooks, State, And Side Effects

- Use React hooks only inside React components or custom hooks.
- Use TanStack Query for Supabase/mock async data.
- Use React Hook Form for forms.
- Keep Zalo SDK and Supabase side effects in `src/services/`.
- Keep custom hooks beside the feature that owns them; promote to `src/utils/` or a shared module only when reuse is real.

## Helpers And Types

- Put pure helpers in `src/utils/`.
- Put domain contracts in `src/types/`.
- Keep props interfaces near the component unless shared across files.
- Prefer existing domain types over one-off duplicate shapes.

## Styling

- Use `zmp-ui` primitives first for platform controls.
- Use Tailwind classes for layout and spacing.
- Use `src/css/app.scss` for shared app-specific styles.
- Do not add new styling systems without approval.
