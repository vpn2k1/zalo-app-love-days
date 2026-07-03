# Feature Build Guide

Use this when a request changes app behavior.

## Add or change a screen

1. Add or update a component in `src/pages/`.
2. Add view state or transitions in `src/love-days-app.tsx` only when the screen is part of the top-level flow.
3. Pass data and callbacks through props.
4. Keep direct Zalo/Supabase calls in `src/services/`.
5. Run `npm run typecheck`.

## Add a reusable component

1. Check `src/components/` and `src/components/forms/` first.
2. Keep the component focused on presentation and user interaction.
3. Define props near the component unless shared across files.
4. Use `zmp-ui` and existing Tailwind/Sass patterns before adding new styling patterns.

## Add or change data behavior

1. Update the relevant service in `src/services/`.
2. Keep Supabase and mock mode behavior equivalent.
3. Update `src/types/` if the data contract changes.
4. Wire UI refresh through TanStack Query invalidation or cache updates.
5. Run `npm run typecheck`; run `npm run build` for env, bundling, or deployment-sensitive changes.

## Add Supabase behavior

1. Prefer client-safe anon operations already represented in services.
2. Ask before changing `supabase/schema.sql`, RLS policy assumptions, or Edge Function behavior.
3. Never add service-role keys or Zalo secrets to frontend code.
