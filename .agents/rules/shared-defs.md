---
name: shared-defs
description: Reuse shared types, services, utilities, UI components, and form controls before declaring new ones.
---

# Shared Definitions

Before adding a new type, helper, component, or service concept, check:

- `src/types/` for domain contracts.
- `src/services/` for data and SDK behavior.
- `src/components/` for reusable UI widgets.
- `src/components/forms/` for form controls.
- `src/utils/` for pure helpers.
- `src/config/` for app constants.

Do not duplicate user, couple, invite, anniversary, form field, or service response shapes.

React-specific reuse:

- Keep props and tiny helpers local until at least two files need them.
- Prefer composition over new wrapper components when existing components or `zmp-ui` primitives already express the UI.
- Keep service contracts typed through `src/types/`.
