# Design blueprint

The reference document for this site. Every future change gets checked against it.
If a change contradicts something here, either the change is wrong or this file needs
updating — decide which, then write it down.

Last updated: 2026-08-10

---

## 1. The position

Three sites were used as reference. We take different things from each, and
deliberately not everything from any.

| Site | What we take | What we leave |
|---|---|---|
| **decentparadox.me** | `(parenthesised)` section labels, italic serif names, 2px rules, hover-reveal art, the year column | Tailwind, React islands, the density of widgets (WakaTime, Letterboxd) |
| **brittanychiang.com** | The cursor spotlight, hover states that reward exploration | Two-column sticky split layout, the tech-tag soup |
| **rauchg.com** | Editorial compression. The list *is* the page. No decorative headings. An evidence column that earns its place | The monochrome palette, the total absence of a voice |

### On the colour question

You asked whether one orange is the young move and black-and-white is the senior move.
That framing is off, and the answer is: **keep the orange.**

Rauch's site is monochrome because of what it *is*, not because of his seniority. It is a
blog archive — one content type, seventeen rows, and a name that already carries the
weight. He has nothing to route you to and nobody to persuade. Colour would be noise
there.

This site has a different job. It introduces a person nobody has heard of yet and routes
to four different kinds of work. One accent is not decoration in that context — it is
**wayfinding**. It marks exactly one thing: *this is a place you can go.* Names, links,
section labels. Nothing else.

Restraint is not the absence of colour. It is using exactly one, everywhere, for one
reason. Three colours total (paper, ink, vermilion) is already closer to Rauch than to a
typical portfolio.

What is worth taking from rauchg.com is the **writing and the format**, not the palette —
see §7. That discipline is free. Adopt it now.

**Decision recorded:** the accent lives in exactly one token, `--accent`, in one place. If
in five years you want the black-and-white version, it is a two-line change:

```css
:root            { --accent: #22262B; }   /* was #C43B18 */
:root[data-theme="dark"] { --accent: #F2EEE6; }
```

Nothing else in the stylesheet needs to move. Keep it that way — never hard-code the
orange, never introduce a second accent. That constraint is the whole point.

---

## 2. Foundations

### Colour

Three real colours. Everything else derives from them with `color-mix`, so both themes
stay in step automatically.

```css
:root {
  --bg:     #F7F2EA;   /* warm cream  */
  --fg:     #22262B;   /* near black  */
  --accent: #C43B18;   /* vermilion   */

  --line:   fg 14%;    /* hairlines, dividers      */
  --rule:   fg 26%;    /* the 2px row rules        */
  --muted:  fg 62%;    /* secondary text           */
  --wash:   accent 5%; /* hover backgrounds        */
}
:root[data-theme="dark"] { --bg: #1D2024;  --fg: #F2EEE6;  --accent: #F0836A; }
```

Rules:
- **Never** write a literal colour outside the `:root` blocks.
- The accent is reserved for: links you can click, names of things, section labels, `<em>`.
  It is never used for body copy, borders, or backgrounds (only `--wash` at 5%).
- Hierarchy comes from `--muted` and opacity, not from adding hues.

### Type

| Role | Family | Where |
|---|---|---|
| Display / names | Instrument Serif (400, italic available) | h1, section labels, entry names, peek titles |
| Body | Inclusive Sans | lede, descriptions |
| Data | JetBrains Mono | years, roles, counts, nav chrome, link list |

Rules:
- **Italic serif marks a proper noun** — the name of a job, a paper, a project, a link
  target. Roman serif is for headings about the page itself: `(work)`, `(where to)`.
- Mono is for anything machine-ish: dates, metrics, hostnames, labels.
- One display size per page. The landing h1 is the only large type on the site.

### Space and measure

```css
--pad:  clamp(1.25rem, 5vw, 5.5rem);   /* page gutter    */
--maxw: 1180px;                        /* outer shell    */
--ease: cubic-bezier(0.22, 1, 0.36, 1);
```

- Lists sit on a **46rem measure** on the landing. Section labels share it so the label,
  its right-hand note, and the rules below all line up. Never let a label float wider than
  the list it titles.
- Prose caps at `46ch`.
- Vertical rhythm is viewport-relative (`clamp(x, Nvh, y)`). The landing no longer fits one
  screen — since the timeline landed it runs to about two. The constraint that replaces it:
  **the intro and the first timeline rows hold the first screen.** A reader who never
  scrolls still learns who this is, what he does, and what he shipped most recently.

---

## 3. Motion

Motion exists to explain, never to entertain. Three permitted kinds:

1. **Entrance** — a single staggered rise on first paint. Name and lede blur in
   (`blurIn`), everything else translates up (`rise`). Delays 0.05s → 0.54s. Never longer.
2. **Hover reward** — something is revealed that was not there: the plotter art swings
   open, the peek card lifts, the underline draws.
3. **Ambient** — the cursor spotlight. One effect, page-wide, no attention cost.

Rules:
- Everything uses `--ease`. No linear, no bounce, no spring.
- Durations: 0.2–0.45s for interaction, up to 1.1s for entrance. Nothing else.
- Every motion has a `prefers-reduced-motion` answer. The spotlight is `display: none`
  there; the peek logo sits in its final position.
- Anything hover-only is `display: none` under 860px. A touch device must never depend on
  a state it cannot enter.

---

## 4. Components

The current vocabulary. Reuse these before inventing anything.

**`.bar`** — sticky, blurred, transparent until scrolled, then a hairline. Landing shows
`portfolio / 2026`; subpages show the `Rishab` wordmark (the two swap so the
view-transition name stays unique).

**`.block-head`** — a `(parenthesised)` serif label left, a mono note right, wrapping on
narrow screens. This is the only heading form on the site. There are no `<h3>`s.

**`.dests` / `.dest`** — the landing's four routes. `01` mono number, italic serif name,
muted description, `↗`. 2px rules top and bottom.

**`.tl` / `.tl-row`** — the landing timeline, and the page's main argument. A three-column
grid (year / name + one-liner / arrow) with a fourth element, `.tl-fold`, occupying a
second grid row beneath. **The year prints only when it changes** — repeats stay in the DOM
at `opacity: 0` so a screen reader still hears every one. Hover or keyboard focus opens the
fold by interpolating `grid-template-rows: 0fr → 1fr`, revealing a longer sentence and a
mono destination hint (`→ ieeexplore.ieee.org`), so the reader is told where a click leads
before they spend it.

**`.rows` / `.row-link`** — the subpage entry. Five columns:

```
[ art ] [ name ] [ role + description ] [ year ] [ ↗ ]
   0px    8–14rem      1fr                6.5rem   1.5rem
```

Column 1 is zero-width until hover, then opens to 5.5rem and the plotter drawing fades in
— animated by interpolating `grid-template-columns`, which is why every track is a
concrete length (no `auto`). On mobile the grid collapses to name / description / year
stacked, and the art is dropped.

**`.peek`** — the Wikipedia-style hover card on the elsewhere links. Logo, italic serif
title, one-line description, mono hostname, notch pointing back at the link. The logo
lifts 0.1s *after* the card lands — two beats, not one. Opens on `:hover` and
`:focus-visible`. `pointer-events: none` and `aria-hidden`, so it can never steal the
cursor or duplicate the link for a screen reader.

**Cursor spotlight** — `body::before`, fixed, `z-index: -1`. Works because `html` has no
background, so `body`'s background paints the canvas and the pseudo-element lands above
the paper and below all content. `--mx` / `--my` are written once per frame, rAF-throttled,
only under `(hover: hover)`.

**`footer`** — mono meta line, then the giant `Rishab` bleeding past both edges.

---

## 5. Constraints

Non-negotiable. These are the reason the site is fast and will still build in ten years.

- **No frameworks, no build step, no dependencies.** Three files: `index.html`,
  `styles.css`, `script.js`. Subpages are static HTML sharing the same two assets.
- **JS is enhancement only.** With scripting off you lose the theme toggle, the mobile
  menu and the spotlight. You lose no content and no navigation.
- **One stylesheet.** Currently ~370 lines. If it passes 600, something has gone wrong.
- **Accessibility is not a phase.** Skip link, visible focus rings, real semantics,
  `prefers-reduced-motion`, `prefers-color-scheme`, keyboard parity for every hover state.
- **Art is generated, never hand-drawn.** `tools/art_gen.py` emits `currentColor` linework
  so one file themes for both modes. The subject matter is the actual research.
- **Every page works before its decoration loads.** No layout depends on an SVG, a font,
  or a script arriving.
- **No filled buttons.** There is not one on the site, and adding one would instantly make
  it the loudest object on a page built entirely from text and hairlines. Calls to action
  are links inside sentences. A résumé button was drawn, questioned, and cut for exactly
  this reason — *findable* and *loud* are different problems, and only the first is wanted.
- **No metric walls.** Numbers appear inside sentences, never as badges or stat tiles. A
  counted brag reads junior; the same number doing narrative work reads as evidence.

---

## 6. Themes

Set before first paint by an inline script in `<head>` so there is no flash. Order:
saved choice → system preference → light. Both themes are first-class; neither is the
"real" one. Every colour is a token, so nothing needs a dark-mode override.

---

## 7. Voice — the rauchg lesson

This is the part of rauchg.com worth copying, and it costs nothing.

- **Plain words for hard things.** "Taught computers to spot broken bones in X-rays," not
  "leveraged deep learning for musculoskeletal anomaly detection." The work is impressive;
  the sentence does not have to be.
- **Numbers instead of adjectives.** "92.22% across 6,229 X-rays" beats "highly accurate."
  Never write "passionate," "cutting-edge," "innovative," or "leveraged."
- **One line per thing.** If an entry needs two sentences, the second one belongs on its
  own page.
- **Suppress what repeats.** Rauch prints the year only when it changes. Any column where
  a value repeats down the list should go quiet on the repeats. The landing timeline does
  this; do it anywhere else a column repeats.
- **Say where a link goes before it is clicked.** The timeline's fold and the peek cards
  both name the destination. Nobody should have to spend a click to find out.
- **Say the thesis once, in its strongest form.** A flat statement of an idea followed by a
  vivid one spends the vivid one — the good sentence arrives as a restatement instead of a
  reveal. The landing's lede used to open "I build AI that runs on real devices" and then
  land "something that needs a data centre, made to fit in a pocket." Same claim, twice. The
  first was cut and the second got its job back.
- **State a filter, not an appeal.** Leading with what you want *from* a reader — "open to
  full-time roles" — is a request placed before they have any reason to care, and breadth
  reads as need. Leading with what interests you lets them self-select, which reads as
  confidence. The corollary: demote formalities rather than opening with them. "There's a
  résumé if you need the formal version" tells a recruiter it exists while telling everyone
  else it isn't the point; "start with the résumé" casts every reader as an evaluator
  before they chose to be one.
- **Emphasis marks a thing, never a count.** `<em>` (italic serif, accent) is for the name
  of something — *talking avatars*, a paper, a place. Italicising a number turns prose back
  into a badge, which is the thing §5 forbids. "three published papers" stays plain.
- **No headings that say nothing.** No "Welcome," no "About Me," no "My Work." The
  `(parenthesised)` labels are the whole heading budget.
- **Say what it does, not what it is.** "Watches and listens to a YouTube video, then
  answers questions about it" — not "an AI-powered multimodal video understanding system."
- **Lowercase in the chrome, sentence case in the prose.** `(work)`, `four rooms`,
  `/2026 — now`.

---

## 8. Where things stand

```
index.html          landing — name, lede, four routes, elsewhere links
work/               4 entries   research/  3 papers
projects/           4 entries   writing/   1 post
404.html            untracked, unverified
styles.css          the whole design system
script.js           theme, menu, scroll hairline, spotlight
tools/art_gen.py    generates the row art (its hero() output is now unused)
```

Done so far: the oversized landing plot removed; parenthesised labels; italic serif names;
2px rules; hover-reveal row art; blur-in entrance; cursor spotlight; peek cards on the
elsewhere links; the thesis line, the open-to line carrying résumé and email, and the
nine-row timeline. Verified in both themes, desktop and mobile, keyboard focus included,
in headless Chrome.

**A note for future verification:** headless Chrome's `--virtual-time-budget` does not
advance the transition clock, so any transitioned property read back through
`getComputedStyle` reports its *start* value and looks broken when it is not. To check a
hover or focus end state, append `transition: none !important` to a throwaway copy of the
stylesheet and measure that, or just take a screenshot.

---

## 9. Phases

To work through one at a time. Not ordered by priority yet — that is the next
conversation.

| # | Phase | The question it answers |
|---|---|---|
| 1 | **Copy audit** | Landing done — intro de-duplicated, thesis tightened, emphasis rule settled. The four subpages have still not been re-read against §7. |
| 2 | **The empty right half** | Still open. The timeline fills the page vertically but the right half of the landing is still bare. |
| 3 | **Evidence** | ~~Metric strip~~ — rejected, see §5. Year-suppression shipped. Citations and stars remain possible on the subpages. |
| 3b | **Location** | Whether the role line carries a city. Recruiters filter on it; the fact has not been supplied. |
| 4 | **Depth** | Every entry currently links away. Do papers and projects deserve internal pages? |
| 5 | **Writing** | One post is not a section. Grow it or fold it in. |
| 6 | **Type scale** | Formalise the sizes as tokens instead of per-component clamps. |
| 7 | **Metadata** | OG image, favicon, sitemap, the untracked 404. |
| 8 | **Audit** | Lighthouse, keyboard-only pass, screen-reader pass, dead CSS sweep, drop `art_gen.hero()`. |
| 9 | **The monochrome switch** | Not now. Recorded in §1 so it stays a two-line change. |
