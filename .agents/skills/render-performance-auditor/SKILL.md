---
name: render-performance-auditor
description: Audit and improve React/Vite/Zalo Mini App screen and component re-render performance. Use when Codex is asked to check unnecessary re-renders, optimize rendering, review React memoization, stabilize props/callbacks, split state, diagnose slow screens, or improve component performance in Love Days.
---

# Render Performance Auditor

Use this skill when reviewing or changing Love Days screens/components for render performance.

## Audit Workflow

1. Locate the screen, hook, component, and service path involved in the user-visible update.
2. Trace state ownership from `src/love-days-app.tsx`, page modules, TanStack Query hooks, Jotai atoms, and local component state.
3. Identify which state changes should re-render which subtree.
4. Inspect props passed across page, item, and reusable component boundaries.
5. Prefer small, targeted fixes over broad memoization.
6. Preserve project control-flow rules: no ternaries, no `else`, no `switch`.
7. Run `npm run typecheck` after code changes.

## What To Check

- Component bodies doing expensive date, array, object, URL, or style computation on every render.
- Inline object, array, function, render-prop, or component values passed to memoized children.
- Query result shaping that creates new arrays/objects in parents when it can be moved into `select`, a custom hook, or a child.
- Parent state that changes frequently while large unrelated children sit in the same render subtree.
- Derived state stored with `useState` and synchronized by `useEffect` when it can be computed directly or memoized.
- Effects that set state after every render because dependencies are unstable.
- Context/provider values recreated on every render without `useMemo`.
- List items missing stable keys or using indexes when domain IDs exist.
- Event handlers that close over too much state or are recreated and passed deep into stable children.
- ZaUI overlays, modals, pickers, and forms that stay mounted with heavy children when closed.
- React Hook Form watchers that subscribe a large screen when a narrow field-level subscription would be enough.

## Fix Order

1. Remove unnecessary state first.
2. Move state down to the component that uses it.
3. Split large components before adding memoization.
4. Stabilize props with `useMemo` or `useCallback` only when a child is memoized, an effect depends on identity, or profiling/code inspection shows churn.
5. Wrap presentational children in `memo` only when their props can stay stable and their render cost or frequency justifies it.
6. Move expensive pure calculations into `useMemo` with minimal dependencies.
7. Extract feature-local hooks when orchestration makes the page bulky or causes unrelated render coupling.

## Love Days Conventions

- Keep screens in `src/pages/` and screen-local pieces in `items/`, `modules/`, and page-local type files.
- Keep side effects and service calls in `src/services/`; do not optimize by bypassing service layers from components.
- Keep changed source files under 200 lines.
- Use domain types from `src/types/`.
- Keep Vietnamese UI copy natural if any copy changes are needed.
- Preserve mock mode behavior when touching query or service logic.
- Avoid changing dependency manifests, config, global CSS setup, or Supabase schema unless the performance task directly requires it.

## Reporting

When reviewing without editing, report findings in this shape:

- Finding: the unnecessary render source and its user-visible risk.
- Evidence: file and line reference, plus the state/prop identity path.
- Fix: the smallest recommended change.
- Verification: typecheck, build if relevant, and profiling/manual steps when runtime confirmation matters.

When editing, summarize:

- What render coupling was reduced.
- Which props, callbacks, derived values, or state boundaries were stabilized.
- Which command verified the change.
