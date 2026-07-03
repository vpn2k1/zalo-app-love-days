---
name: naming-conventions
description: Naming rules for this React/Vite TypeScript Zalo Mini App.
---

# Naming Conventions

- Match the naming style already present in the target folder.
- Screen components in `src/pages/` use PascalCase filenames such as `HomePage.tsx`.
- Shared React component filenames may use PascalCase or established lowercase names; do not rename existing files just for style.
- React components use PascalCase.
- Functions, variables, constants scoped inside modules, and props use camelCase.
- TypeScript types, interfaces, and enums use PascalCase.
- Service modules use camelCase filenames ending in `Service.ts` when that matches the existing pattern.
- Top-level exported constants may use camelCase when they are objects consumed directly or UPPER_SNAKE_CASE for true constants.

Prefer clear domain names over abbreviations. Keep page, component, service, type, and utility names aligned so agents can trace behavior quickly.
