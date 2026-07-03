# AI Collaboration

Default behavior:

- Read `AGENTS.md` first.
- Load relevant `.agents/rules/*.md` constraints.
- Treat this as a React/Vite/Zalo Mini App, not a Next.js landing template.
- Keep harness docs lean and action-oriented.

When changing code:

- Stay inside the user's requested scope.
- Prefer existing pages, components, services, types, and utils before adding new structure.
- Keep Supabase/Zalo side effects in services.
- Preserve mock mode unless the user explicitly removes it.
- Sync harness references when a code change makes them stale.
- Verify with `npm run typecheck` for code edits.

When reviewing:

- Lead with bugs, async state issues, service contract mismatches, broken mock behavior, Zalo/Supabase risks, accessibility issues, or verification failures.
- Mention residual test/build risk only after concrete findings.
