# Networking Pipeline

Networking and persistence are intentionally centralized in `src/services/`.

Primary integrations:

- `zaloService.ts` wraps Zalo SDK user/share behavior.
- `supabaseClient.ts` creates the Supabase client from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- `authService.ts` handles user upsert/profile updates.
- `coupleService.ts` handles couples, members, start date, and anniversary reads.
- `anniversaryService.ts` handles anniversary writes.
- `inviteService.ts` handles invite creation, acceptance, URL parsing, and share behavior.
- `mockDb.ts` keeps local mock behavior when Supabase env vars are missing.

Preferred order:

1. UI event or app transition in React.
2. TanStack Query query/mutation in `LoveDaysApp` or the owning feature.
3. Service module.
4. Supabase or `mockDb`.
5. Query cache update/invalidation.

Rules:

- Do not call Supabase or Zalo SDK directly from random UI components.
- Keep mock behavior in sync with Supabase behavior.
- Validate and normalize external data at service boundaries.
- Never log or commit secrets.
