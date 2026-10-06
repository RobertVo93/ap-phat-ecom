# CLAUDE.md: ecom (An Phat storefront, root zone)

This is the engineering standard for this app, and every change must follow it. Paths are relative to `ecom/`. Sibling apps: `../admin` (ERP, **owns the DB schema**) and `../pos` (POS, mock-only). Both are served through this app.
Rule of thumb: copy the **post-MVP exemplars** named here (MVP refactor `99e1240`/`dcb27a9`, then forgot password `f5951ba`, tier pricing `fdbe55f`). Bolt.new-era files (monolithic `'use client'` pages) are legacy, so don't copy them.

## 1. Overview

- **Purpose.** This is the customer-facing online store for An Phat Food (bánh tráng, bún, phở). Customers browse the catalog (products and saleable collections managed in admin), use a cart (guest or logged in), and check out with tier (wholesale) pricing. Payment is COD, bank transfer or MoMo, shown as information only because there is no payment gateway. Customers can track orders and manage their account (profile and avatar, addresses, password, notifications). The UI is bilingual (vi default, en). Currency is VND.
- **Stack.**
  - Next.js **15.5.9** (App Router), React **19.1.1**, TypeScript 5.2 with `strict`, alias `@/*` pointing to the app root.
  - Auth: next-auth **v5 beta** (`^5.0.0-beta.29`) with Google and Credentials (bcryptjs), JWT sessions and no DB adapter.
  - DB: TypeORM `^0.3.27` + `pg` on the **same Postgres DB (`anphat_erp`) as admin**, using decorators (`experimentalDecorators`, `emitDecoratorMetadata`).
  - UI: Tailwind 3.3 + shadcn/ui (bolt "nextjs-shadcn" template, `components.json` style default, neutral), lucide-react.
  - S3: AWS SDK v3, with presigning done server-side only.
  - Installed but **unused**: `zod`, `react-hook-form`, `@hookform/resolvers` (only the unused shadcn `components/ui/form.tsx` imports RHF). sonner is imported by 5 files, but its `<Toaster/>` is never mounted, so those toasts never show.
- **Package manager: npm** (`package-lock.json`). The Docker image uses Node 20-alpine.
- **Zone.** This is the **root zone**, and the browser only talks to this app. There is no `basePath`. `NEXT_PUBLIC_BASE_ZONE` is unset for ecom; `env.BASE_ZONE` only feeds `metadataBase` (see §8). `next.config.js` `rewrites()` proxies `/admin/*` to `ADMIN_URL` and `/pos/*` to `POS_URL`, **stripping the prefix**, plus `/admin-static/_next/*` and `/pos-static/_next/*`.
- **Ports** (root `../docker-compose.yml`): ecom `3030:3000`, admin `4000:3000`, pos `4001:3000`, Postgres `5433:5432`.

## 2. Commands

```bash
npm ci                 # install (never pnpm/yarn here)
npm run dev            # next dev -H 0.0.0.0 -p 3000 (standalone needs ADMIN_URL/POS_URL, else rewrites point to "undefined")
npm run build          # type-checks; ESLint is skipped (eslint.ignoreDuringBuilds); webpack cache disabled, so builds are slow
npm run lint           # next lint (next/core-web-vitals). Run it yourself, because the build won't
npx tsc --noEmit       # quick type check
# full stack, from the repo root (../):
docker compose up -d --build          # needs ecom/.env, admin/.env, pos/.env to exist (env_file is not optional)
docker compose up -d --build -V ecom  # after dependency changes (anonymous /app/node_modules volume)
docker compose exec admin pnpm migration:run   # DB schema lives in admin
```

- **No tests.** There is no jest/vitest/playwright, no CI, no prettier and no husky. Verification is manual: `npx tsc --noEmit`, `npm run lint`, then click through `http://localhost:3030` in **vi and en**, as a guest and as a logged-in user.
- There is no `not-found.tsx`, `error.tsx` or `loading.tsx` anywhere, so a thrown page loader shows Next's default error page.
- **No migrations in ecom.** Schema changes are made in `../admin` (see §7 R1).
- Env keys are in `.env.example`. Its `// S3 configuration` line is not valid dotenv syntax. Never print the secrets hard-coded in `../docker-compose.yml`.

## 3. Directory structure

```
auth.ts                      next-auth config: providers, signIn/jwt/session callbacks -> { auth, handlers, signIn, signOut }
next.config.js               zone rewrites (/admin, /pos), images.unoptimized, eslint.ignoreDuringBuilds
app/
  layout.tsx                 the only layout: provider tree + Header/Footer/FloatingChatbot/<Toaster/>
  <route>/page.tsx           target: thin Server Component -> one client entry (cart, checkout, orders/[id],
                             guest/orders/[id], forgot/reset-password, products, home). account/{orders,addresses,
                             settings} and store-locations are 'use client' pages composing components/<feature>/*
  api/<plural-resource>/route.ts, [id]/route.ts, <action>/route.ts    route handlers (Node runtime)
  api/auth/[...nextauth]/route.ts   export const { GET, POST } = handlers
components/
  ui/                        shadcn primitives (+ custom formatted-currency, formatted-number, avatar-upload)
  common/                    quantity-selector.tsx, LoadOverlay.tsx (exports LoadingOverlay: import from '@/components/common/LoadOverlay')
  <feature>/                 kebab-case files, *-types.ts, index.ts barrel; *-page-content.tsx entry only in cart/, checkout/
                             (order/ uses order-detail-client.tsx, product/ uses *-page-client.tsx / product-detail-client.tsx)
  layout/{header,footer}.tsx features/chatbot/floating-chatbot.tsx
constants/  env.ts (env object) · const.ts (SITE_CONTENT, *_PAGE_CONTENT, MAX_CART_ITEM_QUANTITY) · index.ts barrel
hooks/      use-<feature>.ts controller hooks · use-toast.ts (the mounted toast store)
lib/
  auth/request-user.ts       getUserFromRequest() - the ONLY server identity helper
  contexts/*-context.tsx     global providers: language, auth, notification, rewards(mock), cart, setting(brand)
  database/typeorm.ts        AppDataSource (explicit entities array); ensureDataSource.ts
  database/entities/         <kebab>.entity.ts mirrors of admin tables + index.ts barrel (10 entities + base)
  services/                  <name>Service.ts (TypeORM, no HTTP) · <page>PageService.ts ('server-only' page loaders)
  httpclient/                base.ts (appendQueryParams) + <resource>.client.ts browser fetch wrappers
  product-pricing.ts         tier price resolution (client + server)   s3.server.ts / s3.ts   eventEmitter.ts (SSE bus)
  utils.ts                   barrel: cn, base64ToFile, removeEmptyProperties + utils.{currency,client,date,style,username,localStorage}
  utils.setting.ts           normalizeBrandSettings (not in the barrel)   utils.username.ts: checkUsernameType, addressToString
  brand.ts                   default brand settings (overridden by admin settings)
locales/    <area>.ts -> { 'prefix.key': { en, vi } }
types/      <domain>.interface.ts (I-prefixed), enums.ts, setting-definition.ts, nav.interface.ts (Language = "en"|"vi"),
            index.ts barrel (@/types; batch.interface.ts is not re-exported)
public/     also serves admin's root-relative assets (app-logo.png, placeholder.svg): keep them
mock-data/, lib/mock-data/, lib/types.ts   legacy mocks/types (see §8)
```

## 4. Architecture and data flow

**Layers.** Page (Server Component) → client entry component → hook (`hooks/use-x.ts`) or context → `lib/httpclient/x.client.ts` → `app/api/x/route.ts` → `lib/services/xService.ts` → `AppDataSource.getRepository(XEntity)` / QueryBuilder → shared Postgres. There are no server actions, no DI and no repository classes.

**Read path A: public, SEO pages (products, home, product detail).**
1. `app/products/page.tsx` awaits `searchParams` (a `Promise`), exports `metadata`/`generateMetadata`, and calls `getProductsPageData(searchParams)` from `lib/services/productsPageService.ts`.
2. That page service does `'server-only'` → `ensureDataSource()` → `unstable_cache` (tags `products-page`/`collections`/`products`, 60–300 s) → explicit `mapXForClient` DTO mappers. On error it **logs and rethrows** (no fallback, and there is no `error.tsx`).
   - Nothing calls `revalidateTag`, so admin edits show up only after the TTL expires.
   - `getAllProducts` defaults to `limit = 20` and the page has no pagination, so the catalog shows at most 20 products.
   - `app/page.tsx` uses `export const revalidate = 300` + `homePageService.ts`. That service returns an empty fallback on error and serializes whole entities with `JSON.parse(JSON.stringify())`, with no mapper.
   - `app/products/[id]/page.tsx` has no page service. It calls `getProductById` inside React `cache()` so `generateMetadata` and the page share one query, then `notFound()` if missing.
3. It renders a `*-page-client.tsx` with the plain data as props. Filters live in the URL: `router.replace(..., { scroll: false })` inside `startTransition`, with `isPending` dimming the results (`components/product/products-page-client.tsx`).

**Read/write path B: account, cart, checkout, notifications (client-fetched).**
- Thin page → `'use client'` `*-page-content.tsx` → `hooks/use-x.ts` (state, `useEffect(() => { if (user) fetchX() }, [user])`, handlers, toasts) → `apiVerbNoun()` → route → service.
- All mutations go through `/api/*` route handlers.

**Critical rendering gotcha.** `CartProvider` returns `null` until mounted (`lib/contexts/cart-context.tsx`), so **the SSR HTML body of every page is empty**. Only `<head>` metadata is server-rendered, and even the product JSON-LD in the body is client-rendered. Put SEO in `metadata`/`generateMetadata`. Reading `localStorage` during render works only because of this.

**Provider order (a dependency chain, do not reorder).** `LanguageProvider > AuthProvider > NotificationProvider > RewardsProvider > CartProvider > SettingProvider` in `app/layout.tsx`. `useAuth/useCart/useLanguage/useNotification/useRewards` throw outside their provider. `useBrand()` returns the defaults from `lib/brand.ts`.

**Auth.**
- `auth.ts`: Credentials `authorize` finds `UserEntity` by exact `username`, compares with bcryptjs and updates `lastLogin`.
- Google `signIn` finds the user by **email**. If there is none, it creates `UserEntity` (`username=email`, `password=""`, `role=customer`) plus a `CustomerEntity` **with the same id**, in one transaction.
- `jwt` copies `user.id` into `token.id`, and `rememberMe` sets the expiry to 7 days (otherwise 1 day). Whether this overrides Auth.js `maxAge` is unverified.
- **The session only carries the default user plus `id`.** Role and customer are not in it, and there is no `next-auth.d.ts` augmentation.
- Server: `const user = await getUserFromRequest()` (`lib/auth/request-user.ts`, wraps `await auth()`) → `{ id } | null`. **Always take identity from this, never from query or body.**
- Client: `useAuth()` → `{ user: IUser (with customer), login, register, loginWithGoogle, logout, updateProfile, isLoading }`. After the session resolves, the profile is loaded via `/api/auth/me` together with `GET /api/notifications/settings`. That second call **lazily creates the user's `notification_settings` row**, and notification list/unread queries throw "Settings not found" without it.
- `user` is `null` and `isLoading` is `false` for a moment before `useSession()` resolves. **Do not treat `!user` as "logged out"** for redirects. Use `useSession().status === "unauthenticated"` from `next-auth/react`.
- There is **no `middleware.ts`**. `AuthProvider` only redirects `/login` and `/register` to `/` when logged in, and exactly `/account` to `/login` when `!user`. That check fires before the session resolves, so it can bounce a logged-in refresh; don't copy it. Other account pages use `if (!user) return null`.
- Sessions are **not shared** with admin (admin uses its own JWT cookie `token`). The same `users` credentials work in both apps, but the user logs in to each separately.
- Admin and staff users can log into the storefront, because `authorize` checks neither `active` nor `role`.
- There are no roles or page permissions in ecom. "Permission" means a session check plus scoping every query by `user.id`.

**Guest flow.**
- `localStorage["ecom_customer"]` holds the guest `ICustomer` with a uuid (`lib/utils.localStorage.ts`). It is created on first load and renewed on logout.
- The guest cart lives in `localStorage["cart"]` and is **not merged on login**.
- Guest checkout creates a `guest-<uuid>` user and customer (or reuses the customer if that id exists), then redirects to `/guest/orders/:id?customerId=<uuid>`. The page ignores the query and sends `getLocalCustomer().id` to `GET /api/guest/orders/[id]?customerId=`, which has no session check and relies on the uuid staying secret.
- `/api/auth/register` "upgrades" the guest id into a real user.

**Shared DB, multi-zone implications.**
- Admin owns the schema, migrations, PG enum types and business side effects. ecom holds a **partial mirror** of 10 entities with `synchronize: false`. An ecom entity edit changes nothing in the DB.
- Admin's `OrderEntity` `@BeforeInsert/@BeforeUpdate` hooks (activity logs, stock-out on complete) **do not run for ecom writes**. ecom must never set `status = completed`.
- Tables ecom reads without an entity are reached with raw SQL. Example: `getPrimaryWarehouseId()` in `lib/services/orderService.ts` requires a row with `warehouses.main = true`, otherwise it throws "Primary warehouse not found".
- Invariant: **`customers.id === users.id === customers.user_id`** (a DB check constraint).
- ecom depends on these admin endpoints through the rewrite (relative URLs, no session): `POST /admin/api/auth/forgot-password` `{username,language,resetPath:"/reset-password"}`, `POST /admin/api/auth/reset-password` `{token,password}` (`lib/httpclient/auth.client.ts`), and `GET /admin/api/settings/type/brand` (`lib/httpclient/setting.client.ts` → `setting-context` → `normalizeBrandSettings`).
- **Reserved paths:** never create routes or `public/` files under `/admin*`, `/pos*`, `/admin-static`, `/pos-static`, because they would shadow the zones.
- Cross-zone links must be full page loads (`<a href="/admin">`), not `next/link`.
- All zones share one origin, so they **share cookies and localStorage**. The `language` key is shared with admin on purpose. New keys need the `ecom_` prefix.

**Realtime.** Services emit `notificationEmitter.emit('new_notification', {userId, payload})` **after the transaction commits**. `app/api/notifications/stream` opens an SSE stream, and the client subscribes with `EventSource` in `notification-context.tsx`, which closes on error and never reconnects. The bus is in-process only: it does not work across instances, and admin-created notifications never reach it.

**API inventory** (every route handler; ✗ = legacy identity or ownership hole, see §8):
- Session + scoped by `user.id`: `GET/POST/DELETE /api/carts`, `GET /api/orders` (returns only `result.data`), `GET/PUT(cancel) /api/orders/[id]`, `PUT /api/auth/change-password` (errorKey exemplar), `POST /api/upload-url`, `DELETE /api/delete-file` (✗ any object).
- Session optional: `POST /api/orders` (guest or user).
- No session: `POST /api/auth/register` (✗ trusts `userId`), `GET /api/guest/orders/[id]?customerId=`, and public reads `GET /api/products`, `/api/products/[id]`, `/api/collections`. **None of these three are called by the UI** (`product.client.ts`/`collection.client.ts` are dead), and `?status=` exposes non-active products.
- ✗ identity from query/body: `GET /api/auth/me?userId`, `GET /api/auth/user-stats?userId`, `GET/POST /api/addresses`, `GET /api/notifications?userId`, `/unread`, `PATCH /mark-all`, `GET /settings`, `GET /stream`.
- ✗ `[id]`/body id without an ownership check: `PUT/DELETE /api/addresses/[id]`, `PUT /api/profile/[id]`, `PUT/DELETE /api/carts/item` (body `cartItemId`), `PATCH /api/notifications/[id]/read`, `PUT /api/notifications/settings/[id]`.

## 5. Feature catalog

| Feature (route) | Business purpose | Main files |
|---|---|---|
| Home `/` | Hero, saleable collections carousel, 5 newest active products (ISR 300 s) | `app/page.tsx`, `lib/services/homePageService.ts`, `components/home/*`, `components/product/product-card.tsx` |
| Catalog `/products` | Search, collection filter (by collection `number`), price buckets, sort, grid/list; max 20 results, no pagination | `app/products/page.tsx`, `lib/services/productsPageService.ts`, `components/product/products-*.tsx`, `product-filter-content.tsx`, `productService.ts`, `collectionService.ts`, `product.entity.ts`, `collection.entity.ts` (`api/products`, `api/collections` exist but are unused) |
| Product detail `/products/[id]` | Gallery + preview, tier (wholesale) price table, quantity, add to cart, specs, JSON-LD | `app/products/[id]/page.tsx`, `components/product/product-detail-client.tsx`, `product-image-gallery.tsx`, `product-detail-table.tsx`, `lib/product-pricing.ts` |
| Cart `/cart` | Review and change quantities (0 removes), subtotal and tax | `components/cart/*`, `lib/contexts/cart-context.tsx`, `lib/httpclient/cart.client.ts`, `api/carts/**`, `cartService.ts`, `cart.entity.ts`, `cart-item.entity.ts` |
| Checkout `/checkout` | Guest or user order: saved address, receiver and delivery info, payment method info (COD/bank/MoMo). Voucher, points and terms sections are `hidden`, but `handlePlaceOrder` still calls the mock rewards functions | `components/checkout/**` (`checkout-constants.ts` = bank/MoMo accounts), `hooks/use-checkout.ts` (`mapCartItemsToOrderItems`), `lib/httpclient/order.client.ts`, `api/orders`, `orderService.ts`, `order.entity.ts`, `customer.entity.ts` |
| Order detail `/account/orders/[id]`, `/guest/orders/[id]` | Items, summary, delivery, support, reorder, cancel (the button shows only while `pending`, but the server does not check status). The review dialog is a TODO with no API, and the invoice button is `hidden` | `components/order/order-detail-client.tsx` (`isGuestView`), `components/order/order-detail/*`, `order-cancel-dialog.tsx`, `hooks/use-order.ts`, `api/orders/[id]`, `api/guest/orders/[id]` |
| Order history `/account/orders` | Debounced search, status filter, infinite scroll | `app/account/orders/page.tsx` (composition), `components/account/orders/*`, `hooks/use-orders.ts`, `lib/httpclient/order.client.ts`, `api/orders`, `orderService.ts#getOrders` |
| Account `/account` | Dashboard: profile summary, stats, recent orders, quick links | `app/account/page.tsx` (legacy), `hooks/use-account.ts`, `api/auth/user-stats` |
| Profile `/account/profile` | Name, phone, email, gender, avatar upload to S3 | `app/account/profile/page.tsx` (legacy), `hooks/use-profile.ts`, `components/ui/avatar-upload.tsx`, `lib/s3.ts`, `api/profile/[id]`, `api/upload-url`, `api/delete-file`, `lib/s3.server.ts` |
| Addresses `/account/addresses` | Delivery address CRUD with a default flag (dialog form) | `app/account/addresses/page.tsx`, `components/account/addresses/*`, `hooks/use-addresses.ts` (also used by checkout), `lib/httpclient/address.client.ts`, `api/addresses/**`, `addressService.ts`, `address.entity.ts` |
| Settings `/account/settings` | Change password (notification and privacy cards are `hidden`) | `app/account/settings/page.tsx`, `components/account/settings/*`, `hooks/use-account-settings.ts`, `lib/httpclient/user.client.ts#apiChangePassword`, `api/auth/change-password`, `userService.ts` |
| Notifications `/notifications` + header bell | List, unread count, mark one or all read, SSE realtime | `app/notifications/page.tsx`, `hooks/use-notification-page.ts`, `lib/contexts/notification-context.tsx`, `api/notifications/**`, `notificationService.ts`, `lib/eventEmitter.ts`, `notification{,-settings}.entity.ts` |
| Auth `/login`, `/register`, `/forgot-password`, `/reset-password` | Credentials (username = phone, email or plain) + Google; register upgrades the guest id; reset is delegated to admin | `auth.ts`, `lib/contexts/auth-context.tsx`, `app/login`, `app/register` (legacy), `components/auth/*-form.tsx`, `lib/httpclient/auth.client.ts`, `api/auth/**`, `user.entity.ts` |
| Brand settings (global) | Name, phone, address, map and social links from admin `settings` | `lib/contexts/setting-context.tsx` (`useBrand`), `lib/brand.ts`, `lib/utils.setting.ts`, `types/setting-definition.ts` |
| Store locations `/store-locations` | One hard-coded store (brand address/phone), embedded map. The features, services, offers and coming-soon cards are `hidden` | `app/store-locations/page.tsx` ('use client', `StoreLocation` from legacy `lib/types.ts`), `components/store-locations/*` |
| Mock / demo | `/account/rewards` (mock vouchers and points, hidden), `/batches/[id]` (same mock for every id), `/about`, `/contact` (unlinked, fake submit), floating "chatbot" (just contact links) | `lib/contexts/rewards-context.tsx`, `hooks/useBatchDetail.ts`, `mock-data/batch-detail.ts`: **do not extend without a backend** |
| Zone proxy `/admin/*`, `/pos/*` | Serves the ERP and POS zones from this origin | `next.config.js` |

## 6. Conventions (MUST follow)

**General**
- Use the `@/` alias. Relative `../database` imports in services are legacy.
- File naming by folder:
  - components, hooks, types, entities and locales use kebab-case (legacy exceptions: `LoadOverlay.tsx`, `useBatchDetail.ts`);
  - services use `camelCaseService.ts` / `<page>PageService.ts`;
  - utils use `lib/utils.<area>.ts`.
  - Use **named exports** everywhere except `page.tsx` (default).
- There is no formatter, and quote style is mixed even within folders. Match the file you edit. For a new file, match the exemplar you copied.
- Read app env only through `env` from `@/constants` (`constants/env.ts`). The exceptions are `ADMIN_URL`/`POS_URL` (read in `next.config.js`) and `AUTH_*` (read by next-auth itself). Client code only sees `NEXT_PUBLIC_*`, so non-public keys resolve to their fallback there (`''` for secrets). Never put secrets in `NEXT_PUBLIC_*`.
- Constants go in `constants/const.ts` (`as const`), re-exported by `constants/index.ts`.
- Server code imports specific util files (`@/lib/utils.currency`, `@/lib/utils.date`), never the `@/lib/utils` barrel. The barrel re-exports `"use client"` hooks and window-only helpers. `userService.ts` imports `removeEmptyProperties` from the barrel, which is legacy. If server code needs it, move it into its own util file.
- Add `'use client'` to any component or hook that uses hooks. Don't rely on the parent being a client component.

**Types (`types/`)**
- `types/<domain>.interface.ts` holds `export interface IX extends IBase` (all fields optional), and filters are `IXFilters extends IBaseFilters`. Re-export from `types/index.ts` and import from `@/types`.
- Enums live in `types/enums.ts` as string enums with lowerCamel members whose value equals the key (the one exception is `UserRole.super_admin`). **Values must match `../admin/types/enums.ts`**, because PG enum types are created by admin migrations. ecom holds a subset of them, and UI-only enums (`ViewMode`, `ProductSortBy`, `UsernameType`) live alongside.
- Because fields are optional, prefer `x ?? fallback` over `!` in new UI code.

**Entities (`lib/database/entities/<kebab>.entity.ts`)**
- Shape: `@Entity({ name: "snake_plural" }) export class XEntity extends BaseEntity implements IX`, importing `BaseEntity` from `@/lib/database/entities/base.entity`. Exemplars: `order.entity.ts`, `customer.entity.ts`.
- Type relations with interfaces (`import type { ICustomer } from "@/types"`) and reference classes only in `() => XEntity` (`NotificationSettingsEntity.user!: UserEntity` is the legacy exception). Use `?` on columns and relations, matching the optional interfaces. `!` is used inconsistently: the relations `CustomerEntity.orders` and `CollectionEntity.products` (and the jsonb column `OrderEntity.items`) use it, while the relations `addresses`, `cart.items` and `product.collections` use `?`. Use the section comments `//////Related fields//////` and `//////Auto numbering//////`.
- **Copy column decorators verbatim from the admin entity or migration** (`name`, `type`, `nullable`, `default`). DB column naming is mixed: snake_case with an explicit `name` (`tier_prices`, `sub_images`, `warehouse_id`, all FKs) alongside unnamed camelCase columns (`"totalAmount"`, `"isRead"`, `"userId"`). Never guess.
- Map relations to admin-only tables as plain FK id columns (`@Column({ name: "warehouse_id", type: "uuid", nullable: true }) warehouseId`), or use raw SQL. Never copy admin entities in.
- Register new entities in **both** `entities/index.ts` and the explicit `entities: [...]` array in `lib/database/typeorm.ts`.
- Numbering (`ORD-00001`, `CUS-`) uses `@BeforeInsert` → `new CommonService().getEntityNumber(XEntity, "ABC")`. The prefix must be exactly 3 characters. The helper is not concurrency-safe.

**Services (`lib/services/<camel>Service.ts`)**
- Plain `export async function verbNoun(...)` (exemplars `orderService.ts`, `cartService.ts`, `collectionService.ts`). The authenticated `userId` is a **required** parameter. Existing order varies (`addCartItem(userId, item)`, `getOrderByIdForUser(id, userId)`, `getOrders({ customerId, ... })`), so pick one and keep it. Do not add classes (the legacy `UserService`/`CommonService` must be constructed after `ensureDataSource()`) or `*Service` suffixes and arrow functions (`notificationService.ts` is legacy).
- Get repositories per call (`AppDataSource.getRepository(X)`), and use QueryBuilder with **named params** for filters, joins and pagination.
- **Scope every read and write by the authenticated user id**, joining `customer`/`user` for ownership (`getOrderByIdForUser`). `cancelOrder(id, userId?)` skips scoping when `userId` is omitted. Make it required in new code.
- Multi-table writes go in `AppDataSource.transaction(async (manager) => ...)`. Emit SSE events after commit.
- Notification dedup: set `deduplicationKey` (`order:<id>`, partial unique index `IDX_NOTIF_DEDUPLICATION`). Insert with `manager.createQueryBuilder().insert().into(NotificationEntity).values(...).orIgnore()` (`ON CONFLICT DO NOTHING`). **Don't copy `orderService`'s try/catch that swallows `23505` inside the transaction.** In Postgres, that error aborts the whole transaction, so the order would silently roll back.
- Pick fields explicitly. Never `Object.assign(entity, body)` or `{...data}` from the client.
- Whitelist `sortBy` against a const array before `orderBy`.
- Compute prices server-side with `lib/product-pricing.ts`.
- Expected failures: `throw new Error("SCREAMING_CODE")` (e.g. `INVALID_CURRENT_PASSWORD`), which the route maps to a status. Not-found returns `null`, and the route maps it to 404.
- Plain services do **not** call `ensureDataSource()`. Routes and page services call it first.
- Offset lists return `{ data, total, offset, limit, hasMore: offset + data.length < total }` (`getOrders`, `getAllNotificationsService`). `getAllProducts` is page-based (`{ data, total, page, limit }`), which is legacy.
- Log with a tag, and never log full customer or order payloads (PII): `console.error("[orderService.createOrder] failed", { orderId, error })`.
- Page services (`<page>PageService.ts`) do `import 'server-only'`, parse and whitelist params, call `ensureDataSource()`, optionally use `unstable_cache` with `tags`, **map every field the UI needs** into plain DTOs, and return an empty fallback instead of throwing. Take structure, param parsing and caching from `productsPageService.ts`, but note that it rethrows. Take the try/catch fallback from `homePageService.ts`, but note that it skips mappers.

**API routes (`app/api/<plural-resource>/...`)**
- Exemplars: `app/api/orders/[id]/route.ts` for structure (session before `try`, `RouteContext`, scoped service, 404), and `app/api/auth/change-password/route.ts` for `errorKey` and code→status mapping. `orders/[id]` still leaks `error.message` on 500 and uses PUT to mean cancel. `carts/route.ts` is only an example of a 204 DELETE, because its POST returns the `{status:2001}` anti-pattern.
- Handler order:
  1. `const user = await getUserFromRequest(); if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });` before `try`.
  2. `try { await ensureDataSource(); ... }`.
  3. Params: `type RouteContext = { params: Promise<{ id: string }> }` then `const { id } = await params`. Query: `new URL(req.url).searchParams`, numbers as `Number(x) || default`.
  4. Validate the body with zod (below).
  5. Call the service with `user.id`.
  6. Respond.
- **Response envelope.**
  - Success: the raw entity or DTO (200), 201 for create, `new NextResponse(null, { status: 204 })` for delete. New list endpoints return the full service envelope (`{ data, total, offset, limit, hasMore }`).
  - Errors: `{ errorKey: "<area>.<key>" }` for anything the UI shows (the key must exist in `locales/`), otherwise `{ error: string }`. Use 400 validation/business, 401, 404, 500. Only `change-password` uses `errorKey` today. It is the required convention for new routes, not the dominant existing one.
  - On 500, return a generic `{ errorKey: "<area>.error" }` / `{ error: "Internal server error" }` and log the details. Don't leak `error.message`.
- **Never return `UserEntity` raw.** Strip `password` and `passwordSalt`.
- **Validation (new convention, zod v3; no ecom route validates yet).** Co-locate `app/api/<resource>/<resource>.schema.ts` exporting `CreateXSchema` and `UpdateXSchema = CreateXSchema.partial()`, as admin's `../admin/app/api/orders/order.schema.ts` does. Admin's `products/product.schema.ts` spells out both schemas instead of using `.partial()`. Use `const parsed = CreateXSchema.safeParse(body)`, and on failure return 400 `{ error: "Invalid input", errorKey?, details: parsed.error.errors }` (admin `app/api/products/route.ts`). Use `z.nativeEnum` for enums and `z.string().uuid()` for ids. Parse JSON query params inside `try` with `safeParse`.
- Mutations use POST/PUT/PATCH/DELETE semantically. Non-CRUD actions go in `app/api/<resource>/<action>/route.ts` as POST. DELETE takes no body; put the id in the path.

**HTTP client (`lib/httpclient/<resource>.client.ts`)**
- Name functions `apiVerbNoun` (`apiGetWishlist`, `apiUpdateAddress`). The unprefixed names in `cart`, `product`, `collection`, `auth`, `setting` and `order#createOrder` are legacy.
- Use a relative URL and build GET queries with `appendQueryParams` (client-only, it uses `window`). Mutations send `headers: { "Content-Type": "application/json" }` and `body: JSON.stringify({ data })`. **Always** send `credentials: "include"`.
- Check `res.ok`: throw `new ApiLocaleError(data.errorKey || "<area>.error")` (from `lib/httpclient/user.client.ts`) when the route returns `errorKey`, else `throw new Error("<accurate message>")`. Never call `.json()` on a 204.
- Import clients by file path (most code does). The barrel `index.ts` only exports `base` and `auth.client`, which `f5951ba` added. Adding a new client there is optional. If you do, keep its functions `api*`-prefixed so they can't collide (`cart.client` exports `addToCart`/`clearCart`, the same names as the cart context).
- Admin endpoints are called as `/admin/api/...`, only for the public contracts listed in §4. They return `{ error: string }` with no `errorKey`, and `auth.client.ts#readAuthResponse` throws `Error(data.message || data.error)`. That is why `forgot-password-form.tsx` (`"Username does not exist"`) and `reset-password-form.tsx` (`"Invalid or expired reset token"`) match admin's English text. They are the only allowed cases of string matching.

**State: hooks and contexts**
- A feature hook `hooks/use-<feature>.ts` (`'use client'`) owns state, effects, API calls and toasts, and returns a flat object. The client entry destructures it. Exemplars: `use-checkout.ts`, `use-order.ts`, `use-orders.ts`.
- Handler shape: `try { setLoading(true); await apiX(); toast(...) ; update state } catch (e) { console.error(e); toast destructive } finally { setLoading(false) }`.
- Infinite scroll: copy `hooks/use-orders.ts`. It uses a callback-ref `loadMoreRef`, an `IntersectionObserver`, `INITIAL_LIMIT = 10` / `LOAD_MORE_LIMIT = 5` offsets, and a sentinel `<div ref={loadMoreRef}>` with `Loader2` (`components/account/orders/orders-list.tsx`). Because `GET /api/orders` drops the envelope, it guesses `hasMore = data.length === limit`. New lists should return the envelope and read `response.data`/`response.hasMore`, as `hooks/use-notification-page.ts` does.
- Debounce with `useDebounceSearchTerm(value, 500)` from `@/lib/utils.client`.
- A new global context uses the shared shape: `createContext<T | undefined>(undefined)`, a `XProvider`, and a `useX()` that throws outside the provider (`language-context.tsx`, `notification-context.tsx`). **Don't copy `cart-context.tsx`'s `if (!mounted) return null`.** Mount the provider inside the existing chain at the point after its dependencies. Most features need a hook, not a context.
- Use `useBrand()` for phone, email, address and social links, never the static `Brand` import.

**UI**
- Use shadcn primitives from `@/components/ui/*`, lucide icons, and `cn()`. Do not add UI libraries or regenerate `components/ui` casually, because they are shared-template copies.
- **Feature folder** contains:
  - `<f>-page-content.tsx`: the `'use client'` entry exported by name and rendered by a thin `page.tsx`. Only `components/cart/` and `components/checkout/` have one; the account pages keep this composition in a `'use client'` `page.tsx`.
  - `<f>-page-header.tsx`, `<f>-list.tsx` / `<f>-card.tsx`, `<f>-empty-state.tsx`, `<f>-error-card.tsx`;
  - `<f>-types.ts` for prop interfaces (existing names vary: `orders-page-types.ts`, `address-page-types.ts`, `checkout-types.ts`);
  - an `index.ts` barrel (`export * from './...'`) that also exports the page-content.
  - Copy the leaf components from `components/account/orders/` and the entry from `components/cart/cart-page-content.tsx`.
  - `components/account/*` and `components/store-locations/*` take `t` as a prop (`OrdersTranslator`). **In new components, call `useLanguage()` inside instead**, as cart/checkout/order/auth do.
- **Tables.** There are no data tables. Lists are card lists with infinite scroll. `ui/table` is only used for the product spec table. Don't add TanStack.
- **Forms.** Use a controlled `useState` object, controlled `Input`, `<form onSubmit>` with `e.preventDefault()`, manual checks, and `setError(t(...))` shown in an inline banner. Exemplars: `components/auth/reset-password-form.tsx`, `hooks/use-account-settings.ts`.
  - Field markup: `space-y-2` + `Label className="text-[#573e1c]"` ending in `" *"` for required fields, plus an icon-prefixed `Input className="pl-10 border-[#8b6a42] focus:border-[#573e1c]"`.
  - **Every non-submit button inside a form needs `type="button"`.**
  - Numbers and money inputs use `<FormattedNumber as="input">` / `<FormattedCurrency as="input">`. Quantity uses `<QuantitySelector>` (min 1, max `MAX_CART_ITEM_QUANTITY`).
  - react-hook-form is not used. Introducing RHF + zod would be a new convention, so state it and never mix both in one form.
- **Toasts.** Use `import { toast } from "@/hooks/use-toast"`. That store is the mounted Radix `<Toaster/>`, and `TOAST_LIMIT = 1`.
  - `toast({ description: t("order.detail.cancelSuccess") })`
  - `toast({ title: t("common.error"), description: t("..."), variant: "destructive" })`
  - **`toast` from `'sonner'` is silently dropped**, because sonner is not mounted (`auth-context`, `use-addresses`, `use-profile`, `use-account-settings`, `avatar-upload`). Switch those files to `@/hooks/use-toast` when you touch them.
- **Feedback.** Inline banners use `bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm` (error) or `bg-green-50 border-green-200 text-green-700` (success). Show `<LoadingOverlay loading={loading} />` for blocking operations and `Loader2 animate-spin` inline. Busy buttons get `disabled={isLoading}` and a swapped label.
- **Brand styling** uses hard-coded hex values, not theme tokens:
  - `#573e1c` primary brown, `#8b6a42` secondary, `#efe1c1` cream, `#d4c5a0` card border, `#f8f5f0` page background.
  - Page shell: `min-h-screen bg-[#f8f5f0]` > `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`.
  - H1: `text-3xl lg:text-4xl font-bold text-[#573e1c]`, with subtitle `text-[#8b6a42] mt-2`.
  - Card: `bg-white border-[#d4c5a0]`, with `CardTitle className="text-[#573e1c] flex items-center"` plus an icon `w-5 h-5 mr-2`.
  - Primary button: `bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]`.
  - Outline button: `variant="outline" className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"`.
  - Back link: `Button asChild variant="ghost"` wrapping `<Link><ArrowLeft className="w-4 h-4 mr-2"/>`.
  - Layout: `grid grid-cols-1 lg:grid-cols-3 gap-8`, with the sidebar summary `sticky top-24`.
- Status badges use `<Badge className={getOrderStatusColor(s)}>`, and all color maps live in `lib/utils.style.ts`.
- Images: `images.unoptimized`, so S3 URLs work in `next/image` or `<img>`. Fall back to `<ImageIcon className="text-gray-400"/>`.
- Disabled features are shipped with Tailwind `hidden`: checkout vouchers, points and terms; notification/privacy settings cards; the rewards nav and dropdown item; the order invoice button; and the store-locations features, services, offers and coming-soon cards. Leave them alone unless asked.

**i18n (custom `LanguageContext`, no library)**
- **Every user-facing string goes through `t()`** from `const { t } = useLanguage()`, called inside the component. All `components/account/*` and `components/store-locations/*` receive `t` as a prop, and many hooks return `t`. That is legacy; don't add new `t` props.
- The one exception is server-rendered SEO copy, which is Vietnamese-only constants in `constants/const.ts` (`SITE_CONTENT`, `HOME_PAGE_CONTENT`, ...).
- Locale file shape: `locales/<area>.ts` exports `<area>Translations = { '<prefix>.<path>': { en: '...', vi: '...' } }`. Both `en` and `vi` are required (tsc enforces this through the `Translations` type when the file is spread in), and `vi` needs proper diacritics.
- **A new locale file must be imported and spread in `lib/contexts/language-context.tsx`.** Missing keys render the raw key, and a later spread silently overrides duplicate keys, so search for a key before adding it.
- Prefixes by file:
  - `nav.` (`nav.ts`), `common.`, `home.`, `account.`, `product.` (singular, in `products.ts`), `cart.`, `checkout.`, `auth.`, `batch.`, `chatbot.`, `footer.`;
  - `order.` and `payment.method.*` in `order.ts`; `noti.` in `notification.ts` (`notiTranslations`);
  - `rewards.` plus `checkout.voucher/points.*` in `rewards.ts`;
  - `store.`, `contact.` and most `about.` keys in `store.ts`. `about.ts` redefines the 9 `about.values.*` keys and wins because it is spread later.
  - A new area gets a new unique prefix and its own file.
- Dynamic enum keys: `account.status.<OrderStatus>`, `product.unit.<ProductUnit>`, `product.sort.<ProductSortBy>`, `payment.method.<PaymentMethod>`, `account.gender.<Gender>`. **Adding an enum value means adding its keys.**
- `t()` has no params. Write `{placeholder}` in the string and call `.replace('{count}', String(n))` at the call site.
- Notifications store i18n key **suffixes** in `title`/`content` and render them as `t(\`noti.order.${title}\`)` with `{orderNumber}` taken from `data`. The render side is hard-coded to `noti.order.` in `header.tsx` and `app/notifications/page.tsx`.

**Money, numbers, dates, pricing**
- Money uses `formatCurrency(n)` → `"1,234,000 ₫"`, `formatLargeCurrency` for compact values, and `<FormattedCurrency>` in JSX. Quantities use `formatNumberWithCommas` or `<FormattedNumber>`. Compact values use `formatSystemNumber(n, language)` (Tr/Tỷ, M/B). Never write `$`, bare `toLocaleString()` or inline `Intl.NumberFormat`.
- Dates: `formatDate` → `dd-mm-yyyy`, `formatDateTime` → `dd-mm-yyyy, HH:MM:SS` (`lib/utils.date.ts`). The delivery slot uses `getNextBlockTime`. Don't use `toLocaleDateString('vi-VN')`.
- Tier pricing: `getProductPriceByQuantity(product, qty)` resolves `tierPrices` in `order`/`minQuantity` order, then `price`, then `unitCost`, then 0. The UI shows wholesale tiers with `tier.minQuantity > 1`. Display cart lines with `item.price ?? item.product?.price` and `item.subtotal ?? price * qty`.
  - Keep `lib/product-pricing.ts` in sync with `../admin/lib/product-pricing.ts`, which additionally has `normalizeTierPrices`.
- Tax: `env.NEXT_PUBLIC_TAX_RATE` (default `'0'`). The cart uses `parseFloat` but checkout uses `parseInt`. Unify both before the rate becomes non-zero. Shipping is always 0.

## 7. Recipes

**R1. Add or change an entity or column (the schema lives in admin)**
1. In `../admin`, follow `../admin/CLAUDE.md` R1:
   - change the admin entity;
   - `pnpm migration:run` so the DB is at head;
   - `pnpm migration:gen <PascalName>`, then review the SQL and strip unrelated drift;
   - `pnpm migration:run`.
   - Commit the entity and migration together (exemplar admin `78864fb`).
2. Here: mirror the columns into `lib/database/entities/<kebab>.entity.ts` with **identical** decorators (exemplar ecom `fdbe55f`: `tier_prices` jsonb in `product.entity.ts`). A new entity also needs `entities/index.ts` **and** the `entities` array in `lib/database/typeorm.ts`.
3. Update `types/<domain>.interface.ts` and `types/enums.ts` to match admin's values, and export new files from `types/index.ts`. Add i18n keys for new enum values (§6 i18n, dynamic enum keys).
4. Update every DTO mapper that feeds the UI. `productsPageService.ts#mapProductForClient` whitelists fields; `fdbe55f` forgot it, which is why catalog cards lack `tierPrices`. `homePageService.ts` and `app/products/[id]/page.tsx` serialize whole entities, so new columns reach them automatically. For order items, also update `IOrderItem` and `use-checkout.ts#mapCartItemsToOrderItems` (as in `ac816dc`).
5. Commit separately in ecom, on the same ticket (`#Refs AP-<n>`). Never add migrations here and never enable `synchronize`.

**R2. Add an API endpoint**
1. Service: add `lib/services/<name>Service.ts` with plain `export async function verbNoun(...)` taking a required `userId` (§6 Services). Copy `orderService.ts#getOrderByIdForUser` for ownership scoping. Throw `SCREAMING_CODE` errors and return `null` for not-found.
2. Schema: add `app/api/<resource>/<resource>.schema.ts` (zod `CreateXSchema` / `UpdateXSchema`).
3. Route: `app/api/<resource>/route.ts` or `[id]/route.ts`. Copy `app/api/orders/[id]/route.ts` for its structure and `app/api/auth/change-password/route.ts` for the `errorKey` mapping and the generic 500 (§6 API routes). Call `ensureDataSource()` first. For services that are classes, construct them after that call.
4. Client: `lib/httpclient/<resource>.client.ts` with `apiVerbNoun` and `credentials: "include"`. Copy `user.client.ts#apiChangePassword` for `ApiLocaleError` and `address.client.ts#apiUpdateAddress` for the `{ data }` body. Never send `userId`/`customerId`.
5. Add the `errorKey` values to `locales/<area>.ts` (R4).
6. Verify with the browser and `curl` as a guest (expect 401), as another user (expect 404), and as the owner. Then run `npx tsc --noEmit` and `npm run lint`.

**R3. Add a feature page with a menu entry and access control** (e.g. `/account/wishlist`)
1. Backend via R1 (if a table is needed; check `../admin` for an existing entity or service first) and R2.
2. Types: add `types/wishlist.interface.ts` (`IWishlistItem extends IBase`) and export it from `types/index.ts`.
3. Hook: add `hooks/use-wishlist.ts` (`'use client'`, `useLanguage`, `useAuth`, fetch effect gated on `user`, try/finally handlers, `toast` from `@/hooks/use-toast`). Copy `hooks/use-orders.ts` for lists (with the envelope fix from §6 State) or `hooks/use-order.ts` for details.
4. Components: add `components/account/wishlist/` with:
   - `wishlist-page-content.tsx` (`'use client'`, `if (!user) return null`, `<LoadingOverlay>`, the page shell from §6 UI). Take its composition from `app/account/orders/page.tsx` and its thin-entry form from `components/cart/cart-page-content.tsx`;
   - `wishlist-page-header.tsx`, `wishlist-item-card.tsx`, `wishlist-empty-state.tsx`, `wishlist-types.ts` (copy the leaves in `components/account/orders/`, but call `useLanguage()` instead of taking a `t` prop);
   - an `index.ts` barrel that includes the page-content.
5. Page: `app/account/wishlist/page.tsx` stays a Server Component: `import { WishlistPageContent } from '@/components/account/wishlist'; export default function WishlistPage() { return <WishlistPageContent />; }` (copy `app/cart/page.tsx`). For a public SEO page, add `metadata`/`generateMetadata` and a `'server-only'` `lib/services/<x>PageService.ts`, following `app/products/page.tsx`. Don't create routes under reserved paths (§4).
6. Access control: there are no roles or middleware. Protect data in the API (`getUserFromRequest` + scoping by `user.id`). To redirect guests, do it in the page-content with `const { status } = useSession()` and `if (status === "unauthenticated") router.replace('/login')`. Don't key it on `!user` and don't extend the `/account` check in `auth-context.tsx` (§4 Auth).
7. Menu (there is no route/menu registry; every entry is hand-written JSX in `components/layout/header.tsx`):
   - account dropdown: add a `DropdownMenuItem asChild` + `<Link href="/account/wishlist">` with a lucide icon `w-4 h-4 mr-2` inside the `user ? (...)` branch;
   - top nav (desktop and mobile): the `navigation` array in the same file, which is shown to everyone. For user-only mobile links, add a block next to the `{user && ...}` rewards link;
   - account dashboard quick links: the outline `Button asChild` + `Link` list in `app/account/page.tsx`;
   - the footer has no feature links.
   - Header label keys go in `locales/nav.ts` (`nav.wishlist`). Dashboard buttons use `account.*` keys (`account.manageAddresses`) in `locales/account.ts`.
8. i18n via R4. Check the brand classes (§6 UI), then run `npx tsc --noEmit` and `npm run lint`, and test in vi and en as a guest and as a user, including a hard refresh on the new page.

**R4. Add translations**
1. Existing area: add `'<prefix>.<key>': { en: '...', vi: '...' }` to the matching `locales/<area>.ts`, after searching for duplicates.
2. New area: create `locales/<area>.ts` exporting `<area>Translations`, then **import and spread it in `lib/contexts/language-context.tsx`**.
3. Add keys for every new enum value, and for any new notification title or content suffix (`noti.order.<suffix>`).

**R5. Add a notification type**
1. In the service, inside the transaction:
   - load `NotificationSettingsEntity` for the user and skip unless `orderEnabled` (or the matching type flag) and `inappEnabled` are set, as `createOrderWithCustomer` does (`cancelOrder` forgets this);
   - insert a `NotificationEntity` with `type`, `userId`, `title`/`content` as key suffixes, `data` for placeholders, `url`, and a `deduplicationKey`, using `.insert().orIgnore()` (§6 Services);
   - after commit, `notificationEmitter.emit('new_notification', { userId, payload })`.
2. Add `noti.order.<suffix>` keys to `locales/notification.ts`. A non-order type needs a new prefix **and** render support in both `components/layout/header.tsx` and `app/notifications/page.tsx`, which hard-code `noti.order.` and only replace `{orderNumber}`. `getAllNotificationsService`/`getUnreadCountService` only return `order` and `promotion` types.
3. Admin-created notifications will not arrive over SSE; they only show on refetch.

**R6. Upload a file**
1. Client: call `uploadFileToS3(file, "<folder>")` from `lib/s3.ts`. It returns the public URL string; store that. Copy `hooks/use-profile.ts#handleAvatarChange` (the avatar goes into `avatars/`).
2. The server presigns in `app/api/upload-url` via `lib/s3.server.ts`, with key `${S3_ROOT_PATH}/${pathname}/${Date.now()}-${filename}` where `pathname` comes from the client unchecked. The bucket is **shared with admin product images**, so validate content type and size and build a user-scoped folder server-side. Never delete by arbitrary URL.

## 8. Do NOT

- **Zone:** create routes or `public/` files under `/admin*`, `/pos*`, `/admin-static`, `/pos-static`; add a `basePath`; use `next/link` for cross-zone navigation; set `NEXT_PUBLIC_BASE_ZONE` to anything but an absolute URL (it feeds `new URL()` for `metadataBase`, fallback `SITE_CONTENT.defaultUrl`); delete `public/app-logo.png` or `placeholder.svg`, which admin uses.
- **Schema:** add migrations here, set `synchronize: true`, or run `typeorm migration:generate` from ecom (the partial mirror would produce destructive diffs); edit an ecom entity without the admin migration; add enum values only here; copy admin entities or their hooks; set `orders.status = completed` from ecom (no stock-out and no activity log would happen).
- **Security (legacy offenders, never copy):**
  - identity from `?userId=` / `?customerId=` / body (`api/auth/me`, `api/auth/user-stats`, `api/addresses`, `api/notifications/*`, `notifications/stream`);
  - `[id]` routes without an ownership check (`api/profile/[id]`, `api/addresses/[id]`, `api/carts/item`, `api/notifications/[id]/read`, `api/notifications/settings/[id]`);
  - mass assignment (`profileService.updateProfile`, `addressService.updateAddress`); `/api/auth/register` trusting a client `userId`; the guest order trusting `data.customer.id`;
  - returning `UserEntity` with `password`/`passwordSalt` (`api/auth/me`, `api/profile/[id]`);
  - client-computed `totalAmount`/`unitCost`/`status` accepted as-is by `createOrder*`; unwhitelisted `sortBy` interpolation (`productService.getAllProducts`);
  - `/api/delete-file` deleting any object in the shared bucket; `/api/upload-url` building the S3 key from a client `pathname`;
  - public `GET /api/products?status=` returning non-active products;
  - verbose PII `console.log` (`orderService.ts`).
  - If you touch one of these files, fix the pattern in that file, mention it in the commit, and keep the fix scoped.
- **Known bugs, don't propagate them:**
  - `addressService.updateAddress` clears the default flag of every customer's addresses (no customer filter);
  - `mapProductForClient` drops `tierPrices`/`subImages`;
  - `getProductById` has no status filter;
  - `carts.total_quantity/total_price` are never recomputed, so compute totals from the items;
  - `address-form.tsx` has an `onSubmit` without `preventDefault` and a Cancel button without `type="button"`;
  - the `muteUntil` check in `getAllNotificationsService`/`getUnreadCountService` (any non-null value mutes forever, and only `getNotificationSettingsService` clears expired values);
  - `cancelOrder` never checks `status === pending`, so any status can be cancelled over the API. Its notification also ignores the user's settings and has no `deduplicationKey`;
  - `orderService` swallows `23505` inside the transaction (§6 Services);
  - `use-addresses.handleSaveAddress` shows the "must fill" toast but saves anyway;
  - `use-order.ts` uses `common.somethingWentWrong`, which does not exist;
  - `AuthProvider` redirects `/account` before the session resolves (§4 Auth);
  - `collection.client.ts#getCollectionById` calls a route that does not exist.
- **API shapes:** fake status in the body (`{status:2001}`); a JSON body on DELETE; `PUT` meaning "cancel"; unguarded `JSON.parse` of query params; a plain `throw new Error("X not found")` that becomes a 500; string-matching English error messages from ecom routes on the client, which should use `errorKey` (the admin auth forms in §6 HTTP client are the only exception); discarding the pagination envelope (`GET /api/orders`).
- **UI legacy:**
  - whole-page `'use client'` pages with inline UI (`app/login`, `app/register`, `app/account/page.tsx`, `app/account/profile`, `app/account/rewards`, `app/about`, `app/contact`, `app/notifications`). The `'use client'` composition pages (`app/account/{orders,addresses,settings}`, `app/store-locations`) are acceptable to edit, but new pages use a thin server `page.tsx`;
  - `t` passed as a prop; `toast` from `sonner`; hard-coded English (`batch-detail-client.tsx`); static `Brand` imports (`order-support-card.tsx`);
  - inline `Intl.NumberFormat`/`toLocaleDateString`/`toLocaleString` (`order-detail-header.tsx`, `loyalty-points-section.tsx`, `app/account/page.tsx`, `app/account/rewards`);
  - mock contexts (`rewards-context.tsx`) extended as if real; new `lib/types.ts` or `lib/mock-data` entries;
  - `JSON.parse(JSON.stringify())` where an explicit mapper is feasible.
- **Tooling:** use pnpm or yarn; assume the build lints; rely on transitive deps (`uuid` and `dotenv` are imported but only arrive through `typeorm`, so declare them in `package.json` if you touch them; `server-only` is not in the lockfile at all and resolves through Next's built-in alias); commit `.env`; name agent docs `AGENTS.md` or `.agent/skills/<name>/SKILL.md`, which `.gitignore` excludes (use `CLAUDE.md`).
- **Ops:** don't "fix" the `ensureDataSource` concurrency race or the `ssl.rejectUnauthorized:false` (required for Neon) as a side effect of a feature. Don't print secrets from `../docker-compose.yml`.

## 9. Git conventions

- **Commit subject:** `<type>: <lowercase summary>. #Refs AP-<n>`. GitHub squash-merge appends ` (#<PR>)`.
  - Types seen in ecom: `feat` (most), `fix`, `hotfix`, `enhance`, `launch`. Admin and root also use `refactor`, `build`, `chore` and `doc`.
  - Real ecom examples:
    - `feat: implement price base on quantity. #Refs AP-108 (#34)`
    - `feat: sync logic to admin app. #Refs AP-127`
    - `feat: implement forgot password. #Refs AP-119`
    - `feat: implement ecom notifications system. #Refs AP-102`
    - `enhance: homepage UI UX smoothly`
    - `fix: format number with commas`
    - `launch: MVP 20260615`
  - Always include the ticket when one exists. The bolt-era "Updated page.tsx" subjects are noise.
- **Branches:**
  - Feature branches: `AP-<n>-<kebab-desc>` (e.g. `AP-119-implement-forgot-password-for-web-ecom`, `AP-127-order-pages-enhancement`).
  - Other ecom patterns: `hotfix-*` (`hotfix-mvp-20260607`), `launch-mvp-YYYYMMDD`, `YYYYMMDD-sync-prod` (`20260722-sync-prod`). Admin uses `release-YYYYMMDD`.
  - `dev` and `main` have diverged, so confirm the base branch with the user before branching.
  - PRs are squash-merged. Commit only when asked.
- **Submodule:** this app is the submodule `ecom/` (repo `RobertVo93/ap-phat-ecom`, `branch = main`) of the root `anphat` repo. Commit and push here first. After the change is on ecom `main`, run `git submodule update --remote --merge ecom` in the root (it tracks `main`, not your feature branch), then `git add ecom` and commit `chore: bump submodules`.
- **Cross-app work:** one ticket, with a separate branch and PR in each repo (AP-108: admin `#66`, ecom `#34`). Admin's schema change lands first. The ecom mirror or port (entity columns, enums, `product-pricing.ts`, order-item shape, as in `ac816dc`) goes in its own ecom commit with the same `#Refs AP-<n>`.
