---
name: networking-and-data
description: Data, SDK, Supabase, mock mode, and secret-handling rules.
---

# Networking And Data

Data access belongs in `src/services/`.

- Use `zaloService.ts` for Zalo SDK user/share behavior.
- Use `supabaseClient.ts` for Supabase client creation.
- Use domain services such as `authService.ts`, `coupleService.ts`, `inviteService.ts`, and `anniversaryService.ts`.
- Keep mock mode in `mockDb.ts` working when Supabase env vars are missing.
- Keep UI components from reaching directly into Supabase or Zalo SDK.
- Validate and normalize remote data at service boundaries.
- Use TanStack Query for async reads/writes that affect UI freshness.
- Never hardcode secrets in source, examples, or logs.

Frontend env vars must be `VITE_*`. Zalo app secrets and Supabase service-role keys do not belong in this client app.
