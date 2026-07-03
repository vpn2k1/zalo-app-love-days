# Architecture

Important files:

- `src/app.ts` imports global styles, exposes `app-config.json`, and mounts React into `#app`.
- `src/love-days-app.tsx` owns top-level view state, auth flow, invite flow, React Query queries, and mutations.
- `src/components/layout.tsx` provides the app shell and renders `LoveDaysApp`.
- `src/pages/` contains screen-level React components such as setup, home, edit profile, invite accept, and permission gate.
- `src/components/` contains reusable UI widgets such as cards, forms, logo, and clock.
- `src/components/forms/` contains shared input/select/textarea/date picker controls.
- `src/services/` contains Zalo SDK, Supabase, auth, couple, invite, anniversary, and mock database logic.
- `src/types/` contains domain TypeScript types.
- `src/utils/` contains pure date and invite helpers.
- `src/config/` contains app constants such as invite URL behavior.
- `src/css/` contains Tailwind and Sass app styles.
- `src/www/` is build output for Zalo Mini App packaging.

Data flow:

```text
Zalo SDK / URL / UI event
  -> LoveDaysApp query or mutation
  -> service module
  -> Supabase or mockDb
  -> React Query cache
  -> page/component props
```

Most tasks should keep this flow intact.

React boundary:

- `LoveDaysApp` coordinates state and passes explicit props.
- Pages render screen UI and call callbacks from `LoveDaysApp`.
- Components stay reusable and avoid direct service calls unless they are intentionally integration components.
