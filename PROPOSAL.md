# Helpdesk tickets

## Problem
People who need support have no simple way to ask for help and track what happened. Support staff have no shared queue to assign, reply, and close tickets, so requests get lost and ownership is unclear.

## Users and roles
- **Requester**: register and log in, open tickets, comment on their own tickets, and follow status.
- **Agent**: work the shared inbox — assign, reply (including internal notes), close or reopen, and manage categories and tags.
- **Admin**: everything an agent can do, plus permanently delete a ticket.

## User stories
1. As a visitor, I want to register and log in so that I only see what my role allows.
   Accepted when: register creates a requester with a hashed password; login returns a JWT; protected pages redirect when logged out; the UI hides actions the role cannot use.
2. As a requester, I want to create a ticket with title, description, priority, category, and optional area so that support knows what I need.
   Accepted when: create returns 201 with status OPEN; invalid fields return 400 with clear messages; optional area and tags are saved when given.
3. As a requester, I want to list and filter my tickets so that I can find an open request quickly.
4. As a requester, I want to open a ticket and leave a public comment so that I can add detail without opening a new ticket.
5. As a requester, I want to edit my open ticket so that I can fix mistakes before an agent replies.
6. As an agent, I want an inbox of all tickets so that I can assign, close, and reopen work.
   Accepted when: agents see every ticket; requesters get 403 on the inbox endpoint; status and assignee changes show on the detail page.
7. As an agent, I want to edit or hide comments, and as an admin I want to delete a ticket, so that wrong content can be fixed without losing the rest of the queue.
8. As a requester, I want to pick a category and tags; as an agent, I want to maintain those trees so that tickets stay organised.
9. As an agent, I want an activity log so that I can see who changed what.
10. As a grader, I want seeded accounts and a README so that I can run the app from a fresh clone.

## MVP scope
Must have: stories 1–8 and 10 (auth with roles, tickets CRUD, comments, inbox assign/close/reopen, category and tag trees, seed + README).

Nice to have: story 9 (activity log UI and API), ticket image on create, inbox board drag-and-drop (list view is enough for MVP).

## Entities
| Entity | Main attributes | Relations |
|---|---|---|
| User | name, email, passwordHash, role | has many Tickets as requester; optional assignee on tickets |
| Ticket | title, description, status, priority, area (optional) | belongs to requester, one Category; many Comments; many Tags |
| Comment | body, visibility (PUBLIC / INTERNAL) | belongs to Ticket and author |
| Category | name, parentId, active | optional parent; many Tickets |
| Tag | name, parentId, active | optional parent; many Tickets through join |

## Stretch feature
Search, filter and pagination on ticket lists (my tickets and the agent inbox).

What it does in this app: find tickets by title, status, priority, category, area, and tag, with page controls so long queues stay usable.

## Repository
https://github.com/SunSovisal/ip1-e20230105
