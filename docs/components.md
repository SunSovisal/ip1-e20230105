# Components

Each screen below is one page from the wireframes. The tree is the components on that page. The table says the props, the events, and which component keeps the state.

Props go down. Events go up. The component that keeps a value is the owner. A child receives it as a prop and does not store a second copy.

App is the top of every tree. It keeps the token, the signed-in user (id, name, email, role), and mustChangePassword. Screens read the user from App.

Area is optional. It is the place of the problem, for example J609. It is on the ticket form, the ticket page, and the list filters.

## Shared components

These are used on more than one screen. A later screen names them in its tree and does not repeat the whole row.

| Component | Props | Events | Owns |
|---|---|---|---|
| AppShell | user (name, role) | signOut | nothing |
| TicketFilters | value (query, status, priority, categoryId, area, tagId), categories, tags | update:value | nothing |
| TicketTable | tickets, variant (mine or inbox) | open (ticket id) | nothing |
| Pager | page, pageCount | change (page) | nothing |
| TicketForm | draft, errors, categories, tags, mode (create or edit), imageName | update:draft, submit, cancel | nothing |
| TicketCard | ticket | open (ticket id) | nothing |
| CatalogPicker | nodes (catalog nodes), modelValue (one id, or a list of ids when multiple), multiple, leafOnly, invalid | update:modelValue | the search text, whether the list is open, the highlighted row |
| KanbanColumn | status, tickets | open (ticket id), move (ticket id, status) | nothing |
| CommentItem | comment, canEdit, canHide | save (id, body), hide (id) | editing, and the draft while the editor is open |
| CommentComposer | allowInternal | submit (body, visibility) | the unsent text. If internal notes are allowed, also the public or internal choice |
| ConfirmDialog | open, title, message | confirm, cancel | nothing |
| TreeEditor | title, nodes, error | add, rename, setActive, remove | the add-row name and parent, the selected node, and the rename text |

AppShell shows My tickets and New ticket for a requester. It shows Inbox, Categories and tags, and Activity log for an agent or admin.

TicketTable variant mine shows title, category, priority, status, and assignee. Variant inbox also shows the requester name and email. When a ticket has an area, it is under the title.

CatalogPicker lists only active nodes, in tree order. Tags use it with multiple. Category uses it as a single choice with leafOnly, so a parent such as Hardware is a heading and cannot be picked. Arrow keys move and skip headings, Enter picks the highlighted row and never submits the form, Backspace on an empty search removes the last tag (multiple only), Esc closes the list.

TicketForm in create mode edits title, description, priority, category, tags, area, and one optional image. In edit mode it edits title, description, category, tags, and area. The image name is shown and cannot be changed.

## Sign in

Goal: a visitor signs in.

```text
App
└── SignInView
```

| Component | Props | Events | Owns |
|---|---|---|---|
| SignInView | none | none | email, password, error |

A correct sign-in is saved on App. A wrong email or password stays on this screen, in error.

## Register

Goal: a visitor creates a requester account.

```text
App
└── RegisterView
```

| Component | Props | Events | Owns |
|---|---|---|---|
| RegisterView | none | none | name, email, password, fieldErrors |

There is no role field.

## Change password

Goal: a seeded account replaces the preset password before the rest of the app opens.

```text
App
└── ChangePasswordView
```

| Component | Props | Events | Owns |
|---|---|---|---|
| ChangePasswordView | email | signOut | newPassword, confirmPassword, fieldErrors |

Email comes from the session. A valid save clears mustChangePassword on App. The screen does not keep either password after the save.

## My tickets

Goal: the requester searches, filters, and pages their own tickets.

```text
App
└── AppShell
    └── TicketListView
        ├── TicketFilters
        ├── TicketTable
        └── Pager
```

| Component | Props | Events | Owns |
|---|---|---|---|
| TicketListView | none | none | tickets, filters, page, pageCount, categories, tags |

TicketTable uses variant mine. Open goes to that ticket. An empty page is a message in TicketListView, not another component. AppShell, TicketFilters, TicketTable, and Pager are in the shared table.

## New ticket

Goal: create a ticket. It starts open, with the current user as requester and nobody assigned.

```text
App
└── AppShell
    └── NewTicketView
        └── TicketForm
```

| Component | Props | Events | Owns |
|---|---|---|---|
| NewTicketView | none | none | draft, errors, categories, tags |

TicketForm uses mode create. Draft holds title, description, priority, categoryId, tagIds, area, and the optional image file. The pickers list only active categories and tags.

## Edit ticket

Goal: change the title, description, category, tags, and area of an existing ticket.

```text
App
└── AppShell
    └── EditTicketView
        └── TicketForm
```

| Component | Props | Events | Owns |
|---|---|---|---|
| EditTicketView | none | none | draft, errors, categories, tags |

TicketForm uses mode edit. Draft is loaded from the ticket: title, description, categoryId, tagIds, and area. Status is shown and is not a field. imageName is empty when the ticket has no image.

## Requester ticket

Goal: the owner reads one ticket and adds a public comment.

```text
App
└── AppShell
    └── TicketDetailView
        ├── CommentItem
        └── CommentComposer
```

| Component | Props | Events | Owns |
|---|---|---|---|
| TicketDetailView | role | none | ticket, comments |

CommentComposer has allowInternal false. The ticket holds title, status, priority, category path, tags, area, description, image, and assignee. Comments are public only. TicketDetailView sets canEdit and canHide from the status, and from whether an agent has replied after that comment. There is no assignee control, internal note, close, or delete.

## Inbox

Goal: an agent or admin sees every ticket, as a board or as a list.

The board and the list are one screen. InboxView keeps view, either board or list.

Board:

```text
App
└── AppShell
    └── InboxView
        └── KanbanColumn
            └── TicketCard
```

One KanbanColumn for each status.

List:

```text
App
└── AppShell
    └── InboxView
        ├── TicketFilters
        ├── TicketTable
        └── Pager
```

| Component | Props | Events | Owns |
|---|---|---|---|
| InboxView | none | none | view, tickets, filters, page, pageCount, categories, tags |

Tickets here means every ticket. The number on a column comes from those tickets. Dragging a card sends move. InboxView keeps the new status. TicketCard does not. TicketTable uses variant inbox. Filters and paging are only on the list.

## Agent ticket

Goal: an agent or admin works on one ticket. An admin can delete it.

```text
App
└── AppShell
    └── TicketDetailView
        ├── ConfirmDialog
        ├── CommentItem
        └── CommentComposer
```

| Component | Props | Events | Owns |
|---|---|---|---|
| TicketDetailView | role | none | ticket, comments, confirmOpen |

This is the same detail view as the requester ticket. Role is agent or admin, so the page also shows assignee, status, internal notes, and both reply kinds. CommentComposer has allowInternal true. Comments include internal notes. confirmOpen is on only after an admin chooses Delete ticket. An agent does not get that button. ConfirmDialog does not keep the ticket.

## Categories and tags

Goal: an agent or admin adds, renames, deactivates, and deletes category and tag nodes.

```text
App
└── AppShell
    └── CatalogView
        ├── TreeEditor
        └── TreeEditor
```

One TreeEditor for categories, one for tags.

| Component | Props | Events | Owns |
|---|---|---|---|
| CatalogView | none | none | categories, tags, error |

A refused delete sets error on that tree. The other tree's error stays empty.

## Activity log

Goal: an agent or admin reads the log, newest first, and filters it.

```text
App
└── AppShell
    └── ActivityLogView
        ├── ActivityTable
        └── Pager
```

| Component | Props | Events | Owns |
|---|---|---|---|
| ActivityLogView | none | none | entries, action, userId, page, pageSize, pageCount |
| ActivityTable | entries | none | nothing |

A row shows when, who, the action, what it was done to, the old value, and the new value. A row cannot be edited or deleted. Page size is chosen on this screen.

## Not found

Goal: an unknown address, or a ticket this user cannot open, ends here.

```text
App
└── AppShell
    └── NotFoundView
```

| Component | Props | Events | Owns |
|---|---|---|---|
| NotFoundView | role | none | nothing |

Role chooses the way back: My tickets for a requester, Inbox for an agent or admin. A missing token does not open this page. App sends that visit to Sign in.
