# Check 1

Tag: check-1  
Commit: _(fill with `git rev-parse HEAD` after you commit the Check 1 work and create the tag)_

## Done (copy the checklist, tick what works)

- [x] `docs/SPEC.md`: 6–10 user stories with acceptance criteria, at least 2 roles (10 stories; REQUESTER, AGENT, ADMIN)
- [x] Wireframes for the main screens in `docs/wireframes/` (HTML preview + Excalidraw)
- [x] `frontend/` runs with `npm run dev` from a fresh clone (after `npm install`)
- [x] First static screens built from the spec (no real data yet) — **one screen so far** (My tickets: `TicketListView` + `TicketCard` + `src/mock/tickets.ts`). Need 1–2 more (for example Sign in, ticket detail)
- [x] `AI_LOG.md` and `DECISIONS.md` have real entries
- [ ] Small commits with meaningful messages, tag `check-1` pushed — **not done yet** (wireframes and static Vue files still need committing; no `check-1` tag)

## AI use this period

- Spec draft for helpdesk tickets (kept roles and FR table; rejected merging agent and admin)
- First static Vue screen (kept the typed card + mock list pattern; I typed the code; rejected API and router for this check)

## One decision I made and why

Seeded accounts must change the preset password before using the app (`mustChangePassword`). That gives graders a known login while still forcing a real password, and register remains for a normal requester.

## What I would show if asked to explain one thing

`TicketListView.vue` and `TicketCard.vue`: the view owns the mock list in a `ref`, passes each ticket down as a prop, and listens for `open`. The card never imports the mock file; it only emits the ticket id.
