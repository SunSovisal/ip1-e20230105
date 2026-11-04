# Milestones

Short answers to the “explain your design” questions. Fill each section when that milestone is due. Tags: `m0` … `m5`.

## M0 Proposal (week 3)

**Which story did you cut from the MVP, and why?**

US-09 (activity log) moved to nice-to-have. Auth, tickets, comments, inbox, and category/tag trees already cover the core helpdesk loop for requester and agent. A full audit trail is useful for grading and ops, but it is not required to open, assign, and close a ticket, so cutting it keeps the first shippable scope smaller.

---

## M1 Frontend prototype (week 5)

**What state lives in the store and what stays inside a component? Why?**

The Pinia tickets store holds the shared ticket list (plus loading and error), because My tickets and New ticket both need it, create updates the list without another fetch. Form drafts, field errors, and the open ticket with its comments stay in their own views, because no other screen needs that data and it should reset when the user leaves. Cards only get props and emit events. The store talks to a service layer, so M3 can swap mocks for a real API without touching the UI.

---

## M2 Backend API (week 7)

**Why did you choose this relation (1-N or N-N) between two of your entities?**

_(Answer when M2 is ready.)_

---

## M3 Integrated app (week 9)

**Where is the token stored in the browser, and what attack does that choice protect against or expose?**

_(Answer when M3 is ready.)_

---

## M4 Feature complete (week 12)

**Pick one test. What bug would it catch?**

_(Answer when M4 is ready.)_

---

## M5 Deployed (week 14)

**What happens, step by step, between git push and your change being live?**

_(Answer when M5 is ready.)_
