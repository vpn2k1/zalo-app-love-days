# Love Days

Zalo Mini App đếm ngày yêu nhau cho cặp đôi, xây bằng React, TypeScript, `zmp-sdk`, `zmp-ui` và Supabase.

## Tính năng

- Permission Gate xin quyền `scope.userInfo`, sau đó gọi `getUserInfo`.
- Upsert Zalo user vào bảng `users`.
- Tạo couple, member owner và danh sách ngày kỷ niệm.
- Home hiển thị hai phía của cặp đôi, trái tim, số ngày yêu, kỷ niệm gần nhất và danh sách kỷ niệm.
- Tạo invite code, mở `openShareSheet` để mời đối tác qua Zalo.
- Nhận invite bằng query `?inviteCode=...`, kiểm tra hiệu lực và thêm partner.
- Mock mode tự bật khi thiếu Supabase env, lưu dữ liệu trong `localStorage`.

## Cài đặt

```bash
npm install
```

Tạo file `.env` nếu dùng Supabase:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Nếu không tạo `.env`, app chạy mock mode.

## Supabase

1. Mở Supabase SQL Editor.
2. Chạy file [supabase/schema.sql](/Users/mn13/Projects/zalo-mini-app/love-days/supabase/schema.sql).
3. Điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`.

Ghi chú: schema hiện có policy anon rộng để chạy demo nhanh trong Mini App. Khi production, nên chuyển thao tác invite/member sang Supabase Edge Functions hoặc backend có xác thực.

## Chạy local

```bash
npm run start
```

Zalo Mini App CLI sẽ mở dev server, thường tại `http://localhost:3000`.

## Build và deploy Zalo Mini App

```bash
npm run login
npm run deploy
```

Trước khi deploy, cấu hình Mini App ID trong Zalo Mini App Extension hoặc CLI theo project thật của bạn. File `app-config.json` đã đặt title là `Love Days` và ẩn action bar để UI full mobile.

## Cấu trúc chính

```text
src/
  App.tsx
  app.ts
  pages/
  components/
  services/
  utils/
  types/
supabase/
  schema.sql
```
