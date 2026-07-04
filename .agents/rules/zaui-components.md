---
name: zaui-components
description: Prefer official ZaUI/zmp-ui components and design tokens for Love Days UI.
---

# ZaUI Components

Use official ZaUI components from `zmp-ui` as the first choice for Love Days screens and reusable UI.

Reference: https://miniapp.zaloplatforms.com/documents/zaui

## Rules

- Prefer `zmp-ui` primitives for Mini App UI before building custom controls.
- Use ZaUI layout primitives such as `App`, `Page`, `Header`, `BottomNavigation`, and `Tabs` when they match the screen structure.
- Use ZaUI display primitives such as `Avatar`, `Calendar`, `Icon`, `ImageViewer`, `List`, `Progress`, `Spinner`, `Swiper`, and `Text` before custom equivalents.
- Use ZaUI form primitives such as `Button`, `Input`, `TextArea`, `Select`, `Picker`, `DatePicker`, `Switch`, `Checkbox`, `Radio`, and `Slider` for user input.
- Use ZaUI overlay primitives such as `Modal`, `Sheet`, `ActionSheet`, and `SnackbarProvider` for dialogs, bottom sheets, action menus, and transient feedback.
- Keep `zmp-ui/zaui.css` loaded from `src/app.ts`; do not duplicate ZaUI reset or token styles elsewhere.
- Combine ZaUI components with Tailwind utility classes only for app-specific layout, spacing, and composition.
- Keep custom Sass in `src/css/app.scss` focused on Love Days visual identity and repeated app patterns, not replacements for available ZaUI controls.
- Preserve Mini App constraints: mobile-first layouts, safe areas, touch-friendly targets, and short Vietnamese copy.
- Do not add a competing component library or icon system without approval.

## When Custom UI Is Acceptable

Custom UI is acceptable when:

- ZaUI does not provide the needed component or state.
- The component is a Love Days-specific visualization, such as anniversary cards, counters, timelines, or couple profile compositions.
- Existing app components already provide the needed wrapper, such as React Hook Form-friendly fields in `src/components/forms/`.

When wrapping ZaUI components, keep wrappers small, typed, and reusable only when reuse is real.
