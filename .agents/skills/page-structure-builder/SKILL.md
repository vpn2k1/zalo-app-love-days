---
name: page-structure-builder
description: Build or refactor Love Days pages to follow the src/pages/setup folder pattern with a thin page shell, items, modules, and page-local types.
---

# Page Structure Builder

Use this skill when creating or refactoring a screen/page in Love Days and the work should follow the `src/pages/setup` structure.

## Reference Pattern

Model feature pages after:

```text
src/pages/setup/
├── SetupPage.tsx
├── items/
├── modules/
└── types/
```

The page file owns the screen shell and composition. `items/` owns page-local UI sections. `modules/` owns page-local hooks, mutations, submit adapters, and orchestration helpers. `types/` owns page-local form values and shared internal props.

## Workflow

1. Inspect the target page and nearby feature files first.
2. If the page is small, keep a single page file.
3. If it has multiple sections, forms, mutations, or bulky state, use the setup-style folder shape.
4. Keep `<Feature>Page.tsx` thin:
   - initialize `useForm` or page-local providers
   - render `Page`
   - compose item components in screen order
5. Move visual sections into `items/<Feature>Page<Section>.tsx`.
6. Move feature-only hooks and mutations into `modules/useSomething.ts`.
7. Move page-local shared types into `types/<Feature>PageType.ts`.
8. Promote reusable code only when at least one other feature should import it.

## Implementation Rules

- Use `zmp-ui` primitives and existing form controls where possible.
- Use React Hook Form for forms; child items should use `useFormContext`.
- Use TanStack Query for async server/mock state.
- Keep Supabase, Zalo SDK, and mock DB calls in services.
- Keep user-facing Vietnamese copy concise and natural.
- Keep imports ordered: external packages, `@/` aliases, then relative imports.
- Keep files under 200 lines.
- Do not add ternaries, `else`/`else if`, or `switch`/`case`.

## Verification

Run:

```bash
npm run typecheck
```

Check changed source file sizes with `wc -l` when a page or item may approach the 200-line limit.
