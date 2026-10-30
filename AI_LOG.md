# AI log

One entry per meaningful AI use. Kept and rejected are both written down so the explain-back can point at a real choice.

## 2026-10-26 · Spec draft for helpdesk tickets

Tool: Cursor (Composer)

Asked: turn the helpdesk domain into a full `docs/SPEC.md` with user stories, acceptance criteria, roles, and functional requirements.

Kept: the three roles (REQUESTER, AGENT, ADMIN), the ticket / comment / category / tag / activity-log shape, and the numbered FR table that maps back to stories.

Rejected: treating agent and admin as the same UI. Admin keeps permanent delete; agent does not. Also rejected putting real API calls into Check 1 screens.

Checked by: read the course project guideline against the SPEC sections (roles, CRUD on the main entity, auth, search or filter later).

## 2026-10-29 · Component map

Tool: Cursor (Composer)

Asked: document which Vue components each screen will use, with props, events, and who owns the state.

Kept: `docs/components.md` with props-down / events-up, shared pieces (`TicketCard`, `TicketTable`, `AppShell`), and optional `area` on tickets.

Rejected: hard-coding ticket lists inside templates. Sample data belongs in `src/mock/` with types.

Checked by: compared the My tickets tree to the first static Vue screen (`TicketListView` + `TicketCard`).

## 2026-10-30 · First static Vue screen

Tool: Cursor (Composer)

Asked: what Check 1 needs next, and the code for a static ticket list so I can type it myself.

Kept: the Week 3 pattern — `Ticket` type, `src/mock/tickets.ts`, `TicketCard` with typed props and an `open` emit, `TicketListView` owning the list with `ref`, `App.vue` rendering the view. I typed the files myself.

Rejected: generating the whole frontend, wiring Vue Router, or calling a real API. Those belong to later checks.

Checked by: `npm run dev` shows three mock tickets; Open updates the message; `npm run test:unit` expects “My tickets”.
