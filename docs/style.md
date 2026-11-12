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
| `--color-primary` | `#0c4da2` | Brand (ITC blue, sampled from the school logo). Primary buttons, links, focus ring |
| `--color-primary-hover` | `#093d82` | Primary button hover |
| `--color-primary-soft` | `#e7eef9` | Selected segment, selected row, picked tag |
| `--color-ink` | `#1a2130` | Body text, headings |
| `--color-muted` | `#5a6474` | Secondary text, labels, timestamps |
| `--color-placeholder` | `#969eab` | Input placeholders |
| `--color-line` | `#e0e4eb` | Card borders, dividers, table rows |
| `--color-line-strong` | `#c4cad4` | Inputs, secondary buttons, table header rule |
| `--color-paper` | `#f5f7fa` | Page background (cool grey), filter bar, row hover |
| `--color-sheet` | `#ffffff` | Cards, panels, inputs |
| `--color-soft` | `#eef1f6` | Button hover, subtle fills |
| `--color-bar` | `#0f2140` | Top bar background (deep navy) |
| `--color-bar-text` | `#c2cde0` | Top bar links and user text |
| `--color-bar-accent` | `#8cb6f0` | Active nav underline and focus outline in the top bar |
| `--color-bar-line` | `#3a4c6b` | Role tag border in the top bar |
| `--color-danger` | `#b42318` | Errors, delete actions |
| `--color-danger-soft` | `#fdf0ee` | Error banner background |

### Status and priority

| Value | Class | Look |
|---|---|---|
| OPEN | `.status-open` | Filled dot `--status-open` (blue), ink text |
| IN_PROGRESS | `.status-in_progress` | Filled dot `--status-progress` (amber), ink text |
| RESOLVED | `.status-resolved` | Filled dot `--status-resolved` (green), ink text |
| CLOSED | `.status-closed` | Hollow dot `--status-closed`, muted text |
| HIGH | `.priority-high` | `--priority-high`, weight 600 |
| MEDIUM | `.priority-medium` | `--priority-medium` |
| LOW | `.priority-low` | `--priority-low` |

The class is built from the value, so new code stays consistent:

```vue
<span class="badge" :class="`status-${ticket.status.toLowerCase()}`">
  {{ statusLabel(ticket.status) }}
</span>
<span class="priority" :class="`priority-${ticket.priority.toLowerCase()}`">
  {{ priorityLabel(ticket.priority) }}
</span>
```

Status is always a `.badge`: an 8px dot plus the word, no filled pill. Priority is plain coloured text in sentence case. Always use `statusLabel` and `priorityLabel` from `lib/labels.ts`, never the raw enum, so every screen says "In progress" and "Medium" the same way.

### Type

| Use | Size | Weight |
|---|---|---|
| Body | 15px, line-height 1.5 | 400 |
| Page title (`.page-title`) | 22px | 650 |
| Section heading (h2 in a panel) | 16px | 600 |
| Card title | 15px | 600 |
| Table, meta grid | 14px | 400 |
| Muted text (`.muted`), status, priority, field label | 13px | 400 / 600 |
| Table header | 12.5px | 600 |
| Ticket id (`.mono`) | 12.5px monospace | 400 |

Font is `--font-sans`, the system UI font. No web font is loaded. Ticket ids such as `#12` use `--font-mono` through the `.mono` class.

### Spacing, radius, shadow

| Variable | Value |
|---|---|
| `--space-1` … `--space-6` | 4, 8, 12, 16, 24, 32 px |
| `--radius-sm` | 4px: buttons, inputs, banners |
| `--radius` | 6px: cards, panels, dialogs |
| `--shadow` | Only floating things: dropdown menu, dialog. Cards and panels have a border and no shadow |
| `--page-max` | 1080px content width. Forms cap at 720px, ticket detail at 800px |

Space inside a panel is `--space-5`. Space between panels or cards is `--space-3` to `--space-4`. Space between a page header and content is `--space-5`.

## Shared classes

| Class | What it is |
|---|---|
| `.page` | Centred main column, max width 1080px. Every view's `<main>` uses it |
| `.page-head` | Header row: title and `.muted` subline left, primary action right. Stacks under 720px |
| `.page-title` | The h1 of a screen |
| `.surface` | White box, 1px `--color-line` border, 6px radius, no shadow. Cards and panels |
| `.mono` | Monospace 12.5px, for ticket ids |
| `.btn-link` | Text button styled as a link, 13px. Small secondary actions such as "Clear filters" |
| `.auth-page`, `.auth-card`, `.auth-brand`, `.auth-switch` | Sign in and Register layout. Change password uses them too |
| `.muted` | Secondary 13px text |
| `.btn` | Secondary button: white, grey border |
| `.btn-primary` | Main action on the screen (blue). At most one per area |
| `.btn-small` | Compact button inside cards, rows, pager |
| `.badge` + `.status-*` | Status: dot plus word |
| `.priority` + `.priority-*` | Priority text |
| `.banner` | Info message, 3px left border |
| `.banner-error` | Error message (red) |
| `.empty` | Empty state text, centred. Put it on a `.surface` |

### Still to add to `theme.css`

These are needed by the screens below. Add them to `theme.css` when the first screen uses them, then move them to the table above.

Already in `theme.css`: `.field` (grid, gap 6px), `.label`, `.input` (padding 7px 10px; focus is a `--color-primary` border plus a 1px ring of the same colour), `.field-error`, and `.table` (header 12.5px muted on white with a `--color-line-strong` rule under it; rows 14px, hover `--color-paper`, no border under the last row).

| Class | Spec |
|---|---|
| `.btn-danger` | Red background `--color-danger`, white text. Only for permanent delete and the confirm button in the delete dialog |
| `.spinner` or loading text | Muted "Loading…" in a `.surface .empty`, until a real spinner exists |

## Layout

### App shell (every signed-in screen)

- Top bar, full width, dark (`--color-bar`), height 52px, 14px text in `--color-bar-text`.
- Left: the ITC logo (32px, round, white behind it), then "Helpdesk" in white weight 650. It links to the home list.
- Then the nav links. Requester: My tickets, New ticket. Agent and admin: Inbox, Categories and tags, Activity log. The active link is white with a 2px `--color-bar-accent` bottom border.
- Right: user name, the role in a small outlined tag, then "Sign out" as an underlined text button.
- Under 720px the nav moves to a second row and the name is hidden.
- Below the bar, the view's `<main class="page">` on the `--color-paper` background.
- One shell for all roles. Admin-only controls appear inside screens, not in a different layout.

### Page header

A row at the top of the page: title (`.page-title`) with an optional `.muted` subline on the left, and the primary action (`.btn-primary`) on the right. Flex, `align-items: flex-end`, `justify-content: space-between`, margin-bottom `--space-5`.

## Screens

Same order as the wireframes and `docs/components.md`.

### 1. Sign in

- No app shell. A white `.surface .auth-card` centred in the page, width `min(400px, 100%)`, padding `--space-6`.
- The brand (the ITC logo at 40px, round, then "Helpdesk") is the first line inside the card.
- Title "Sign in" with a one-line `.muted` subline, then Email and Password `.field`s stacked with gap `--space-4`.
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
- One `.surface` holds both the filters and the results. The filters are a bar at its top on `--color-paper` with a bottom border, padding `--space-4`: a search input, then Status, Priority, Category, Area, Tag selects, gap `--space-3`. "Clear filters" is a `.btn-link` on the same line as the Search label. It wraps to two columns under 720px.
- Under the bar, in the same box, the ticket `.table` (columns: Title, Category, Priority, Status, Assignee). Title cell: title in weight 600, then `#id` (`.mono`) and area in `.muted` on a second line. Assignee shows "Unassigned" in `.muted` when empty. Loading and empty text sit in the same box.
- `TicketCard` may be used instead of the table on narrow screens.
- Pager under the table, right-aligned: `.btn .btn-small` Previous, "Page 1 of 3" in `.muted`, `.btn .btn-small` Next. Disabled buttons stay visible.
- Empty result: `.surface .empty` "No tickets match these filters." Loading: `.surface .empty` "Loading tickets…". Fetch failure: `.banner-error`.

### 5. New ticket

- Page header: "New ticket", no primary action in the header.
- One `.surface` panel, padding `--space-5`, max width 720px.
- Kept short enough to fit a laptop screen without scrolling. Fields stacked with gap `--space-4`: Title, Description (textarea, min height 110px, the "what happened, what you expected, what you tried" hint is its placeholder), then one three-column row of Priority, Category (single `CatalogPicker`), and Area, then Tags.
- The row collapses to one column under 640px.
- Priority is a segmented control: three joined buttons, the selected one `--color-primary-soft` background with `--color-primary` text.
- Category and Tags use `CatalogPicker`, so neither opens the native OS menu.
- Category: looks like a select (text and a chevron, no pills). The chosen path is shown as the value. The dropdown has the parent nodes as small uppercase `--color-muted` headings that cannot be picked, with their leaf categories indented under them. Error state is a `--color-danger` border.
- Tags: one input-sized box that holds the chosen tags as removable pills (`--color-primary-soft`, `--color-primary` border and text, full path such as `Student / Year 1`, then a `×` button) followed by an "Add tag…" text input. On focus a dropdown opens under it (`--shadow`, max height 240px, scrolls): active tags in tree order, children indented `--space-4`, the highlighted row `--color-soft`, chosen rows in `--color-primary` with a ✓. Typing filters by full path and shows the matches flat. The box stays one line tall however many tags exist.
- Action row at the bottom, above a `--color-line` top border: on the left a `.btn .btn-small` "Attach screenshot" with the file name, or the `.muted` hint "Optional · PNG, JPG, WebP, 2 MB", next to it; on the right `.btn` "Cancel", `.btn-primary` "Create ticket".
- Each invalid field shows `.field-error` under it. A server error shows `.banner-error` above the form.

### 6. Edit ticket

- Same panel and fields as New ticket, without the image input. The existing image name is shown as `.muted` text.
- The status is shown as a read-only `.badge` next to the title, not as a field.
- Actions: `.btn` "Cancel", `.btn-primary` "Save changes".

### 7. Requester ticket

- A "← My tickets" link above the panels. Page max width 800px.
- Panel 1 (`.surface`, padding `--space-5`): `#id` in `.muted .mono`, `.page-title`, then a row with the status badge, a dot, and "Medium priority". Then a meta grid (`dl`, columns `120px 1fr`, 14px, labels `--color-muted`): Category path, Tags, Area, Assignee, with a divider under it. Empty values show "None", "Not given" or "Unassigned" in `.muted`. Then the description, max width 65ch.
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
- An internal note in the thread has a 3px left border in `--status-progress` and a small `.badge` "Internal" whose dot is `--status-progress`. The composer has a Public / Internal segmented control above the textarea.
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
- A centred `.surface .empty` with padding `--space-6`: "404" in 40px `.mono` `--color-muted`, "This page does not exist." and one `.btn-primary`: "Back to my tickets" for a requester, "Back to inbox" for an agent or admin.

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
