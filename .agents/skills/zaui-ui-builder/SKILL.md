---
name: zaui-ui-builder
description: Design or implement Love Days React/Zalo Mini App UI using official ZaUI/zmp-ui components, tokens, layouts, forms, overlays, and mobile Mini App conventions.
---

# ZaUI UI Builder

Use this skill when adding or changing Love Days UI, screens, forms, overlays, navigation, loading states, or reusable visual components.

Official docs: https://docs.zaloplatforms.com/docs/MA/zaui

When a task depends on a specific component, prop, token, or overlay behavior, open the official docs page before editing and check the installed `zmp-ui` version in `package.json`.

## Step 1 - Pick The ZaUI Primitive First

Start with `zmp-ui` before custom markup:

- Layout: `App`, `Page`, `Header`, `BottomNavigation`, `Tabs`, `ZMPRouter`, `AnimationRoutes`.
- Display: `Avatar`, `Calendar`, `Icon`, `ImageViewer`, `List`, `Progress`, `Spinner`, `Swiper`, `Text`.
- Form: `Button`, `Input`, `Password`, `Search`, `TextArea`, `OTP`, `Select`, `Picker`, `DatePicker`, `Switch`, `Checkbox`, `Radio`, `Slider`.
- Overlay: `Modal`, `Sheet`, `ActionSheet`, `SnackbarProvider`.

Use custom React components only for Love Days-specific compositions or when ZaUI does not cover the interaction.

## Step 2 - Fit The Existing App

- Put full screens in `src/pages/`.
- Put reusable UI in `src/components/`.
- Put React Hook Form-friendly controls in `src/components/forms/`.
- Reuse existing wrappers before creating new ones.
- Import components from `zmp-ui`; import type-only props from package subpaths when needed.
- Keep imports ordered: external packages, then `@/`, then relative imports.

## Step 3 - Compose Mobile-First UI

- Use ZaUI for semantics and behavior; use Tailwind classes for layout, spacing, and app-specific composition.
- Keep `src/css/app.scss` for shared Love Days styling only when utility classes or existing components are not enough.
- Keep touch targets comfortable and screen content readable on small Zalo Mini App viewports.
- Preserve safe-area behavior and avoid desktop-only assumptions.
- Keep Vietnamese copy concise, natural, and appropriate for couples.

## Step 4 - Forms And Feedback

- Use React Hook Form for forms and wrap ZaUI inputs only when the wrapper improves reuse or consistency.
- Use ZaUI buttons for actions and ZaUI overlays for confirmations, sheets, menus, and transient feedback.
- Use `Spinner`, disabled states, and concise text for loading or blocked actions.
- Keep service calls and SDK calls out of presentational components.

## Step 5 - Verify

Run:

```bash
npm run typecheck
```

Also run `npm run build` when UI work touches assets, app bootstrapping, Vite/ZMP config, environment handling, or deployment packaging.

Before finishing, check changed source files with `wc -l` and split non-exempt files over 200 lines.
