# Style guide

How every screen in the Vue frontend looks. Read this before adding or restyling a view or component.

The wireframes in `docs/wireframes` give the layout: what is on each screen and where. This file gives the visual style. When the two differ, keep the wireframe layout and use the style from this file. The wireframes are intentionally grey and square; the real app is not.

## Rules

1. Global tokens and shared classes live in `frontend/src/styles/theme.css`, imported once in `main.ts`. Do not import it again in a component.
2. Use the CSS variables below. Do not hardcode colours, spacing, radius, or shadows in a component.
3. Use the shared classes (`.page`, `.surface`, `.btn`, `.badge`, and the rest) before writing new CSS.
4. Component CSS goes in `<style scoped>` and only handles layout for that component (flex, grid, gaps, margins).
5. A class used on two or more screens moves into `theme.css` and gets a line in this file.
6. A new colour or size becomes a variable in `theme.css` first.
7. No CSS framework (Tailwind, Bootstrap, Vuetify). Plain CSS with variables.

## Tokens

### Colour

| Variable | Value | Use |
|---|---|---|
| `--color-primary` | `#0b4ca2` | Brand. Primary buttons, links, focus ring, active nav |
| `--color-primary-hover` | `#093d84` | Primary button hover |
| `--color-primary-soft` | `#e8f0fb` | Selected row, active nav background |
| `--color-ink` | `#1b2430` | Body text, headings |
| `--color-muted` | `#5b6675` | Secondary text, labels, timestamps |
| `--color-line` | `#e3e7ed` | Card borders, dividers, table rows |
| `--color-line-strong` | `#c9d0da` | Inputs, secondary buttons, hover border |
| `--color-paper` | `#f5f7fa` | Page background |
| `--color-sheet` | `#ffffff` | Cards, panels, inputs |
| `--color-soft` | `#f0f3f7` | Hover background, table header, subtle fills |
| `--color-danger` | `#c62828` | Errors, delete actions |
| `--color-danger-soft` | `#fdecec` | Error banner background |

### Status and priority

| Value | Class | Text | Background |
|---|---|---|---|
| OPEN | `.status-open` | `--status-open` | `--status-open-bg` |
| IN_PROGRESS | `.status-in_progress` | `--status-progress` | `--status-progress-bg` |
| RESOLVED | `.status-resolved` | `--status-resolved` | `--status-resolved-bg` |
| CLOSED | `.status-closed` | `--status-closed` | `--status-closed-bg` |
| HIGH | `.priority-high` | `--priority-high` | none |
| MEDIUM | `.priority-medium` | `--priority-medium` | none |
| LOW | `.priority-low` | `--priority-low` | none |

The class is built from the value, so new code stays consistent:

```vue
<span class="badge" :class="`status-${ticket.status.toLowerCase()}`">
  {{ ticket.status.replace('_', ' ') }}
</span>
<span class="priority" :class="`priority-${ticket.priority.toLowerCase()}`">
  {{ ticket.priority }}
</span>
```

Status is always a `.badge` pill. Priority is always coloured uppercase text, never a pill, so the two never look alike.

### Type

| Use | Size | Weight |
|---|---|---|
| Body | 15px, line-height 1.5 | 400 |
| Page title (`.page-title`) | 24px | 700 |
| Section heading (h2 in a panel) | 18px | 600 |
| Card title | 16px | 600 |
| Table, meta grid | 14px | 400 |
| Muted text (`.muted`), table header | 13px | 400 / 600 |
| Badge, priority, field label | 12px | 600 / 700 |

Font is `--font-sans` (Inter, falling back to the system font). Inter is not loaded yet; add it in `index.html` if wanted.

### Spacing, radius, shadow

| Variable | Value |
|---|---|
| `--space-1` … `--space-6` | 4, 8, 12, 16, 24, 32 px |
| `--radius-sm` | 6px: buttons, inputs, banners |
| `--radius` | 10px: cards, panels, dialogs |
| `--radius-pill` | 999px: badges |
| `--shadow-sm` | Resting card |
| `--shadow` | Hovered card, dropdown, dialog |
| `--page-max` | 960px content width |

Space inside a panel is `--space-5`. Space between panels or cards is `--space-3` to `--space-4`. Space between a page header and content is `--space-5`.

## Shared classes

| Class | What it is |
|---|---|
| `.page` | Centred main column, max width 960px. Every view's `<main>` uses it |
| `.page-title` | The h1 of a screen |
| `.surface` | White box with border, 10px radius, small shadow. Cards and panels |
| `.muted` | Secondary 13px text |
| `.btn` | Secondary button: white, grey border |
| `.btn-primary` | Main action on the screen (blue). At most one per area |
| `.btn-small` | Compact button inside cards, rows, pager |
| `.badge` + `.status-*` | Status pill |
| `.priority` + `.priority-*` | Priority text |
| `.banner` | Info message |
| `.banner-error` | Error message (red) |
| `.empty` | Empty state text, centred. Put it on a `.surface` |

### Still to add to `theme.css`

These are needed by the screens below. Add them to `theme.css` when the first screen uses them, then mark them here.

| Class | Spec |
|---|---|
| `.btn-danger` | Red background `--color-danger`, white text. Only for permanent delete and the confirm button in the delete dialog |
| `.field` | Wraps a label, a control, and an error. Grid, gap `--space-1` |
| `.label` | 13px, weight 600, `--color-ink` |
| `.input` (input, select, textarea) | `--color-sheet`, 1px `--color-line-strong`, `--radius-sm`, padding 8px 12px. Focus: border `--color-primary` plus a 3px `--color-primary-soft` ring |
| `.field-error` | 12px, `--color-danger`. The input in that field gets border `--color-danger` |
| `.table` | Full width, collapsed borders. Header 13px muted on `--color-soft`. Rows 14px, border-bottom `--color-line`, hover `--color-soft`, pointer cursor when the row opens a ticket |
| `.spinner` or loading text | Muted "Loading…" in a `.surface .empty`, until a real spinner exists |

## Layout

### App shell (every signed-in screen)

- Top bar, full width, white (`--color-sheet`), border-bottom `--color-line`, height 56px.
- Left: "Helpdesk" in 16px weight 700 `--color-primary`.
- Then the nav links. Requester: My tickets, New ticket. Agent and admin: Inbox, Categories and tags, Activity log. The active link is `--color-primary` with a 2px bottom border in the same colour. Others are `--color-muted`.
- Right: user name and role in `.muted`, then a `.btn .btn-small` "Sign out".
- Below the bar, the view's `<main class="page">` on the `--color-paper` background.
- One shell for all roles. Admin-only controls appear inside screens, not in a different layout.

### Page header

A row at the top of the page: title (`.page-title`) with an optional `.muted` subline on the left, and the primary action (`.btn-primary`) on the right. Flex, `align-items: flex-end`, `justify-content: space-between`, margin-bottom `--space-5`.

## Screens

Same order as the wireframes and `docs/components.md`.

### 1. Sign in

- No app shell. A white `.surface` card centred in the page, width `min(420px, 100%)`, padding `--space-6`.
- "Helpdesk" brand above the card in `--color-primary`.
- Title "Sign in", then Email and Password `.field`s stacked with gap `--space-4`.
- Full-width `.btn-primary` "Sign in".
- A wrong email or password shows a `.banner-error` above the fields, not under one field.
- A link under the card: "No account? Register".

### 2. Change password

- Same centred card as Sign in.
- A `.banner` at the top explains that the preset password must be replaced before continuing.
- The email is shown read-only as `.muted` text, not as an input.
- New password and Confirm password fields, `.btn-primary` "Save password", and a `.btn` "Sign out".
- Field messages use `.field-error` under each field.

### 3. Register

- Same centred card as Sign in.
- Name, Email, Password fields. There is no role field.
- `.btn-primary` "Create account". Link back to Sign in.

### 4. My tickets

- Page header: "My tickets", count in `.muted`, `.btn-primary` "New ticket".
- Filters row inside a `.surface` with padding `--space-4`: a search input (wider), then Status, Priority, Category, Area, Tag selects. CSS grid `1.6fr repeat(5, 1fr)`, gap `--space-3`. It wraps to two columns under 720px.
- Below that, a `.surface` holding the ticket `.table` (columns: Title, Category, Priority, Status, Assignee). Title cell: title in weight 600, then `#id` and area in `.muted` on a second line. Assignee shows "Unassigned" in `.muted` when empty.
- `TicketCard` may be used instead of the table on narrow screens.
- Pager under the table, right-aligned: `.btn .btn-small` Previous, "Page 1 of 3" in `.muted`, `.btn .btn-small` Next. Disabled buttons stay visible.
- Empty result: `.surface .empty` "No tickets match these filters." Loading: `.surface .empty` "Loading tickets…". Fetch failure: `.banner-error`.

### 5. New ticket

- Page header: "New ticket", no primary action in the header.
- One `.surface` panel, padding `--space-5`, max width 720px.
- Fields stacked with gap `--space-4`: Title, Description (textarea, min height 140px), then a two-column row of Priority and Area, then Category (tree picker, children indented `--space-5`), Tags (checkbox list), Image (file input with a `.muted` hint "png, jpg, webp, up to 2 MB").
- Priority can be a segmented control: three joined buttons, the selected one `--color-primary-soft` background with `--color-primary` text.
- Actions at the bottom, right-aligned: `.btn` "Cancel", `.btn-primary` "Create ticket".
- Each invalid field shows `.field-error` under it. A server error shows `.banner-error` above the form.

### 6. Edit ticket

- Same panel and fields as New ticket, without the image input. The existing image name is shown as `.muted` text.
- The status is shown as a read-only `.badge` next to the title, not as a field.
- Actions: `.btn` "Cancel", `.btn-primary` "Save changes".

### 7. Requester ticket

- Panel 1 (`.surface`, padding `--space-5`): `#id` in `.muted`, `.page-title`, then a row with the status badge and the priority text. Then a meta grid (`dl`, columns `120px 1fr`, 14px, labels `--color-muted`): Category path, Tags, Area, Assignee. Then the description with a top divider, max width 65ch.
- The image, when there is one, sits under the description with `--radius-sm` and a `--color-line` border, max height 320px.
- Panel 2 (`.surface`): "Comments" h2, then `CommentItem`s separated by `--color-line` borders, then `CommentComposer`.
- A hidden comment shows "Comment removed" in `.muted` italics.
- Edited comments show "edited by …" in `.muted` after the time.
- No assign, status, internal note, or delete controls.

### 8 and 9. Inbox (board and list)

- Page header: "Inbox" and a view switch on the right: two joined buttons "Board" and "List", the active one `--color-primary-soft` with `--color-primary` text.
- Board: four columns in a grid `repeat(4, minmax(0, 1fr))`, gap `--space-3`. Each column is a `--color-soft` area with `--radius` and padding `--space-2`. Column header: status badge on the left, count in `.muted` on the right. Cards are `TicketCard`, with the requester name added in `.muted`. A card being dragged gets `--shadow` and opacity 0.9; the column under it gets a dashed `--color-primary` border.
- List: same filters, table, and pager as My tickets. The table adds a Requester column (name, then email in `.muted`).

### 10. Agent ticket

- Same two panels as the requester ticket.
- Above the panels, an actions bar in a `.surface`, padding `--space-4`: Assignee select, Status select, `.btn-primary` "Save". For an admin, a `.btn-danger` "Delete ticket" on the far right, separated from the other actions.
- An internal note in the thread has a 3px left border in `--status-progress` and a small `.badge` "Internal" with `--status-progress-bg`. The composer has a Public / Internal segmented control above the textarea.
- Delete opens `ConfirmDialog`: a dark overlay `rgba(16, 24, 40, 0.5)`, a centred `.surface` dialog max width 440px, `--shadow`, title, message, then `.btn` "Cancel" and `.btn-danger` "Delete" right-aligned.

### 11. Categories and tags

- Page header: "Categories and tags".
- Two `.surface` panels side by side (grid `1fr 1fr`, gap `--space-4`; stacked under 840px), one `TreeEditor` each.
- Each panel: h2 title, an add row (name input, parent select, `.btn-primary .btn-small` "Add"), then the tree.
- Tree rows: 36px tall, children indented `--space-5`. The selected row is `--color-primary-soft`. An inactive node shows its name in `--color-muted` with a `.badge .status-closed` "Inactive".
- Row actions (`.btn .btn-small`): Rename, Deactivate or Activate, Delete. Delete uses danger text colour, not a filled red button.
- A refused delete shows a `.banner-error` inside that panel only.

### 12. Activity log

- Page header: "Activity log".
- Filters `.surface`: Action select, User select, Page size select.
- `.table` with columns When, Who, Action, Target, Old value, New value. When is `.muted`. Action is a neutral `.badge`. Old and new values are 13px monospace, wrapped, with old in `--color-muted`.
- Rows are read only: no hover pointer, no buttons.
- Pager as on My tickets.

### 13. Not found

- App shell when signed in.
- A centred `.surface .empty` with padding `--space-6`: "404" in 48px weight 700 `--color-primary`, "This page does not exist." and one `.btn-primary`: "Back to my tickets" for a requester, "Back to inbox" for an agent or admin.

## States

Every screen that loads data shows one of these. Never a blank page.

| State | How it looks |
|---|---|
| Loading | `.surface .empty` with "Loading …" |
| Empty | `.surface .empty` with a sentence saying what is missing, and the next action as a `.btn` if there is one |
| Error | `.banner-error` with a plain sentence. The rest of the page stays visible |
| Success after a save | `.banner` at the top of the page, or go to the next screen |

## Accessibility

- Every input has a visible `<label>`. Placeholders are not labels.
- Focus is always visible: `outline: 2px solid var(--color-primary)` with 2px offset on buttons, the focus ring on inputs.
- Status is never colour only: the badge always has the word.
- Clickable rows are also reachable by keyboard (a link or button inside the row).
- Text contrast stays at least 4.5:1. Do not put `--color-muted` text on `--color-soft`.

## Responsive

- Designed for desktop first (see the spec assumptions), but nothing breaks at 375px.
- Under 720px: filters become two columns, tables may switch to `TicketCard`s, the page header stacks.
- Under 840px: the categories and tags panels stack, the board scrolls sideways.
