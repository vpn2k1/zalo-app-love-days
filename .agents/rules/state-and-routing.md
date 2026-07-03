---
name: state-and-routing
description: View state, app flow, and React state conventions for the Zalo Mini App.
---

# State And Routing

This app currently uses internal view state rather than a router.

- `src/love-days-app.tsx` owns top-level views such as permission, invite, setup, home, and edit.
- Use explicit union types for view names.
- Keep async server/mock state in TanStack Query.
- Use mutations for writes and invalidate or update query cache after successful writes.
- Use React Hook Form for form-heavy screens.
- Use local `useState` for short-lived UI state owned by one component.
- Do not introduce a router or global state library unless the user asks or the need is clear.
- Keep URL parsing helpers in `src/utils/` or a relevant service.

Zalo Mini App links and invite codes should remain compatible with the existing invite flow.
