---
name: function-length
description: Keep React components and helpers focused; extract subcomponents/utilities when units become hard to scan.
---

# Function Length

Target small, readable units:

- React components: usually under ~120 lines.
- Helpers and render functions: usually under ~80 lines.
- Files: split when a page or service starts mixing unrelated concerns.

Extract private subcomponents in the same file for local layout pieces. Promote to `src/components/`, `src/components/forms/`, `src/services/`, or `src/utils/` only when reuse is real.

Long static option arrays in `src/config/` are acceptable when they are plain data and easy to scan.
