---
name: shared-state-hook-builder
description: Build reusable React custom hooks for shared client UI state in Love Days, using typed module-local listener sets, show/hide helpers, useEffect subscriptions, cleanup, null closed states, and guard-clause control flow.
---

# Shared State Hook Builder

Use this skill when a feature needs UI state that can be triggered or read from multiple components.

## Choose The Right State Owner

- Use TanStack Query for Supabase/mock async data.
- Use React Hook Form for form state.
- Use local `useState` for state owned by one component.
- Use this shared hook pattern for global UI surfaces or cross-component UI state.

## Build The Hook

1. Create the hook in `src/hooks/`.
2. Define an explicit state type with a `name` union and `null` closed state.
3. Define a `defaultState` constant.
4. Create a module-local `Set` of listeners.
5. Add an `emit` helper that calls every listener.
6. Export imperative helpers such as `show...`, `hide...`, or `set...`.
7. Export a `use...State` hook that subscribes in `useEffect`.
8. Remove the listener in the effect cleanup.
9. Keep SDK calls and service calls out of the hook unless the hook is explicitly a feature orchestration hook.

## Style Rules

- Do not use ternary expressions.
- Do not use `else`, `else if`, `switch`, or `case`.
- Check closed or invalid states first.
- Return early for closed or invalid states.
- Keep the hook file under 200 lines.
- Use `@/` imports for app-local types.

## Example

```ts
import { useEffect, useState } from "react";

type SheetState = {
  name: "anniversary" | "profile" | null;
  id?: string;
  onClose?: () => void;
};

const defaultState: SheetState = { name: null };
const listeners = new Set<(state: SheetState) => void>();

function emit(state: SheetState) {
  listeners.forEach((listener) => listener(state));
}

export function showSharedSheet(state: SheetState) {
  emit(state);
}

export function hideSharedSheet() {
  emit(defaultState);
}

export function useSharedSheetState() {
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

## Host Component Pattern

Render one host near the screen or app layer that owns the visual surface.

```tsx
function SharedSheetHost() {
  const sheet = useSharedSheetState();

  if (!sheet.name) return null;

  return (
    <AppSheet visible onClose={hideSharedSheet}>
      <SheetContent sheet={sheet} />
    </AppSheet>
  );
}
```
