---
name: guard-clause-refactor
description: Write or refactor TypeScript/React code to avoid ternary operators, else branches, and switch/case statements by using guard clauses, early returns, false-case-first checks, and small helper functions.
---

# Guard Clause Refactor

Use this skill when adding or editing TypeScript or React code in Love Days.

## Core Style

- Do not write ternary expressions.
- Do not write `else` or `else if`.
- Do not write `switch` or `case`.
- Check false, invalid, missing, loading, empty, or blocked cases first.
- Return immediately for each handled case.
- Keep the primary success path unindented at the bottom.

## Refactor Steps

1. Find conditional branches in the changed code.
2. Convert full-state component branches into early returns.
3. Convert value selection ternaries into helper functions or clear `if return` blocks.
4. Convert `switch` statements into guard clauses or small lookup helpers.
5. Keep JSX readable; extract child components when branch removal makes markup bulky.
6. Run `npm run typecheck` after code changes.

## Examples

Prefer:

```ts
function getActionLabel(hasValue: boolean) {
  if (!hasValue) return "Chọn";

  return "Đổi";
}
```

Prefer:

```tsx
function Screen({ loading, error, data }: Props) {
  if (loading) return <Spinner />;
  if (error) return <ErrorState />;
  if (!data) return <EmptyState />;

  return <MainContent data={data} />;
}
```

Avoid:

```ts
const label = hasValue ? "Đổi" : "Chọn";
```

Avoid:

```ts
if (ready) {
  return value;
} else {
  return fallback;
}
```
