# App Logic And Flows

Use this file before changing Love Days app behavior. It describes the current top-level logic and the intended places to extend the app.

## Current App Coordinator

`src/love-days-app.tsx` is the app coordinator. Keep it focused on:

- top-level view state
- React Query queries
- mutations
- cache updates and invalidation
- passing data and callbacks to pages

Do not move Supabase, Zalo SDK, invite, or persistence logic into page components. Put that logic in `src/services/`.

Current view union:

```ts
type AppView = "permission" | "blocked" | "invite" | "setup" | "home" | "edit";
```

Current active screen mapping:

- `permission` -> `src/pages/app/OpeningScreen.tsx`
- `blocked` -> `src/pages/app/OpeningScreen.tsx`
- `invite` -> `src/pages/InviteAcceptPage.tsx`
- `setup` -> `src/pages/app/CoupleSetupConfig.tsx`
- `home` -> `src/pages/app/HomePage.tsx`
- `edit` -> `src/pages/EditProfilePage.tsx`

Older screens still exist in `src/pages/`. Do not delete or rewrite them unless the task explicitly asks for it.

## Main Data Flow

Keep this route intact:

```text
UI event
  -> LoveDaysApp query or mutation
  -> service module
  -> Supabase or mockDb
  -> React Query cache update/invalidation
  -> page/component props
```

React Query keys:

```ts
["couple", userId]
["anniversaries", coupleId]
```

After a write, update or invalidate the matching query instead of manually forcing UI state in pages.

## Boot And Permission Flow

On app start:

1. `getInviteCodeFromUrl()` checks the URL.
2. If there is an invite code, initial view is `invite`.
3. Otherwise initial view is `permission`.

Permission flow:

1. `OpeningScreen` calls `onAllow`.
2. `authorizeMutation` runs `authorizeUser`.
3. `zaloService.getCurrentUser()` reads Zalo user info.
4. `authService.upsertZaloUser()` creates or updates the app user.
5. `openAfterAuth()` calls `coupleService.getCoupleByUser(appUser.id)`.
6. If a couple exists, view becomes `home`.
7. If no couple exists, view becomes `setup`.
8. If auth fails, view becomes `blocked`.

## Couple Setup Flow

`CoupleSetupConfig` receives:

- `user`
- `loading`
- `onCreate(input)`

It submits `SetupCoupleInput`:

```ts
type SetupCoupleInput = {
  startDate: string;
  displayName: string;
  anniversaries: Array<{
    title: string;
    date: string;
    repeat_type: "yearly" | "none";
    note?: string;
  }>;
};
```

`createCoupleMutation` calls `coupleService.createCouple(user, input)`.

Create behavior:

- Update current user's `display_name`.
- Create one `couples` row.
- Create owner membership in `couple_members`.
- Create initial `anniversaries` if provided.
- Cache the created `CoupleWithMembers`.
- Invalidate anniversary query.
- Move to `home`.

When extending setup, update:

- `src/types/couple.ts`
- `src/pages/app/CoupleSetupConfig.tsx`
- `src/services/coupleService.ts`
- `src/services/mockDb.ts`
- `supabase/schema.sql` only after asking if schema changes are needed.

## Home Flow

`HomePage` receives all data and callbacks from `LoveDaysApp`.

Current props include:

- `user`
- `coupleData`
- `anniversaries`
- `onAddPartner`
- `onSaveProfile`
- `onAddAnniversary`
- `onEditProfile`

Home should render UI and call callbacks. It should not call Supabase or Zalo services directly.

Current supported actions:

- invite partner
- update current user's display name/avatar through `onSaveProfile`
- update couple start date through `onSaveProfile`
- add anniversary through `onAddAnniversary`
- navigate to edit profile through `onEditProfile`

## Invite Flow

Invite creation:

1. Home calls `onAddPartner`.
2. `invitePartnerMutation` checks `user` and `coupleData`.
3. `inviteService.createInvite(coupleId, userId)` creates a pending invite.
4. `inviteService.shareInvite(inviteCode, thumbnail)` opens Zalo share.
5. If Zalo share fails and clipboard is available, the invite URL is copied.
6. Feedback is displayed in Home.

Invite acceptance:

1. URL contains invite code.
2. Initial view is `invite`.
3. `InviteAcceptPage` calls `acceptInviteMutation`.
4. If needed, app authorizes the Zalo user first.
5. `inviteService.acceptInvite(inviteCode, appUser)` validates invite state.
6. It rejects expired, cancelled, accepted, full, or conflicting couples.
7. It adds the user as partner membership.
8. It marks invite accepted and cancels other pending invites for that couple.
9. App caches the accepted couple and moves to `home`.

## Edit Flow

Current edit flow uses `EditProfilePage`.

`saveProfileMutation` currently accepts:

```ts
{
  display_name: string;
  custom_avatar_url: string | null;
  start_date: string;
}
```

It performs two writes:

1. `authService.updateProfile(user.id, { display_name, custom_avatar_url })`
2. `coupleService.updateCoupleStartDate(coupleId, start_date)`

After success:

- update local `user`
- invalidate `["couple", userId]`
- move back to `home`

If adding couple title, theme, background, or other couple settings, do not overload `saveProfileMutation` too much. Prefer a separate `saveCoupleSettingsMutation` if the payload grows.

## Existing Data Model

Current user fields:

- `id`
- `zalo_user_id`
- `name`
- `avatar_url`
- `display_name`
- `custom_avatar_url`
- timestamps

Current couple fields:

- `id`
- `start_date`
- `title`
- `theme`
- `created_by`
- timestamps

Current member fields:

- `id`
- `couple_id`
- `user_id`
- `role`: `owner` or `partner`
- `side`: `left` or `right`
- `joined_at`
- optional joined `user`

Current anniversary fields:

- `id`
- `couple_id`
- `title`
- `date`
- `repeat_type`: `yearly` or `none`
- `note`
- `created_by`
- `created_at`

## Mock Mode

When Supabase env vars are missing, the app uses `src/services/mockDb.ts`.

Every service change must preserve mock mode. If adding a Supabase method, add the equivalent mockDb method in the same task.

## Likely Feature Extensions

### Change own name

Existing path:

- UI -> `onSaveProfile`
- `LoveDaysApp.saveProfileMutation`
- `authService.updateProfile`
- invalidate `["couple", userId]`

Use this for current user's display name.

### Change partner name before partner joins

Not currently modeled. Options:

- Add placeholder partner fields to `couples`, such as `partner_display_name`.
- Or create a pending profile/config object.

This requires type, service, mockDb, and likely schema changes.

### Change couple title

Partially modeled through `couples.title`, but no update method exists yet.

Recommended additions:

- `coupleService.updateCoupleSettings(coupleId, payload)`
- `mockDb.updateCoupleSettings(coupleId, payload)`
- UI in a settings/customize page
- invalidate `["couple", userId]`

### Change background/theme

Currently `couples.theme` exists, but it is only created as `"pastel"` and not actively editable.

Recommended fields if simple:

```ts
theme: string;
```

Recommended fields if richer customization is required:

```ts
background_theme?: string;
background_image_url?: string | null;
accent_color?: string;
```

Schema changes require user approval first.

### Add anniversary

Existing path:

- UI -> `onAddAnniversary`
- `LoveDaysApp.addAnniversaryMutation`
- `anniversaryService.create`
- invalidate `["anniversaries", coupleId]`

Use `AnniversaryDraft`.

### Edit anniversary

Not currently implemented.

Recommended additions:

- `anniversaryService.update(anniversaryId, draft)`
- `mockDb.updateAnniversary(anniversaryId, draft)`
- UI edit state in Home or a dedicated anniversaries page
- invalidate `["anniversaries", coupleId]`

### Delete anniversary

Not currently implemented.

Recommended additions:

- `anniversaryService.remove(anniversaryId)`
- `mockDb.removeAnniversary(anniversaryId)`
- confirmation UI
- invalidate `["anniversaries", coupleId]`

### Change couple photo/background photo

Current code only supports `custom_avatar_url` on users as data URL.

For couple background/photo, prefer adding a couple-level field instead of storing it on a user:

- `couple_photo_url`
- `background_image_url`

If using Supabase Storage later, keep upload logic in `src/services/`.

## Recommended Settings Screen Shape

If the user asks for app customization, create a settings/customize screen rather than putting every control directly on Home.

Suggested sections:

- Personal profile: display name, avatar
- Couple setup: title, start date
- Visuals: theme/background/accent
- Anniversaries: add/edit/delete
- Partner: invite status and share invite

Wire it through `LoveDaysApp` with explicit props and mutations.

## Update Checklist For Future Agents

When changing app behavior:

1. Identify whether the change is UI-only, service-level, type-level, or schema-level.
2. Keep pages presentational and callback-driven.
3. Keep Supabase/Zalo/localStorage work in services.
4. Update `src/types/` when payload or row shape changes.
5. Update `mockDb` whenever Supabase behavior changes.
6. Invalidate or update React Query cache after writes.
7. Ask before changing `supabase/schema.sql`.
8. Run `npm run typecheck`.
9. Update this file if a top-level flow, data contract, or extension point changes.
