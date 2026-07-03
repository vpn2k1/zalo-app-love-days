# Platform Config

Runtime and tooling:

- Package manager currently used by this repo: npm.
- Development: `npm run start` through Zalo Mini App tooling.
- Type checking: `npm run typecheck`.
- Production build: `npm run build`.
- Zalo auth/deploy: `npm run login`, `npm run deploy`.

Important config:

- `vite.config.mts` configures Vite, React, `zmp-vite-plugin`, port `3000`, `@/` alias, and build output to `www`.
- `tsconfig.json` defines TypeScript settings and `@/*`.
- `src/index.html` is the Mini App HTML shell and loads `src/app.ts`.
- `app-config.json` and `src/www/app-config.json` configure Zalo Mini App metadata.
- `.env.example` documents client-safe Supabase env vars.

Ask before changing dependency or framework config files.
