---
name: import-rules
description: Keep imports clean, sorted, and consistent with TypeScript/React/Vite conventions.
---

# Import Rules

- External package imports first.
- Then app-local imports using `@/`.
- Then relative imports when needed.
- Remove unused imports on every file edit.
- Avoid duplicate imports from the same module.
- Use type-only imports (`import type`) for types when possible.
- Keep React component files free of unused SDK, service, or state imports.

Do not introduce circular dependencies between `src/pages`, `src/components`, `src/services`, `src/types`, and `src/utils`.
