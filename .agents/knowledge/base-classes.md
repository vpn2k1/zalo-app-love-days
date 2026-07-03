# Base Components

There are no framework-wide base classes in this repo.

Reusable building blocks live in:

- `src/components/` for app widgets such as cards, layout, clock, and logo.
- `src/components/forms/` for shared form controls.
- `src/pages/` for screen-level components.
- `zmp-ui` for platform primitives such as `Page`, `Box`, `Button`, `Text`, `Icon`, and `Spinner`.

Prefer composition with these components before creating new abstractions.

For React file organization:

- Keep page-local subcomponents beside the page implementation until reuse is real.
- Promote reusable widgets to `src/components/`.
- Promote shared form controls to `src/components/forms/`.
- Keep service calls out of presentational components unless the component is explicitly an integration boundary.
