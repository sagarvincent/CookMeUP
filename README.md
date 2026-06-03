# Mise & Plate — CookMeUP

A recipe, pantry, and live cooking app. The frontend is a fully layered React/Vite SPA. This document maps every UI feature to the backend service that needs to be built.

---

## Getting Started

### Frontend only (mock data — no API required)

```bash
cd UI && npm install && npm run dev
```

Runs on `http://localhost:5173`. Auth is bypassed; mock data is loaded in-process.

### Full stack (auth service + frontend)

```bash
# Option A — Docker (recommended)
docker-compose -f docker-compose.dev.yml up

# Option B — manually
cd API/auth && npm install && node src/index.js   # API on :3001
cd UI       && npm run dev:cluster                # frontend on :5173
```

### Frontend build modes

| Command | Env | Data source |
|---|---|---|
| `npm run dev` / `npm run dev:local` | `dev_local` | Mock files bundled in-process |
| `npm run dev:cluster` | `dev_cluster` | `GET /data/bootstrap` from `VITE_API_BASE` |
| `npm run build` | `production` | `GET /data/bootstrap` from `VITE_API_BASE` |

---

## Backend

### What's live

| Service | Location | Status |
|---|---|---|
| Auth & Identity | `API/auth/` | ✅ Built |

**Stack:** Node.js · Express · SQLite (`better-sqlite3`) · JWT HS256 · bcrypt

**Databases:** `Databases/Auth/init.sql` (users, refresh tokens) · `Databases/Profile/init.sql` (user preferences)

**Demo credentials:** `demo@mise-and-plate.com` / `password123`

### Auth endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create account → `{ accessToken, refreshToken, user }` |
| POST | `/auth/login` | — | Sign in → same |
| POST | `/auth/refresh` | — | Rotate refresh token |
| POST | `/auth/logout` | Bearer | Revoke refresh token |
| GET | `/users/me` | Bearer | Current user profile |
| GET | `/users/me/preferences` | Bearer | Load onboarding prefs |
| PUT | `/users/me/preferences` | Bearer | Save onboarding prefs |
| GET | `/data/bootstrap` | — | All seed data in one shot |

### API environment variables

```bash
PORT=3001
ACCESS_TOKEN_SECRET=...      # change in production
REFRESH_TOKEN_SECRET=...     # change in production
ACCESS_TOKEN_TTL=900         # 15 min
REFRESH_TOKEN_TTL=2592000    # 30 days
CORS_ORIGIN=http://localhost:5173
AUTH_DB_PATH=../../data/auth.db
PROFILE_DB_PATH=../../data/profile.db
```

See `API/auth/.env.example` for all variables.

---

## Frontend Architecture

```
UI/src/
├── App.jsx                      L1 — routing, auth gate, shared state
├── components/screens/          L1 — thin JSX shells
├── layers/L2_business/          L2 — React hooks (useAuth, useHome, …)
├── layers/L3_composite/         L3 — pure composite functions
├── layers/L4_primitives/        L4 — pure single-purpose utilities
└── services/                    data loading + auth API client
```

---

## Backend Services

---

### 1. Authentication & Identity

Account creation & login, session management (JWT / OAuth), load user profile on boot.

- `POST /auth/register` — email + password signup
- `POST /auth/login` → returns token
- `POST /auth/refresh` — refresh session
- `GET /users/me` — load profile on app boot
- `PUT /users/me/preferences` — save Onboarding form (diet, allergies, skill, spice default, calorie target, cuisine picks, kitchen equipment)
- `GET /users/me/preferences` — restore so sliders start at user's saved values

---

### 2. Recipe Catalogue

Browse, search, filter, sort — the Home screen and recipe cards.

- `GET /recipes` — paginated list; query params: `q`, `cuisine`, `course`, `diet`, `sort`, `page`
- `GET /recipes/:id` — full recipe detail (ingredients, steps, macros, history)
- `GET /recipes/featured` — the Editor's pick hero card
- `GET /recipes/random?{filters}` — "Surprise me" button
- Admin CRUD for recipe content (`POST`, `PUT`, `DELETE /recipes`)

---

### 3. Recipe Interactions

Save, review, rate, and log cooks — Profile screen, heart button on cards.

- `POST /recipes/:id/save` / `DELETE /recipes/:id/save` — bookmark toggle (heart button)
- `GET /users/me/saved-recipes` — saved recipe list
- `POST /recipes/:id/cook-log` `{ date, note, rating }` — log a completed cook
- `GET /recipes/:id/cook-logs` — user's own cook history (ProfileScreen history card)
- `GET /recipes/:id/reviews` — community notes (ProfileScreen community section)
- `POST /recipes/:id/reviews` `{ text, stars }` — submit a review

---

### 4. Pantry / Inventory

Full CRUD on the user's pantry — the Inventory screen.

- `GET /pantry` — full inventory list
- `POST /pantry` `{ name, qty, unit, category, expires }` — add item
- `PUT /pantry/:id` — edit item
- `DELETE /pantry/:id` — remove item
- `PATCH /pantry/:id/qty` `{ delta: ±0.5 }` — the inline ± buttons
- `POST /pantry/bulk-import` — "Bulk import" button (CSV or JSON)
- `POST /pantry/decrement` `[{ name, qty }]` — batch-decrement after a cooking session completes

---

### 5. Shopping List

Shortfall list derived from diet plan minus pantry; tick-off persistence; send to phone.

- `GET /shopping-list` — server computes: diet plan recipes − on-hand quantities, grouped by ingredient
- `PATCH /shopping-list/:ingredient/check` / `uncheck` — persist tick-off state
- `POST /shopping-list/send` — "Send to phone": triggers SMS or push notification with the list

---

### 6. Diet Plan

Weekly meal planner — the Diet Plan screen.

- `GET /diet-plan?week=2026-W23` — load the user's plan for a given ISO week
- `PUT /diet-plan?week=2026-W23` — save a full week `{ Mon: { Breakfast: recipeId, … }, … }`
- `PATCH /diet-plan/:week/:day/:meal` `{ recipeId }` — swap a single slot
- `GET /users/me/macro-targets` / `PUT /users/me/macro-targets` — save kcal/protein/macro goals + preset (High protein / Low carb / Mediterranean)
- `POST /diet-plan/auto-fill?week=...` — "Auto-fill week": server generates plan from user preferences + pantry availability
- `GET /diet-plan/calendar-export?week=...&format=ical` — "Send to calendar": returns `.ics` file

---

### 7. Cooking Session

Step tracking, timer persistence, auto-log on completion — the Cooking screen.

- `POST /cooking-sessions` `{ recipeId }` — start a session
- `GET /cooking-sessions/:id` — resume (returns last `stepIdx`, elapsed time)
- `PATCH /cooking-sessions/:id/step` `{ stepIdx, completedAt }` — mark a step complete
- `POST /cooking-sessions/:id/complete` — end session → auto-creates a cook-log entry on Recipe Interactions service
- `DELETE /cooking-sessions/:id` — abandon session

---

### 8. AI / Cooking Assistant

Text search, voice, photo intake, live cooking chat, snap analysis.

| Frontend trigger | Endpoint | Model |
|---|---|---|
| Text query ("something cosy with rice") | `POST /search/recipes` `{ query }` | Embedding search + intent extraction |
| Voice "Stop & send" | `POST /asr/transcribe` `{ audio: blob }` → text | Whisper / ASR |
| Photo drop / "Cook this dish" | `POST /vision/identify-dish` `{ image }` → `{ recipeId, dishName }` | Vision LLM |
| Cooking chat message | `POST /cooking-sessions/:id/messages` `{ text }` → streamed reply | Claude API (recipe + step context) |
| "Snap" button mid-cook | `POST /cooking-sessions/:id/snap` `{ image }` → `{ label }` | Vision model reading pan state |

---

### 9. Media / Asset Service

Recipe images, user uploads, avatars — everything behind the `<ImageSlot>` placeholders.

- CDN URLs on every recipe object — `image`, `thumbnailUrl` fields
- `POST /media/upload` `{ file }` → returns CDN URL — used by: Snap during cooking, photo intake
- Auto-generate 4:3 card crop + portrait crop for Profile screen
- Avatar images for community review cards

---

### 10. Notifications

Shopping list delivery, expiry alerts, cooking reminders.

- `POST /notifications/subscribe` `{ deviceToken, platform }` — register for push (FCM / APNs)
- `POST /notifications/shopping-list` — trigger "Send to phone" delivery
- **Cron**: daily pantry scan → push alert when items expire within 3 days
- **Cron**: cooking session timeout → push "Resume cooking?" if session open and user idle > N minutes

---

## Build Order

```
1. Auth                  → gates everything
2. Recipe Catalogue      → needed by every other screen
3. Pantry                → needed by Shopping List + Cooking Session
4. Diet Plan             → needed by Shopping List
5. Shopping List         → depends on Pantry + Diet Plan
6. Cooking Session       → depends on Recipe Catalogue + Pantry
7. Recipe Interactions   → depends on Recipe Catalogue + Cooking Session
8. AI Service            → depends on Recipe Catalogue + Cooking Session
9. Media                 → depends on Cooking Session + AI Service
10. Notifications        → depends on all
```

**First API endpoint the frontend actually calls:** `GET /data/bootstrap` — returns all seed data in one shot on app load: `{ recipes, inventory, cuisines, courses, diets, dietTargets, assistantLines }`. Wire this up before anything else to cut the mock data dependency.
