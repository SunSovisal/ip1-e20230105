# Decisions

One line per real design choice. Add a line when the choice changes the code or the spec, not when it is only a preference.

- 2026-10-26: Helpdesk tickets as the domain: clear requester / agent / admin split and a main entity (Ticket) with comments and assignment.
- 2026-10-26: Three roles (REQUESTER, AGENT, ADMIN) instead of two: admin is agent plus permanent ticket delete, matching the course “at least 2 roles” rule without inventing a fourth role.
- 2026-10-28: Seeded login is `{studentId}@gmail.com` with the student id as the first password; `mustChangePassword` blocks the rest of the app until `POST /auth/change-password` succeeds. Register stays for visitors who pick their own password.
- 2026-10-28: Wireframes live as Excalidraw (and an HTML preview) in `docs/wireframes/`, not only as Figma: editable in the repo, no account required for the teacher to open the source.
- 2026-10-28: No separate admin layout. Agent and admin share the inbox shell; admin-only actions (permanent delete) appear on the same ticket screen.
- 2026-10-29: Optional `area` on a ticket (for example J609) as a place label, separate from the category tree and the tag tree.
- 2026-10-29: Props down, events up for screen components. The view owns the list; cards and tables only receive props and emit events (`docs/components.md`).
- 2026-10-30: First static screen uses mock tickets in `src/mock/` and a typed `Ticket` in `src/types/`. No API and no Pinia store yet; M1 adds routes, Pinia, and a mock service layer.
- 2026-10-31: Follow the new milestone guideline (M0–M5): `PROPOSAL.md` + `MILESTONES.md` instead of `AI_LOG.md` / `CHECK.md`. Folder names and every checklist item are not mandatory.
- 2026-10-31: Stretch feature is search, filter and pagination on ticket lists. Activity log and ticket image stay nice-to-have for the proposal MVP split.
- 2026-11-12: Compact New ticket form so it fits without scrolling: Priority, Category and Area share one row, tags are chips, the description hint is a placeholder, and the screenshot picker moved into the action row.
- 2026-11-12: Category and tags on the ticket form use one searchable `CatalogPicker` instead of a native select, checkboxes or chips: the form stays the same height as the trees grow, and the dropdown matches the theme instead of the OS menu. Tags use `multiple` (removable pills); category uses `leaf-only` (parent nodes are headings, as the select only offered leaf categories).
- 2026-11-12: Theme follows the school (ITC) logo: primary `#0c4da2` sampled from `src/assets/logo.png`, cool greys and a deep navy top bar replace the teal and warm greys. The logo replaces the "H" mark in the top bar and on Sign in / Register, and is the favicon.
