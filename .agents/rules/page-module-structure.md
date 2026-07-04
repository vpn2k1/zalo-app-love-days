---
name: page-module-structure
description: Feature page folder structure modeled after src/pages/setup.
---

# Page Module Structure

Use `src/pages/setup` as the default shape for feature pages that have multiple UI sections, form state, or page-local orchestration.

## Folder Shape

Prefer this layout once a screen grows beyond a small single-file page:

```text
src/pages/<feature>/
├── <Feature>Page.tsx       # screen shell and composition
├── items/                  # page-local visual sections
├── modules/                # page-local hooks, mutations, adapters
└── types/                  # page-local form values and props shared inside the page folder
```

## Responsibilities

- Keep `<Feature>Page.tsx` as the shell: initialize page-local providers/forms, render `Page`, and compose child sections.
- Put feature-only UI sections in `items/`. Name them `<Feature>Page<Section>.tsx`.
- Put feature-only hooks, mutations, and orchestration helpers in `modules/`. Name hooks with `use...`.
- Put page-local form values and shared internal props in `types/`.
- Promote code out of the page folder only when reuse is real:
  - reusable widgets -> `src/components/`
  - reusable form controls -> `src/components/forms/`
  - service/network/persistence logic -> `src/services/`
  - domain contracts used across features -> `src/types/`
  - pure helpers -> `src/utils/`

## React Hook Form Pattern

- Create the form in the page shell with `useForm`.
- Let child items read form state through `useFormContext`.
- Keep form field names typed from the page-local form values type.
- Keep submit mapping in a page-local module or submit item when it is feature-specific.

## Boundaries

- Do not call Supabase, Zalo SDK, or mock DB directly from `items/`.
- Do not make `items/` reusable by reaching into unrelated features.
- Do not add ternaries, `else`/`else if`, or `switch`/`case`; use guard clauses and small helpers.
- Keep every source file under 200 lines. Split sections before the page shell becomes a mixed UI/logic file.
