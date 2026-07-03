# Theming And UI

The project uses `zmp-ui`, Tailwind CSS, and Sass in `src/css/app.scss`.

UI guidance:

- Design for Zalo Mini App mobile screens first.
- Prefer `zmp-ui` primitives for platform-consistent controls, pages, buttons, text, spinner, and layout.
- Use Tailwind classes for local layout and spacing.
- Use `src/css/app.scss` for shared app styling that cannot be expressed cleanly with existing classes.
- Keep touch targets comfortable and avoid dense desktop-style UI.
- Preserve safe-area and small-screen behavior.
- Keep Vietnamese copy natural and concise.

Visual assets:

- Source assets live in `src/static/`.
- Build output assets live in `src/www/` and should be treated as generated unless the task specifically concerns packaged output.
