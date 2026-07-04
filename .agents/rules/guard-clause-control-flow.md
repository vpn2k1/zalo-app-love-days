---
name: guard-clause-control-flow
description: Use guard clauses and early returns instead of ternaries, else branches, or switch statements.
---

# Guard Clause Control Flow

Prefer simple, linear control flow in all changed TypeScript and React code.

## Rules

- Do not use the ternary operator `condition ? a : b`.
- Do not add `else` or `else if` branches.
- Do not add `switch` or `case` statements.
- Put false, invalid, loading, missing, or blocked cases first.
- Return immediately for those cases.
- Let the happy path continue at the base indentation level.
- Prefer small helper functions when removing a ternary or switch would make JSX noisy.
- Prefer lookup objects or maps over `switch` only when every branch returns a value and the fallback is handled first.

## Preferred Pattern

```ts
function getDisplayName(name?: string) {
  if (!name) return "Bạn";

  return name.trim();
}
```

```tsx
function Content({ loading, error, data }: Props) {
  if (loading) return <Spinner />;
  if (error) return <ErrorState />;
  if (!data) return <EmptyState />;

  return <MainContent data={data} />;
}
```

## Avoid

```ts
const label = name ? name : "Bạn";
```

```ts
if (loading) {
  return <Spinner />;
} else {
  return <MainContent />;
}
```

```ts
switch (view) {
  case "home":
    return <HomePage />;
  default:
    return <SetupPage />;
}
```

## JSX Notes

For conditional JSX, prefer one of these:

- Early returns for whole component states.
- Precomputed variables with guard clauses.
- Boolean rendering with `&&` only when there is no alternate branch.
- Extracted child components when multiple branches would make one component hard to read.
