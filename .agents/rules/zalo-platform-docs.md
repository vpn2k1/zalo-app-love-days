---
name: zalo-platform-docs
description: Official Zalo Mini App API and ZaUI documentation rules.
---

# Zalo Platform Docs

Use official Zalo Platform docs for SDK APIs and ZaUI components:

- Mini App API: https://docs.zaloplatforms.com/docs/MA/api
- ZaUI Components: https://docs.zaloplatforms.com/docs/MA/zaui

## Rules

- Check the official docs before adding or changing `zmp-sdk` API usage, permission flows, native capabilities, sharing, camera/media, navigation, or `zmp-ui` components.
- Check installed package versions in `package.json` before using APIs or component props from newer docs.
- Reuse existing service modules, hooks, and component wrappers before adding new platform abstractions.
- Keep direct `zmp-sdk` behavior out of presentational components; place it in `src/services/`, pure helpers, or feature hooks that call services.
- Preserve local/mock behavior when a Zalo bridge API is unavailable outside the Mini App runtime.
- Never add Zalo app secrets, appsecret proof generation, service-role keys, or server-only credentials to client code.
- Cite the official docs URL in PR notes or final summaries when a change depends on a specific Zalo API or ZaUI behavior.
