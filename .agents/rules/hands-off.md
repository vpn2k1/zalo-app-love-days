---
name: hands-off
description: Foundation files that need explicit approval before modification.
---

# Hands-Off Files

Ask before editing:

```text
vite.config.mts
tsconfig.json
package.json
package-lock.json
src/app.ts
src/index.html
src/css/tailwind.scss
src/www/
supabase/schema.sql
supabase/functions/
```

These files define framework behavior, dependencies, global style setup, app bootstrap, packaged output, or database/backend behavior. If a task appears to need one, explain why and propose the smallest change.

Normal feature work usually edits:

```text
src/love-days-app.tsx
src/pages/
src/components/
src/services/
src/types/
src/utils/
src/config/
src/css/app.scss
```
