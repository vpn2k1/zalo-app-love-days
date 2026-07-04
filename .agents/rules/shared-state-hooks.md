---
name: shared-state-hooks
description: Create reusable custom hooks for UI state that is read or controlled from multiple places.
---

# Shared State Hooks

Use a custom hook in `src/hooks/` when local UI state must be opened, closed, read, or updated from multiple unrelated components.

## When To Use

- Bottom sheets, modals, action sheets, image viewers, snackbars, or other global UI surfaces.
- State triggered by one component and rendered by another.
- Short-lived client UI state that does not belong to Supabase, Zalo SDK, or TanStack Query.

## When Not To Use

- Server or mock data. Use TanStack Query.
- Form-only state. Use React Hook Form.
- State owned by one component. Use local `useState`.
- Domain writes or SDK calls. Keep those in `src/services/`.

## Rules

- Put shared hooks in `src/hooks/`.
- Name hooks with `use...`; name imperative setters clearly, such as `showInviteSheet` and `hideInviteSheet`.
- Use explicit union types for state names and payloads.
- Prefer `null` as the closed state for global surfaces.
- Keep listener sets module-local and typed.
- Subscribe in `useEffect`; always unsubscribe in the cleanup callback.
- Notify all listeners through a small `emit` helper.
- Keep files under 200 lines.
- Do not use ternary operators, `else`, `else if`, `switch`, or `case`.
- Handle false or closed cases first with early returns.

## Pattern

```ts
import { useEffect, useState } from "react";

type SheetState = {
  name: "invite" | "profile" | null;
  onClose?: () => void;
};

const defaultState: SheetState = { name: null };
const listeners = new Set<(state: SheetState) => void>();

function emit(state: SheetState) {
  listeners.forEach((listener) => listener(state));
}

export function showAppSheet(state: Omit<SheetState, "name"> & Pick<SheetState, "name">) {
  emit(state);
}

export function hideAppSheet() {
  emit(defaultState);
}

export function useAppSheetState() {
  const [state, setState] = useState<SheetState>(defaultState);

  useEffect(() => {
    listeners.add(setState);

    return () => {
      listeners.delete(setState);
    };
  }, []);

  return state;
}
```

## Rendering Pattern

```tsx
function SharedSheetHost() {
  const sheet = useAppSheetState();

  if (!sheet.name) return null;

  return <AppSheet visible onClose={hideAppSheet} />;
}
```
