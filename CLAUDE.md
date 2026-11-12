# Helpdesk tickets (ip1-e20230105)

Memory for this repo. Read this first, then `docs/SPEC.md` for the full rules. Update this file when a screen, route, store, or scope choice changes.

Course: Internet Programming 1. Student id: `e20230105`. Repo: https://github.com/SunSovisal/ip1-e20230105. Last updated: 2026-11-12.

## Memories

- The app is a helpdesk. Three roles: `REQUESTER`, `AGENT`, `ADMIN`. One shell for every signed-in role. Admin-only controls sit inside screens, not in a second layout.
- A visitor who registers is always a requester. The register form has no role field.
- The course spec seeds agent and admin accounts, and a visitor cannot register as either. This prototype also lets an admin turn a requester into an agent on `/staff`. Keep that screen. It is an extra admin action on top of the spec, not a replacement for the future seed.
- Sign in and Register have no app bar. The bar belongs only to a signed-in session. After Sign out, the app must open the route named `login`. There is no route named `logout`. Pushing `logout` clears the user, hides the bar, and leaves the ticket page on screen.
- Logout clears `localStorage` before the redirect. The guard reads `readSession()`, not the Pinia ref. If the session is still stored, a visit to `/login` bounces back to `/tickets`.
- Props go down, events go up. Views own drafts, field errors, and the open ticket. Pinia holds data that more than one screen shares. Services own the mock lists, so a later API can replace the service without rewriting the views.
- Mock passwords are plain strings in `localStorage`. That is only the frontend prototype. The real API hashes passwords, returns a JWT, and never sends `passwordHash` back.
- Do not start the NestJS API, Prisma schema, or change-password screen until that task is asked for. The frontend still stands in for the backend.

## Scope

Source of truth: `PROPOSAL.md`, `docs/SPEC.md`, `DECISIONS.md`, `MILESTONES.md`, `docs/style.md`, `docs/components.md`, `docs/wireframes/`.

### Product

People ask for support and follow what happened. Staff share one queue: assign, answer, and close. A ticket has one category from a category tree, any number of tags from a separate tag tree, and an optional area such as `J609`.

| Role | Can do |
|---|---|
| Requester | Register, sign in, create a ticket, list and filter their own tickets, open a ticket, edit it while it is open, post a public comment |
| Agent | Everything a requester can do on any ticket, plus the inbox, assign, close, reopen, public replies, internal notes, edit or hide any comment, and maintain category and tag trees |
| Admin | Everything an agent can do, plus permanently delete a ticket. In the current prototype, also promote a requester to agent |

### In scope for the course

- Register, login, JWT, and role checks
- Seeded accounts: `{studentId}@gmail.com`, first password is the student id, stored hashed. `mustChangePassword` blocks the rest of the app until `POST /auth/change-password`. A self-registered user skips that screen
- Tickets: create, list, filter, search, paginate, detail, edit, close, reopen, permanent delete (admin)
- Optional area. One optional image on create only
- Public comments and internal notes, including edit and hide
- Category tree and tag tree: add, rename, deactivate, delete
- Activity log is specified, and M0 moved it to nice-to-have
- Seeded users and trees, plus a README a grader can follow

### Out of scope

- Email or push notifications
- Files on comments, or more than one file on a ticket
- Replacing a ticket image after create
- Editing, deleting, or exporting the activity log
- SLA timers, a knowledge base, multiple organisations, WebSockets
- Drag-and-drop reordering of category or tag nodes
- A visitor choosing agent or admin at registration

### MVP split

Must have: stories 1–8 and 10 in `PROPOSAL.md` (auth, tickets, comments, inbox, category and tag trees, seed and README).

Nice to have: story 9 (activity log), the ticket image, and an inbox board. The list view is enough for the inbox. Search, filter, and pagination are the stretch feature and are already on My tickets.

### Target stack

Vue 3 and TypeScript in the browser. NestJS, Prisma, and PostgreSQL behind it. The browser sends `Authorization: Bearer <jwt>`. Only the Vue app exists today.

```text
Browser (Vue 3)
        |  HTTP, JWT bearer token
        v
NestJS REST API ---- optional ticket image on disk
        |  Prisma
        v
PostgreSQL
```

Planned screens, in wireframe order: Sign in, Change password, Register, My tickets, New ticket, Edit ticket, Requester ticket, Inbox board, Inbox list, Agent ticket, Categories and tags, Activity log, Not found.

## Progress

Milestone answers that are filled in: M0 and M1 in `MILESTONES.md`. M2–M5 are still blank. There is no `backend/` directory.

### Done in the frontend prototype

- My tickets: search, status, priority, category, area, tag, paging, table and cards. Data lives in the tickets store and `services/ticket.ts`, saved under `helpdesk.tickets`.
- New ticket: title, description, priority, category, tags, area, image field checked in the form. Create saves an `OPEN` ticket. The image file is not stored.
- Ticket detail: loads one ticket and its public comments from mocks. Read-only. No composer, edit, hide, assign, or delete.
- Not found page.
- Visual pass on 2026-11-12: flat warm-grey theme with a deep teal primary, a dark top bar, status shown as a dot plus a word, and monospace ticket ids. Filters and results share one box on My tickets. `docs/style.md` matches `theme.css`. Tag checkboxes use `catalogTreeRows` in `lib/catalog.ts` so children sit under their parent.
- Auth prototype:
  - Types in `src/types/user.ts`. Mock accounts in `src/mock/users.ts`. Service in `src/services/auth.ts`. Store in `src/stores/auth.ts`.
  - `/login`, `/register`, and admin-only `/staff`.
  - Guard: logged out goes to `login`; a signed-in visit to a guest page goes to `tickets`; a non-admin visit to `/staff` goes to `tickets`.
  - Sign out calls `auth.logout()` then `router.push({ name: 'login' })`.
  - Users persist in `helpdesk.users`. The signed-in person persists in `helpdesk.session` as `{ id, name, email, role }` with no password.
- Unit tests (8 passing on 2026-11-12):
  - `src/__tests__/ticketList.spec.ts` covers filter and paging helpers.
  - `src/__tests__/App.spec.ts` clears `localStorage` before each test, then checks: a visitor to `/tickets` lands on Sign in; a requester sees the shell with name and role and no Staff link; an admin sees Staff, and Sign out returns to `login`.
  - There is no separate `auth.spec.ts` for the auth service and store yet.

### Prototype accounts

| Role | Email | Password |
|---|---|---|
| Requester | `requester@helpdesk.test` | `requester123` |
| Agent | `agent@helpdesk.test` | `agent123` |
| Admin | `admin@helpdesk.test` | `admin123` |

These emails are for the mock only. The grader seed is still `e20230105@gmail.com` with password `e20230105`, plus one account per role, and it is not built.

Checked in the browser on 2026-11-09: requester login opens `/tickets` with the bar, and Sign out opens `/login` with no bar.

### Not built yet

- Change-password screen and `mustChangePassword`
- JWT, hashed passwords, NestJS, Prisma, PostgreSQL, seed script, root README for graders
- Edit ticket
- Comment create, edit, and hide. Internal notes
- Inbox list and inbox board. Assign, close, reopen
- Admin permanent delete
- Category and tag management screens
- Activity log
- Role-specific nav from `docs/style.md`. Agent and admin still see My tickets and New ticket. Admin also sees Staff. The spec nav is Inbox, Categories and tags, Activity log
- Ticket image upload to disk
- Unit tests for `services/auth.ts` and `stores/auth.ts` (register, wrong password, promote)

### Current routes

| Path | Name | Who |
|---|---|---|
| `/` | redirect to `/tickets` | guard then sends guests to login |
| `/login` | `login` | guest |
| `/register` | `register` | guest |
| `/tickets` | `tickets` | signed in |
| `/tickets/new` | `ticket-new` | signed in |
| `/tickets/:id` | `ticket-detail` | signed in |
| `/staff` | `staff` | admin |
| anything else | `not-found` | signed in; guests are sent to login |

Shell nav today: My tickets, New ticket, Staff (admin only), then the name, role tag, and Sign out. The top bar is dark (`--color-bar`).

## Project structure

```text
ip1-e20230105/
  CLAUDE.md                 this memory
  PROPOSAL.md               problem, roles, stories, MVP split, entities
  DECISIONS.md              dated design choices
  MILESTONES.md             M0–M5 written answers
  docs/
    SPEC.md                 full behaviour and FR rules
    style.md                visual layout for every screen
    components.md           props, events, and who owns state
    wireframes/
      helpdesk_updated.excalidraw
      index.html
  frontend/                 the only application
    index.html
    package.json            Vue 3, TypeScript, Pinia, Vue Router, Vite, Vitest, Playwright
    vite.config.ts
    vitest.config.ts
    playwright.config.ts
    eslint.config.ts
    env.d.ts
    public/favicon.ico
    e2e/vue.spec.ts         scaffold, not the helpdesk flows
    src/
      main.ts               createApp, Pinia, router, theme.css
      App.vue               shell when currentUser is set, otherwise the guest view
      styles/theme.css      tokens, buttons, fields, banners, table
      router/index.ts       routes and beforeEach
      types/
        user.ts             Role, User, Account
        ticket.ts           Ticket, status, priority
        comment.ts
        catalog.ts          category and tag nodes
      mock/
        users.ts            three seeded accounts
        tickets.ts
        comments.ts
        categories.ts
        tags.ts
      services/
        auth.ts             login, register, logout, listUsers, promoteToAgent, session
        ticket.ts           list, detail, comments, create, localStorage
      stores/
        auth.ts             currentUser, error, login, register, logout, staff, promote
        tickets.ts          tickets, loading, error, loadTickets, addTicket
      lib/
        ticketList.ts       filters and paging
        catalog.ts          tree paths and options
        labels.ts
      views/
        LoginView.vue
        RegisterView.vue
        StaffView.vue       admin promotes a requester to agent
        TicketListView.vue
        NewTicketView.vue
        TicketDetailView.vue
        NotFoundView.vue
      components/
        AppShell.vue
        TicketFilters.vue
        FilterSelect.vue
        TicketTable.vue     variant mine or inbox; inbox variant is unused by a view
        TicketCard.vue
        TicketPager.vue
        CommentItem.vue
      __tests__/
        App.spec.ts         guard, shell by role, sign out
        ticketList.spec.ts
```

Run the frontend from `frontend/` with `npm install` and `npm run dev`. The dev server used in this work is http://localhost:5173/. Tests: `npm run test:unit`.

## Working rules for the next change

- Match `docs/style.md` for layout and the existing class names in `styles/theme.css`.
- Keep new shared data in a service plus a Pinia store. Keep form state in the view.
- A new signed-in page needs a route and must stay behind the guard. A new guest page needs `meta: { guest: true }`.
- Admin-only pages need `meta: { admin: true }`.
- When auth behaviour changes, update the accounts table, the route table, and the Done section above.
