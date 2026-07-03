# Project Overview

This repository is `love-days`: a Zalo Mini App for couples built with React 18, TypeScript, Vite, `zmp-sdk`, `zmp-ui`, Supabase, TanStack Query, Jotai, React Hook Form, Tailwind CSS, and Sass.

Core product:

- Request Zalo user permission and read the current Zalo user.
- Upsert the user into Supabase, or use mock `localStorage` data when Supabase env vars are missing.
- Create a couple profile with start date and display names.
- Show days together, partner cards, upcoming anniversaries, and anniversary list.
- Create and accept invite links through Zalo sharing.
- Edit profile/avatar/start date.

Primary edit path:

1. Put screen-level UI in `src/pages/`.
2. Put reusable widgets in `src/components/`.
3. Put form primitives in `src/components/forms/`.
4. Put Zalo/Supabase/data behavior in `src/services/`.
5. Put pure helpers in `src/utils/`.
6. Put domain types in `src/types/`.
7. Run `npm run typecheck`.
