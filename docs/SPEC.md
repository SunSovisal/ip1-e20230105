# Helpdesk tickets

| Item | Details |
|---|---|
| Course | Internet Programming 1 |
| Stack | Vue 3, TypeScript, NestJS, PostgreSQL, Prisma |
| Wireframes | docs/wireframes |
| Components | docs/components.md |

This document says what the helpdesk must do, so the design, the code, and the tests follow the same rules.

## The problem

People who need support have no simple way to ask for it and then see what happened. Support staff have no shared queue where they can assign, answer, and close tickets. Requests get lost, nobody knows who owns what, and statuses do not match.

## Roles

A visitor who registers becomes a requester. Agent and admin accounts come from the seed.

| Role | What they can do |
|---|---|
| Requester | Register and log in, create tickets with an optional error image, view and edit their own open tickets, choose an active category and tags, set an optional area, and post, edit, or hide their own public comments while the ticket is still open and unanswered |
| Agent | Everything a requester can do, on any ticket, plus the inbox, assign, close, and reopen, public replies and internal notes, edit or hide any comment, add, rename, deactivate, and delete category and tag nodes, and read the activity log |
| Admin | Everything an agent can do, plus permanently delete a ticket |

Every ticket has one category from a category tree and any number of tags from a separate tag tree. Area is optional. It names the place, for example J609 or Lab B / Room 204. A category or tag can be renamed or marked inactive. An inactive node stays on old tickets and is hidden when someone opens a new ticket. Every change is written to an activity log that agents and admins can read. At least one account per role is seeded.

## In scope

- Register and login with a JWT
- Seeded accounts use studentId@gmail.com, start with that id as the password, and must choose a new password before the rest of the app
- Roles REQUESTER, AGENT, and ADMIN
- Tickets: create, list, filter, search, paginate, detail, edit, close, reopen, and permanent delete (admin only)
- Optional area on a ticket
- Public comments and internal notes, including edit and hide
- Assigning tickets and changing status
- Category tree and tag tree: add, rename, deactivate, and delete
- One optional image when a ticket is created
- Activity log with the old value and the new value
- Seeded accounts and trees, and a README with setup steps

## Out of scope

- Email or push notifications
- Files on comments, or more than one file on a ticket
- Replacing or removing a ticket image after it is created
- Editing, deleting, or exporting activity log entries
- SLA timers and a knowledge base
- Multiple organisations
- Real-time updates (WebSockets)
- Drag-and-drop reordering of category and tag nodes
- A visitor registering themselves as an agent or an admin

## Assumptions

- Users have a modern desktop browser.
- PostgreSQL runs locally or in Docker.
- The seeded REQUESTER, AGENT, and ADMIN accounts exist for grading.

## Constraints

| Area | Constraint |
|---|---|
| Technology | Vue 3, TypeScript, NestJS, PostgreSQL, Prisma |
| Security | Passwords are hashed. The API never returns passwordHash. Passwords and tokens are never written to the activity log. |
| Auth | Protected routes and API calls need the header Authorization: Bearer, then the token. |

## How it is built

```text
Browser (Vue 3 app)
        |  HTTP, JWT bearer token
        v
NestJS REST API ---- image files on disk
        |  Prisma
        v
PostgreSQL
```

| Part | Job |
|---|---|
| Vue frontend | Login, register, first-login password change, ticket lists, ticket form (category, tags, area, image), ticket detail with public replies and internal notes, category and tag management, activity log page, UI that changes by role |
| NestJS API | Auth, tickets, images, comments, categories, tags, activity log, role and ownership checks |
| PostgreSQL | Users, tickets, comments, categories, tags, activity log |
| Disk | The optional ticket image |
| Prisma | Schema, migrations, seed |

Screens, in the same order as the wireframes:

1. Sign in
2. Change password, for a seeded account that still has its preset password
3. Register
4. My tickets: list, filters (status, priority, category, area, tag), search, New ticket
5. New ticket (image field on create only; the category and tag pickers list active nodes only)
6. Edit ticket
7. Requester ticket: category path, tags, area, image, public comments
8. Inbox board, for agents and admins
9. Inbox list, for agents and admins
10. Agent ticket: the same detail, plus assign, status, internal notes, and admin delete
11. Categories and tags, for agents and admins
12. Activity log, for agents and admins
13. Not found

The inbox board and the inbox list are the same queue. Dragging a card to another column sets the status, using the same rules as choosing a status. Component trees are in docs/components.md.

What happens on a request:

1. The user logs in and the API returns a JWT. If the account still has its preset password, the client shows only the change-password screen until that password is replaced.
2. The client sends the JWT on every protected request.
3. The API checks role and ownership, then reads or writes through Prisma. On create, an image is saved to disk. Every write also adds a row to the activity log, including the old value and the new value.
4. The UI shows lists and details according to the role. A requester never receives internal notes.

## Stories

Each story has a goal and the rules that make it done. The Requirements section lists the same behaviour as FR-01 and the rest. Each FR names the story it comes from.

### US-01 Register, log in, and protected pages

Goal: a visitor registers and logs in, and only sees what their role allows.

- POST /auth/register creates a user with a hashed password. The default role is REQUESTER. The body cannot set the role.
- POST /auth/login returns a JWT for a correct email and password.
- A seeded account has email studentId@gmail.com, for example e20230105@gmail.com, and the initial password is that student id. The stored value is the hash.
- When that account still has the preset password, login still returns a JWT, and the UI shows only the change-password screen. Every other app page redirects there. Every other protected API call returns 403 until the password is changed.
- POST /auth/change-password sets the new password and clears that block. The new password must not equal the student id. A missing field, a mismatch, or a password equal to the id returns 400, and the form shows the message.
- A later login with the new password opens the app for that role. A visitor who registered chose their own password, so they skip this screen.
- A wrong password or unknown email returns 401 with a clear message.
- A bad body (missing email or password, invalid email) returns 400.
- No response includes passwordHash.
- Opening /tickets or any other app page while logged out redirects to login.
- The requester UI has no inbox, assign, close, reopen, permanent delete, internal note, category management, or activity log controls.
- The agent UI shows the inbox, assign, close, reopen, internal notes, category management, and the activity log. It has no permanent delete.
- The admin UI shows everything the agent UI shows, plus permanent delete.
- API calls send Authorization: Bearer, then the token. A missing token returns 401.

Requirements: FR-01 to FR-05, FR-22 to FR-24, FR-50.

### US-02 Create a ticket

Goal: a requester opens a ticket with a title, description, priority, category, an optional area, and an optional error image.

- A signed-in user can create a ticket from the UI and with POST /tickets.
- A new ticket has status OPEN, requesterId set to the current user, and no assignee.
- Title is required (3 to 120 characters). Description is required (at least 10 characters). Priority is LOW, MEDIUM, or HIGH.
- Area is optional. When set, it is 2 to 80 characters. An empty value means no place was given.
- categoryId is required and must be an existing active category. tagIds is optional and every id must be an existing active tag.
- An unknown id, or an inactive category or tag, returns 400.
- An invalid body returns 400, and the form shows the field messages.
- Create returns 201 with the category path, tags, and area in the body.
- The form accepts one optional image (png, jpg, jpeg, or webp) of at most 2 MB. Without an image the ticket is still created.
- A second file, a non-image, or a file over 2 MB returns 400 and no ticket is created.

Requirements: FR-06 to FR-08, FR-29 to FR-31, FR-38, FR-39.

### US-03 List and filter my tickets

Goal: a requester searches, filters, and pages their own tickets.

- The list shows only my tickets.
- Filters are status, priority, categoryId, area, and tagId.
- A category filter includes that category and everything under it. A tag filter matches that exact tag. Area is a case-insensitive contains match, the same kind of search as the title.
- Search is by title (case-insensitive, contains).
- When a ticket has an area, the list shows it under the title.
- Results are paged with page and pageSize, and the UI has next and previous controls.
- An empty result shows an empty state, not an error.

Requirements: FR-09, FR-32.

### US-04 View a ticket and comment

Goal: a requester opens one of their tickets and adds a public comment. An agent can leave an internal note that the requester cannot see.

- /tickets/:id shows title, status, priority, category path, tags, area when it is set, description, the error image if there is one, the assignee if there is one, and comments in time order.
- A public comment is visible to the requester, agents, and admins. An internal note is returned only to agents and admins.
- The owner can post a public comment. An empty body returns 400. The comment form has no file field.
- An agent or admin can post a public reply or an internal note on any ticket. A requester who sends visibility INTERNAL gets 403.
- A hidden comment is shown as "Comment removed" and its text is not in the ticket response.
- Another requester's ticket id returns 404. An unknown id returns 404.

Requirements: FR-10 to FR-12, FR-40, FR-41, FR-42.

### US-05 Edit a ticket

Goal: the owner fixes title, description, category, tags, and area while the ticket is open. An agent or admin can edit those fields on any ticket.

- The owner can edit title, description, categoryId, tagIds, and area only while the status is OPEN.
- An agent or admin can edit those fields on any ticket at any status.
- A newly chosen category or tag must be active. A category or tag already on the ticket may stay even if it is now inactive.
- tagIds set to an empty list clears the tags. Leaving tagIds out keeps them.
- Area follows the same length rule as on create. Clearing it removes the place.
- If a requester edits a ticket that is not OPEN, the API returns 400 with the message "Only open tickets can be edited."
- A requester who is not the owner gets 404.
- The saved values show up after saving, with normal navigation.

Requirements: FR-13, FR-30, FR-33.

### US-06 Inbox, assign, close, and reopen

Goal: an agent sees all tickets, assigns them, closes them, and reopens them.

- An agent or admin can list all tickets. A requester calling the same endpoint gets 403.
- Search, filters, and paging work as in US-03, across all tickets. That includes the area filter.
- Each row shows the requester's name and email, and the assignee or "Unassigned". Area, when set, is under the title.
- An agent or admin can set assigneeId, status, or both. Assigning an OPEN ticket sets it to IN_PROGRESS, unless another allowed status is chosen.
- An agent or admin can set the status to RESOLVED or CLOSED, and can move a CLOSED ticket back to OPEN or IN_PROGRESS.
- A requester trying to assign, close, or reopen gets 403. An invalid status returns 400.
- The requester sees the new status on the detail page.

Requirements: FR-14 to FR-17, FR-19, FR-20, FR-32.

### US-07 Edit or hide a comment, and delete a ticket

Goal: an agent corrects or hides a comment without losing the record. An admin permanently deletes a ticket that should not be kept.

- An agent or admin can edit any comment. createdAt stays the same. The comment shows that it was edited and who edited it.
- An agent or admin can hide any comment. The thread then shows "Comment removed". The original text is stored on the activity log entry and is not returned by the ticket API.
- The author of a public comment can edit or hide it only while the ticket is OPEN and no agent or admin has commented after it. Otherwise the API returns 403.
- A requester cannot edit or hide an internal note, or someone else's comment.
- An admin can permanently delete a ticket with DELETE /tickets/:id after a confirmation in the UI. It returns 204 and also deletes that ticket's comments, tag links, and image file.
- An agent or requester calling delete gets 403. An unknown id returns 404. The activity log entries for that ticket remain.

Requirements: FR-43 to FR-45.

### US-08 Category tree and tag tree

Goal: a requester gives a ticket one category and optional tags. An agent corrects the trees when a node was added by mistake.

- GET /categories and GET /tags return id, name, parentId, and active for every node. Root nodes have parentId null.
- The create and edit pickers list a node only when that node and every ancestor are active. Lists and detail still show an inactive category that is already on a ticket, for example Hardware / Laptop.
- An agent or admin can create a node with POST /categories or POST /tags and a name, plus an optional parentId. The name is 2 to 60 characters.
- An agent or admin can rename a node and can set active to true or false.
- An agent or admin can delete a category only when it has no child categories and no tickets. Otherwise the API returns 400 and names the reason.
- An agent or admin can delete a tag that has no child tags. The tag is removed from every ticket that had it, and each of those tickets gets a log entry. A tag that still has children returns 400.
- A requester calling create, rename, deactivate, or delete gets 403. A missing token gets 401.
- A parentId that does not exist, or that would create a loop, returns 400.
- The seeded trees have two levels or more. For example, categories Hardware, then Laptop and Network, and Software, then Account access. Tags Student, then Year 1 and Year 2.

Requirements: FR-26 to FR-28 and FR-34 to FR-37. Choosing them on a ticket: FR-29 to FR-33.

### US-09 Activity log

Goal: an agent sees every action, including the old and new values.

- Each of these actions adds one log entry: register, login, failed login, password change, ticket create, ticket edit, status change, assignment, ticket reopen, ticket delete, comment create, comment edit, comment hide, category or tag create, rename, deactivate, and delete.
- An entry shows who did it (or the email tried, for a failed login), the action, what it was done to, the old value, the new value, and the time.
- Hiding a comment stores the original comment text in that log entry.
- GET /activity-logs returns entries newest first, with paging and a filter by action and by user. Agents and admins can call it. A requester gets 403. A missing token gets 401.
- Entries cannot be edited or deleted through the API or the UI.
- No entry contains a password, a token, or passwordHash.
- Entries for a deleted ticket are still there after the ticket is gone.

Requirements: FR-46 to FR-49.

### US-10 Seeded accounts and README

Goal: a reviewer can run and grade the app from a fresh clone.

- npx prisma db seed creates at least one REQUESTER, one AGENT, one ADMIN, a category tree, and a tag tree, each tree with at least two levels.
- Each seeded user has email studentId@gmail.com and the initial password equal to that student id. The account must change that password on first login. The README lists the ids.
- The README lists the env vars, how to run the frontend and backend, and the test commands.
- .env is gitignored and both apps have a .env.example.

Requirements: FR-25.

## Requirements

### Authentication

| ID | Requirement | Story |
|---|---|---|
| FR-01 | A visitor can register with email and password. The default role is REQUESTER and the password is stored hashed. A role in the body is ignored. | US-01 |
| FR-02 | A registered user can log in with email and password and gets a JWT. | US-01 |
| FR-03 | A wrong password or unknown email returns 401 with a clear message. | US-01 |
| FR-04 | An invalid register or login body (missing fields, bad email) returns 400. | US-01 |
| FR-05 | API responses never include passwordHash. | US-01 |
| FR-50 | A seeded account email is studentId@gmail.com and the initial password is that student id, stored hashed. Until POST /auth/change-password succeeds, the UI shows only the change-password screen and every other protected call returns 403. The new password must not equal the student id. A self-registered user skips this screen. The log entry for the change does not contain either password. | US-01 |

### Tickets: requester

| ID | Requirement | Story |
|---|---|---|
| FR-06 | A signed-in user creates a ticket with title, description, priority, and categoryId from the UI and POST /tickets. tagIds, area, and one image file are optional. | US-02 |
| FR-07 | A new ticket has status OPEN, requesterId set to the current user, and assigneeId null. | US-02 |
| FR-08 | Title is 3 to 120 characters, description at least 10, priority one of LOW, MEDIUM, HIGH. Area is empty or 2 to 80 characters. An invalid body returns 400 and the UI shows field messages. A valid create returns 201. | US-02 |
| FR-09 | A requester lists only their own tickets, with filters for status, priority, category, area, and tag, a case-insensitive title search, and paging (page, pageSize). Area matches when the stored place contains the text. An empty result shows an empty state. Area is shown under the title when it is set. | US-03 |
| FR-10 | A requester opens their own ticket and sees title, status, priority, category path, tags, area when set, description, the image if there is one, the assignee if there is one, and public comments in time order. Internal notes are omitted. A hidden comment is shown as "Comment removed". | US-04 |
| FR-11 | A requester can post a public comment on their own ticket. An empty body returns 400. A comment is text only. | US-04 |
| FR-12 | Opening another requester's ticket returns 404. An unknown id also returns 404. The two answers are the same, so the ticket's existence is not revealed. | US-04 |
| FR-13 | The owner can edit title, description, and area only while the status is OPEN. Otherwise the API returns 400 with the message "Only open tickets can be edited." A requester who is not the owner gets 404. An agent or admin can edit title, description, and area on any ticket at any status. | US-05 |

### Tickets: agent and admin

| ID | Requirement | Story |
|---|---|---|
| FR-14 | An agent or admin lists all tickets with the same search, filter, and paging as FR-09. Each row shows the requester's name and email and the assignee or "Unassigned". Area is shown under the title when it is set. | US-06 |
| FR-15 | A requester calling the list-all endpoint gets 403. | US-06 |
| FR-16 | An agent or admin can set assigneeId, status, or both. Assigning an OPEN ticket sets it to IN_PROGRESS unless another allowed status is chosen. The assignee, when set, has role AGENT or ADMIN. | US-06 |
| FR-17 | A requester trying to assign or change status gets 403. An invalid status returns 400. | US-06 |
| FR-18 | An agent or admin can post a public comment on any existing ticket. | US-04 |
| FR-19 | An agent or admin can set the status to RESOLVED or CLOSED, and can set a CLOSED ticket back to OPEN or IN_PROGRESS. A requester cannot close or reopen a ticket (403). The requester sees the new status on the detail page. | US-06 |

### Status and priority

| ID | Requirement |
|---|---|
| FR-20 | Status goes OPEN, then IN_PROGRESS, then RESOLVED, then CLOSED. An agent or admin can move a ticket back to OPEN or IN_PROGRESS, including reopening a CLOSED ticket. |
| FR-21 | Priority is exactly one of LOW, MEDIUM, HIGH. |

### Protected pages and setup

| ID | Requirement | Story |
|---|---|---|
| FR-22 | Opening an app page such as /tickets while logged out redirects to login. | US-01 |
| FR-23 | The requester UI hides the inbox, assign, close, reopen, permanent delete, internal notes, category management, and the activity log. The agent UI shows those except permanent delete. The admin UI also shows permanent delete. | US-01 |
| FR-24 | The client sends Authorization: Bearer, then the token, on API calls. A missing or invalid token returns 401. | US-01 |
| FR-25 | npx prisma db seed creates at least one REQUESTER, one AGENT, one ADMIN, a category tree, and a tag tree, each with at least two levels. Each seeded email is studentId@gmail.com and the initial password is that student id. The README documents env vars, how to run both apps, the seeded ids, and the test commands. .env is gitignored and .env.example exists. | US-10 |

### Category tree and tag tree

| ID | Requirement | Story |
|---|---|---|
| FR-26 | GET /categories and GET /tags return every node as id, name, parentId, and active for a signed-in user. A missing token returns 401. | US-08 |
| FR-27 | An agent or admin creates a category or tag with POST /categories or POST /tags and a name, plus an optional parentId. A new node is active. A requester gets 403. | US-08 |
| FR-28 | The name is 2 to 60 characters. An unknown parentId, a parent from the other tree, or a parent that would create a loop returns 400. | US-08 |
| FR-29 | Creating a ticket requires a categoryId of an existing active category, and any tagIds must be existing active tags. An unknown or inactive id returns 400. | US-02 |
| FR-30 | Creating or updating a ticket accepts tagIds, an array of existing tag ids. An unknown id returns 400. A repeated id is stored once. Leaving tagIds out on update keeps the tags, and an empty list clears them. A tag added in this request must be active. | US-02, US-05 |
| FR-31 | Ticket list, detail, create, and update responses include area, the category (id, name, parentId, active, path), and the tags (id, name, parentId, active). path is the ancestor names plus the node name, joined by " / ". | US-04 |
| FR-32 | A categoryId filter on a list matches tickets in that category and in everything under it. A tagId filter matches tickets with that exact tag. | US-03, US-06 |
| FR-33 | The owner can change categoryId and tagIds only while the ticket is OPEN (same 400 and 404 rules as FR-13). An agent or admin can change them on any ticket at any status. The picker offers a node only when that node and every ancestor are active. | US-05 |
| FR-34 | An agent or admin can rename a category or tag. The new name is 2 to 60 characters. A requester gets 403. | US-08 |
| FR-35 | An agent or admin can set active to true or false on a category or tag. An inactive node stays on tickets that already use it and is left out of the create and edit pickers. A requester gets 403. | US-08 |
| FR-36 | An agent or admin can delete a category only when it has no children and no tickets. If it has either, the API returns 400 with the reason and the category stays. A requester gets 403. | US-08 |
| FR-37 | An agent or admin can delete a tag that has no child tags. The tag is removed from every ticket that had it, and each affected ticket gets its own log entry. A tag that still has children returns 400. A requester gets 403. | US-08 |

### Ticket image, on create only

| ID | Requirement | Story |
|---|---|---|
| FR-38 | POST /tickets accepts one optional image: png, jpg, jpeg, or webp, at most 2 MB. With no file, the ticket is still created (201). A wrong type, a file over 2 MB, or more than one file returns 400 and no ticket is created. | US-02 |
| FR-39 | The image is saved on disk under a generated file name. The ticket stores that name, the original name, and the MIME type. The upload folder is gitignored. | US-02 |
| FR-40 | Ticket detail shows the image when there is one. GET /tickets/:id/image follows FR-12: the owner, agents, and admins can read it, another requester gets 404, a missing token gets 401. | US-04 |
| FR-41 | Comments are text only. The comment API and forms do not accept a file. | US-04 |

### Comments, delete, and activity log

| ID | Requirement | Story |
|---|---|---|
| FR-42 | A comment has visibility PUBLIC or INTERNAL. Ticket responses for a requester include only PUBLIC comments. Agents and admins also receive INTERNAL comments. A requester who posts INTERNAL gets 403. | US-04 |
| FR-43 | An agent or admin can edit any comment. The author of a PUBLIC comment can edit it only while the ticket is OPEN and no agent or admin comment exists after it. createdAt does not change. The response includes editedAt and the editor. Any other edit returns 403. | US-07 |
| FR-44 | An agent or admin can hide any comment. The author of a PUBLIC comment can hide it under the same conditions as FR-43. A hidden comment is returned as "Comment removed" with no original text. The hide action writes a log entry whose old value is that text. | US-07 |
| FR-45 | DELETE /tickets/:id is admin only and returns 204. It also deletes the ticket's comments, tag links, and image file. An agent or requester gets 403, an unknown id returns 404, and a missing token returns 401. Activity log rows are not deleted. | US-07 |
| FR-46 | The API adds one activity log entry, in the same request, for each action listed in US-09. Deleting a tag that is on tickets also adds one entry per affected ticket. | US-09 |
| FR-47 | An entry stores the user (empty for a failed login), the action, the entity type and id, the old value, the new value, and the time. For a failed login the new value holds the email that was tried. For a hidden comment the old value holds the original text. | US-09 |
| FR-48 | GET /activity-logs returns entries newest first, with page, pageSize, and filters by action and userId. Agents and admins can call it. A requester gets 403 and a missing token gets 401. | US-09 |
| FR-49 | Log entries are append only. There is no endpoint or screen to edit or delete them. An entry never contains a password, a token, or passwordHash, and it stays after the ticket it refers to is deleted. | US-09 |

### Data

| Entity | Main fields | Relations |
|---|---|---|
| User | email, passwordHash, name, role (REQUESTER, AGENT, or ADMIN), mustChangePassword | Has many tickets as requester, and optionally many as assignee. Has many activity log entries. mustChangePassword is true for a seeded account until the preset password is replaced. |
| Ticket | title, description, status, priority, categoryId, area (optional), requesterId, assigneeId (optional), imageFileName (optional), imageOriginalName (optional), imageMimeType (optional), createdAt, updatedAt | Belongs to a requester, optionally an assignee, and one category. Has many tags through TicketTag, and many comments. area is the place of the problem, for example Lab B / Room 204. |
| Comment | body, ticketId, authorId, visibility (PUBLIC or INTERNAL), createdAt, editedAt (optional), editedById (optional), hiddenAt (optional), hiddenById (optional) | Belongs to a ticket and an author. No file. A hidden comment's text is not returned by the ticket API. |
| Category | name, parentId (optional), active | Optional parent, many children, many tickets |
| Tag | name, parentId (optional), active | Optional parent, many children, many tickets through TicketTag |
| TicketTag | ticketId, tagId | Joins a ticket and a tag |
| ActivityLog | userId (optional), action, entityType, entityId (optional), oldValue (optional), newValue (optional), createdAt | Optionally belongs to a user. entityId is a plain value, not a foreign key, so an entry survives when its ticket is deleted. |

## Other checks

| ID | Area | Requirement | How to check |
|---|---|---|---|
| NFR-01 | Security | Passwords are hashed and secrets are not committed. | No plaintext passwords. .env is gitignored. |
| NFR-02 | Security | Every protected ticket, comment, image, delete, and log action checks role and ownership. | Matches the permissions table. Another user's ticket returns 404. |
| NFR-03 | Usability | The UI shows validation errors and empty states clearly. | Forms show field errors. An empty list shows an empty state. A rejected category delete shows the reason. |
| NFR-04 | Reliability | Bad input does not crash the API. | Responses are 400, 401, 403, or 404. |
| NFR-05 | Performance | List endpoints, including the activity log, are paged. | The client sends page and pageSize. The UI has paging controls. |
| NFR-06 | Maintainability | Setup is documented. | The README and .env.example are enough to run a fresh clone. |
| NFR-07 | Compatibility | Runs on current Chrome, Firefox, and Safari. | Login and the main ticket flows work in each. |
| NFR-08 | Auditability | Every data-changing action leaves a log entry with the old and new values. | After each action in FR-46, one new entry exists. Hiding a comment leaves its text in that entry. |

## Permissions

| Action | Requester | Agent | Admin | Not logged in |
|---|---|---|---|---|
| Register / log in | yes | yes | yes | register and login only |
| Change the preset password | own account, while mustChangePassword is true | own account, while mustChangePassword is true | own account, while mustChangePassword is true | 401 |
| Create a ticket (with optional image and area) | yes | yes | yes | 401 |
| List own tickets | yes | yes | yes | 401 |
| List all tickets | 403 | yes | yes | 401 |
| Open a ticket (own) | yes | yes | yes | 401 |
| Open a ticket (someone else's) | 404 | yes | yes | 401 |
| View a ticket's image | same as opening the ticket | yes | yes | 401 |
| Choose a category and tags | own ticket while OPEN | any ticket | any ticket | 401 |
| Edit title, description, and area | own ticket while OPEN | any ticket | any ticket | 401 |
| Add, rename, or deactivate a category or tag | 403 | yes | yes | 401 |
| Delete a category with no children and no tickets | 403 | yes | yes | 401 |
| Delete a tag that has no child tags | 403 | yes | yes | 401 |
| Public reply | own ticket | any ticket | any ticket | 401 |
| Internal note | 403 | any ticket | any ticket | 401 |
| Edit or hide a comment | own public comment, only while the ticket is OPEN and no agent or admin has replied after it | any comment | any comment | 401 |
| Close or reopen a ticket | 403 | yes | yes | 401 |
| Change assignee | 403 | yes | yes | 401 |
| Permanently delete a ticket | 403 | 403 | yes | 401 |
| Read the activity log | 403 | yes | yes | 401 |

A requester who asks for another user's ticket gets 404. An unknown id also gets 404. Editing someone else's ticket as a requester also gets 404.

## Data rules

- The database is PostgreSQL, accessed through Prisma. Models: User, Ticket, Comment, Category, Tag, TicketTag, ActivityLog.
- A ticket always has a valid requesterId and a valid categoryId.
- Area is optional. When set, it is 2 to 80 characters and names where the problem is, for example Lab B / Room 204. An empty value means no place was given.
- imageFileName is null, or it names one image file on disk that matches imageMimeType. A comment never has a file.
- assigneeId is optional. When set, it is a user with role AGENT or ADMIN.
- A comment needs a non-empty body, a valid ticketId and authorId, and a visibility of PUBLIC or INTERNAL.
- Category parentId and Tag parentId are null or a node in the same tree, and a node cannot be its own ancestor.
- TicketTag is unique on the pair ticketId and tagId.
- A category delete is rejected while that category has a child or a ticket. A tag delete is rejected while that tag has a child. A successful tag delete removes its TicketTag rows.
- Permanent ticket delete is admin only. It removes the ticket's comments, TicketTag rows, and image file. Users, categories, and tags stay.
- ActivityLog rows are never updated or deleted by the app. entityId is not a foreign key.
