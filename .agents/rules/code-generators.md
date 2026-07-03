---
name: code-generators
description: Avoid adding generator pipelines. Vite/ZMP build output and TypeScript artifacts are not manually edited.
---

# Code Generators

This repo does not use app-specific code generation. Do not add `plop`, `hygen`, custom scaffolding CLIs, or codegen steps without user approval.

Allowed generated or tool-owned outputs:

- Vite/ZMP build output in `www/` may be produced by `npm run build`, but do not manually edit built bundles.
- TypeScript incremental files may exist if already tracked, but do not edit them manually.
- Package lockfiles are updated only when dependency changes are approved.

Prefer hand-written React/TypeScript using the existing pages, components, services, types, and utils.
