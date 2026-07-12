---
name: zalo-platform-docs
description: Use official Zalo Mini App Platform documentation before implementing or changing zmp-sdk APIs, permission flows, native capabilities, sharing, camera/media, navigation, or ZaUI/zmp-ui components in Love Days. Trigger this skill when a task mentions Zalo Mini App APIs, zmp-sdk, zmp-ui, ZaUI, platform permissions, native device APIs, or docs.zaloplatforms.com.
---

# Zalo Platform Docs

Use this skill before adding or changing code that depends on Zalo Mini App APIs or ZaUI behavior.

Official docs:

- Mini App API: https://docs.zaloplatforms.com/docs/MA/api
- ZaUI Components: https://docs.zaloplatforms.com/docs/MA/zaui

## Workflow

1. Open the official docs page for the API or component being used.
2. Prefer the latest docs shown by Zalo, but check the installed package versions in `package.json` before relying on new APIs.
3. Search the existing codebase for the API/component before adding a new wrapper.
4. Keep `zmp-sdk` side effects in `src/services/` or feature hooks that call services; keep presentational components props-in/render-out.
5. Use `zmp-ui` components and existing `src/components/zaui/` or `src/components/forms/` wrappers before custom UI.
6. Preserve mock mode when a Zalo API is unavailable in local browser development.
7. Keep frontend env vars as `VITE_*`; never add Zalo app secrets or server-only credentials to client code.

## Applying API Docs

- Import SDK functions from `zmp-sdk` only when the docs and installed package support them.
- Wrap permission, user, sharing, camera, media, and native bridge behavior in service/helper modules.
- Normalize SDK responses at service boundaries before passing data to pages.
- Handle denial, cancellation, unavailable bridge, and local development fallback paths.
- Keep user-facing errors short and Vietnamese-first.

## Applying ZaUI Docs

- Import components from `zmp-ui`; import prop types from package subpaths when needed.
- Prefer ZaUI layout, form, display, and overlay primitives before custom markup.
- Use Tailwind for Love Days-specific spacing and composition.
- Do not duplicate `zmp-ui/zaui.css`; it is loaded from `src/app.ts`.
- Keep mobile Mini App constraints in mind: safe areas, touch targets, small screens, and short copy.

## Verification

Run:

```bash
npm run typecheck
```

Run `npm run build` too when touching app bootstrapping, assets, package behavior, env handling, or ZMP deployment output.
