# Hostel HelpMe — Frontend

React frontend for Hostel HelpMe, a hostel management platform for **students**, **wardens** and **college admins**.
The backend (Node/Express/MongoDB) does not exist yet. This app runs fully on an isolated mock layer and is built so the
real API can be connected without touching UI code.

**Current status: Phase 3 — Student module** (on top of Phase 1 foundation and Phase 2 authentication). Students have a working
dashboard, complaints (with evidence upload, AI-suggestion display and status timeline), room-change requests, notices, fees,
mess, rules and profile, all on a mock backend. Warden and Admin modules (other than warden verification) are still placeholders.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build
```

Requires Node 18+. `.env.development` ships with mock mode on, so `npm run dev` works with no setup.
For other environments copy `.env.example` to `.env` and edit it.

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Backend base URL, e.g. `https://api.example.com/api` |
| `VITE_USE_MOCK` | `true` → services use `src/mock/`; `false` → services call the real API |
| `VITE_MOCK_LATENCY_MS` | Simulated latency for mock responses (default 400) |

## Authentication (Phase 2)

Sign-in is **college email or phone number + one-time code (OTP)** — there are no passwords.

```
Login (/login)  →  sendOtp  →  Verify (/verify-otp)  →  verifyOtp  →  session  →  dashboard for the user's role
Signup (/signup) → account created as "pending" → warden approves/rejects → approved users can sign in
```

**Service contract** (`src/services/authService.js`, identical for mock and real backend):

| Method | Request | Response `data` |
| --- | --- | --- |
| `sendOtp` | `{ method: 'email'\|'phone', identifier }` | `{ expiresInSeconds, resendAfterSeconds, devOtp? }` |
| `verifyOtp` | `{ method, identifier, otp }` | `{ token, user }` |
| `signup` | `{ name, email, phone, enrollmentNumber }` | `{ user }` with `status: 'pending'` |
| `getCurrentUser` | — (Bearer token) | `user` |
| `logout` | — | `null` |

`user` is `{ id, name, email, phone, role: 'student'\|'warden'\|'admin', status: 'pending'\|'approved'\|'rejected', enrollmentNumber? }`.
Warden verification uses `verificationService` (`getRegistrations`, `reviewRegistration`).

### How the mock behaves (`VITE_USE_MOCK=true`)
- **OTP:** no email or SMS is ever sent. Every code is **`123456`**. The mock returns it as `devOtp`, and the OTP screen shows a
  "Development mode" notice whenever `devOtp` is present. A real backend must never return `devOtp`.
  Resend is disabled for 30 seconds after each code.
- **Sessions:** the token (`mock-token.<userId>`) is stored in `localStorage` (`hostel-helpme.token`); on load the app calls
  `getCurrentUser()` with it, as it will with a JWT. An unknown or expired token signs the user out.
- **Data:** users, signups and approvals persist in `localStorage` (`hostel-helpme.mock.users`).
  Reset with `localStorage.removeItem('hostel-helpme.mock.users')`.
- **Authorization:** the mock rejects warden-only calls from other roles (403), as the real backend must.

### Development accounts
| Role | Status | Email | Phone |
| --- | --- | --- | --- |
| Student | approved | `aarav.sharma@college.edu` | `9876543210` |
| Warden | approved | `meera.iyer@college.edu` | `9876500001` |
| Admin | approved | `rohan.kapoor@college.edu` | `9876500002` |
| Student | pending | `ishita.verma@college.edu` | `9876500003` |
| Student | pending | `neha.gupta@college.edu` | `9876500005` |
| Student | rejected | `kabir.malhotra@college.edu` | `9876500004` |

### Route protection
| Situation | Result |
| --- | --- |
| Signed out, opens `/student/*`, `/warden/*` or `/admin/*` | Redirected to `/login`; after sign-in returns to that page if the role allows it |
| Signed in as role X, opens another role's routes | Redirected to role X's dashboard |
| Student whose status is `pending` or `rejected` | Held on `/account-status` until approved |
| Signed in, opens `/login`, `/signup` or `/verify-otp` | Redirected to their dashboard |
| `/verify-otp` opened without starting a sign-in | Redirected to `/login` |

Guards live in `src/routes/guards.jsx`. They are UX only — the backend must authorize every request.

### Testing the flow
1. `npm run dev`, open `/login`, sign in as the approved student (email or phone), enter `123456`.
2. Try a wrong code, then wait out the resend countdown. Log out from the user menu.
3. Sign in as the pending student: you land on `/account-status`, and `/student/*` stays blocked.
4. Sign in as the warden → **Verifications** → approve or reject; then sign in as that student.
5. Create a new account at `/signup`; it appears in the warden's Verifications list.

`/dev/components` remains available in development for previewing shared components.

## Student module (Phase 3)

All student pages follow the same path: **page → service → `withMock(mock, api)`**. Pages never import `src/mock/`.

| Route | Page | Service calls |
| --- | --- | --- |
| `/student/dashboard` | Overview: quick actions, complaint counts, room, room request, fee status, recent notices. Each card loads independently. | `complaintService.getSummary`, `studentService.getProfile`, `roomRequestService.getRequests`, `feeService.getMyFees`, `noticeService.getNotices` |
| `/student/complaints` | List with search + status/priority/category filters (`?status=` pre-selects) | `complaintService.getComplaints` |
| `/student/complaints/new` | Create form, 500-word limit, evidence uploader | `uploadEvidence`, `createComplaint` |
| `/student/complaints/:id` | Detail, AI suggestions, evidence, technician, resolution, timeline | `getComplaint` |
| `/student/room-request` | Current room, request form or open request, history | `roomRequestService.*`, `studentService.getProfile` |
| `/student/notices` | Hostel-wide and own-block notices, tab filter | `noticeService.getNotices` |
| `/student/fees` | **Display only** — there is no payment flow | `feeService.getMyFees` |
| `/student/mess` | Weekly menu (today preselected) and meal timings | `messService.getMenu` |
| `/student/rules` | Rule sections; anti-ragging shows "Coming soon" | `ruleService.getRules` |
| `/student/profile` | Read-only personal, account and hostel details | `studentService.getProfile` |

The expected request/response shape of every method is documented in the JSDoc at the top of its service file
(`src/services/*Service.js`); endpoint paths are in `src/services/endpoints.js`. Phase 7 turns these into `API_CONTRACT.md`.

**AI suggestions.** The backend is expected to return `complaint.ai = { suggestedCategory, suggestedPriority, priorityReason,
simplifiedDescription }` (or `null` while pending) and `priorityStatus: 'suggested' | 'confirmed'`. The UI always labels these as
suggestions; the warden decides. In mock mode `src/mock/ai.js` fakes this with a keyword heuristic — **there is no real AI**.

**Evidence upload.** `FileUploader` only selects, validates (type, size, count) and previews files. The page uploads each file through
`complaintService.uploadEvidence(file, { onProgress })` — expected to return `{ id, name, type, size, url }` — and then sends the
returned metadata with `createComplaint`. In mock mode nothing leaves the browser: images are stored as small thumbnails, videos as
metadata only. Limits live in `src/constants/complaints.js` (3 files, 20 MB each, JPG/PNG/WebP/MP4/WebM).

**Mock data.** Complaints and room requests persist in `localStorage` (`hostel-helpme.mock.complaints`,
`hostel-helpme.mock.roomRequests`); reset by removing those keys (and `hostel-helpme.mock.users` for accounts).
The seeded student *Aarav Sharma* has block B, room 301, five complaints in every status, one past (rejected) room request and a
part-paid fee. Other students have **no allocated room**, which exercises every empty state (e.g. approve *Ishita Verma* as the
warden, then sign in as her). To see "Under review" or "Approved" on a room request, edit its `status` in the
`hostel-helpme.mock.roomRequests` entry — only wardens can change it, and that UI is built in the Warden phase.

## Architecture

```
UI component / page
      ↓  calls
Service  (src/services/*Service.js)      ← only layer UI code talks to
      ↓  withMock(mockFn, realFn)
  ┌── mock  (src/mock/*)                  ← VITE_USE_MOCK=true
  └── http  (src/services/api.js, axios)  ← VITE_USE_MOCK=false → Backend
```

Rules:
- **Components never import axios or `src/mock/`.** They call services (usually through `useAsync`).
- **Mock data lives only in `src/mock/`.** Mock functions return the same unwrapped `data` shape as the real API and throw `ApiError` on failure.
- **Endpoint paths live only in `src/services/endpoints.js`.**
- **Design values live only in `src/styles/tokens.css`.** Components use variables, never raw colours.
- **Role-based UI is UX, not security.** Hiding navigation does not authorize anything; the backend must enforce access.

### API conventions (agreed for all endpoints)
```jsonc
// success
{ "success": true, "data": { }, "message": "optional" }
// error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "…", "details": { } } }
```
`api.js` unwraps `data` and rejects with `ApiError { message, code, status, details }`. It also sends
`Authorization: Bearer <token>` when a token exists (`utils/tokenStorage.js`), maps network/timeout failures to
`NETWORK_ERROR` / `TIMEOUT`, and exposes `setUnauthorizedHandler()` (AuthContext uses it to end the session on any 401).
List endpoints are expected to return `{ items, page, pageSize, total }`.
Full per-endpoint request/response documentation is produced in Phase 7 (`API_CONTRACT.md`).

### Adding a service method
```js
// src/services/complaintService.js
getComplaint: (id) => withMock(
  () => mock.getComplaint(id),
  () => http.get(`${ENDPOINTS.complaints.list}/${id}`),
),
```

## Project structure

```
src/
├── components/
│   ├── common/    Button, Card, Badge, StatusBadge, PriorityBadge, Alert, Modal, ConfirmationModal, Toast, Dropdown,
│   │              Tabs, Table, SearchBar, PageHeader, Brand, DescriptionList, Timeline, AsyncBoundary,
│   │              EmptyState, ErrorState, LoadingState (+Skeleton)
│   ├── forms/     FormField, Input, Select, Textarea, OtpInput, FileUploader
│   ├── layout/    AppShell, Sidebar, Header, AuthLayout
│   ├── dashboard/ student dashboard cards
│   ├── complaints/ ComplaintFilters, AiSuggestionPanel, EvidenceGallery
│   ├── notices/ roomRequests/  NoticeItem, RoomRequestCard
├── pages/         auth/ common/ dev/ student/ warden/ (admin/ is reserved for Phase 5)
├── routes/        AppRoutes.jsx, guards.jsx, pageRegistry.js
├── services/      api.js, ApiError.js, endpoints.js, withMock.js, auth/complaint/room/notice/fee/mess services
├── mock/          mock implementations used by services only
├── context/       ToastContext.jsx, AuthContext.jsx
├── hooks/         useAsync, useAuth, useCountdown, useFocusTrap, useDebounce
├── constants/     roles, navigation, status, hostel
├── config/        env.js (the only reader of import.meta.env)
├── styles/        tokens.css, base.css, components.css, layout.css
└── utils/         cn, format, tokenStorage
```

### Navigation and routes
`constants/navigation.js` defines each role's nav items once; the sidebar **and** the route table are generated from it.
To build a page, add it to `routes/pageRegistry.js` (`student: { complaints: StudentComplaintsPage }`). Anything not
registered renders `PlaceholderPage`.

| Role | Routes |
| --- | --- |
| Public | `/login`, `/signup`, `/verify-otp` |
| Signed in, not approved | `/account-status` |
| Student | `/student/` dashboard, complaints, room-request, notices, fees, mess, rules, profile |
| Warden | `/warden/` dashboard, verifications, students, complaints, rooms, room-requests, notices, mess, profile |
| Admin | `/admin/` dashboard, fees, academic-year, settings, profile |

### Responsive behaviour
Sidebar is fixed at ≥1024px; below that it is a slide-in drawer with focus trap, Escape/scrim to close, and scroll lock.
`Table` turns each row into a labelled stack under 720px. Controls grow to 44px touch targets on coarse pointers.
`prefers-reduced-motion` disables animation.

## Not implemented yet
Warden modules beyond verification (Phase 4) · admin modules (Phase 5) · `Pagination`, `FilterBar` (Phase 4) ·
`API_CONTRACT.md` (Phase 7). Student lists are not paginated yet (the mock returns everything).
