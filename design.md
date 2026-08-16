# Design — Open 3x3 Torrevieja

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
editorial (Sport-cluster)

## Macrostructure family
This is a two-page **app**, not a marketing site — a public registration form
and a private admin dashboard. Neither page uses a catalog marketing
macrostructure (no hero/features/pricing shape). Both keep their existing
information architecture and are restyled through Hallmark's typography,
colour, spacing, and motion disciplines instead.

- Public page (`index.html`): masthead header (N6-style) → payment info →
  registration form → public teams list → tournament bracket → footer.
- Admin page (`admin.html`): masthead header → login gate → stats bar →
  visibility/draw controls → team roster (Workbench-style dense data view).

Both pages share one system. No diversification between them — they are the
same product.

## Theme
Custom, Sport-leaning (warm orange anchor, kept close to the club's existing
identity — orange ball, navy structure — but disciplined: accent is a
highlighter, never a fill).

- `--color-paper`    oklch(97% 0.012 55)
- `--color-paper-2`  oklch(94% 0.014 55)
- `--color-ink`      oklch(19% 0.014 55)
- `--color-ink-2`    oklch(28% 0.05 250)   /* navy — structural headings only */
- `--color-rule`     oklch(84% 0.014 55)
- `--color-neutral`  oklch(50% 0.01 55)
- `--color-accent`   oklch(62% 0.19 38)    /* orange — CTAs, links, focus, marks */
- `--color-success`  oklch(58% 0.14 155)
- `--color-warning`  oklch(66% 0.15 75)
- `--color-error`    oklch(56% 0.19 25)
- `--color-focus`    oklch(62% 0.19 38)

## Typography
- Display: Big Shoulders Display, weight 700/800, condensed — "Sport" register
- Body:    IBM Plex Sans, weight 400 (headings inside body copy at 600)
- Mono:    Geist Mono — tabular data only (DNI, dates, jersey/roster tables)
- Display tracking: -0.01em (condensed face needs less negative tracking than a grotesk)
- Type scale anchor: 1.25 ratio (major third), `--text-display: clamp(2.75rem, 5vw + 1rem, 4.5rem)`

Poppins + Inter (the previous pairing) are retired — both are on Hallmark's
banned-default list.

## Spacing
4-point named scale (`--space-3xs` … `--space-4xl`), values in `tokens.css`.
Pages use named tokens only, never raw px.

## Motion
- Easings: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-in: cubic-bezier(0.7, 0, 0.84, 0)`
- Reveal pattern: one orchestrated fade-up on load, staggered by DOM index, capped ~400ms total. No scroll-triggered fades.
- Reduced-motion fallback: opacity-only, ≤150ms.

## Microinteractions stance
- Silent success on registration (alert banner states the fact once, no confetti).
- Focus rings appear instantly, never transitioned.
- Buttons: colour/border shift + 1px lift, never scale, never bounce.

## CTA voice
- Primary CTA: solid `--color-ink-2` (navy) fill, white text, orange 2px underline on hover — never an orange gradient fill.
- Secondary / destructive: outline only, ink or error colour text.

## Per-page allowances
- Both pages: typography + colour + spacing discipline only. No hero
  enrichment, no illustration, no decorative imagery — function carries the
  page.
- Emoji retired as functional icons (previous version used emoji as the de
  facto icon system — a named anti-pattern). Kept only as a single brand mark
  in the masthead badge (🏀), nowhere else.

## What pages MUST share
- The type pairing (Big Shoulders Display + IBM Plex Sans + Geist Mono).
- The accent orange and its restrained placement (never a background fill
  over more than a few percent of the view).
- The CTA voice (navy fill primary, outline secondary).
- The masthead header pattern (badge · condensed display title · rule).

## What pages MAY differ on
- Admin page uses denser spacing and the mono face more heavily (data tables).
- Admin page's team cards use a hairline border, not the public page's
  lighter card treatment — admin is a workbench, not a brochure.

## Exports

### tokens.css
```css
:root {
  --color-paper:      oklch(97% 0.012 55);
  --color-paper-2:    oklch(94% 0.014 55);
  --color-ink:        oklch(19% 0.014 55);
  --color-ink-2:      oklch(28% 0.05 250);
  --color-rule:       oklch(84% 0.014 55);
  --color-neutral:    oklch(50% 0.01 55);
  --color-accent:     oklch(62% 0.19 38);
  --color-accent-ink: oklch(98% 0.01 38);
  --color-success:    oklch(58% 0.14 155);
  --color-warning:    oklch(66% 0.15 75);
  --color-error:      oklch(56% 0.19 25);
  --color-focus:      oklch(62% 0.19 38);

  --font-display: "Big Shoulders Display", ui-sans-serif, sans-serif;
  --font-body:    "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono:    "Geist Mono", ui-monospace, monospace;

  --space-3xs: 0.125rem; --space-2xs: 0.25rem; --space-xs: 0.5rem;
  --space-sm:  0.75rem;  --space-md:  1rem;    --space-lg: 1.5rem;
  --space-xl:  2.5rem;   --space-2xl: 4rem;    --space-3xl: 6rem;

  --text-xs: 0.72rem; --text-sm: 0.9rem;  --text-md: 1.125rem;
  --text-lg: 1.4rem;  --text-xl: 1.75rem; --text-2xl: 2.2rem;
  --text-display: clamp(2.75rem, 5vw + 1rem, 4.5rem);

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:  cubic-bezier(0.7, 0, 0.84, 0);
  --dur-micro: 120ms; --dur-short: 220ms; --dur-long: 420ms;

  --radius-card: 4px; --radius-pill: 999px; --radius-input: 4px;
}
```

## Provenance
Built via `hallmark redesign` on the existing live registration site
(index.html + admin.html), preserving all Supabase logic, form validation,
and IDs referenced by JavaScript. Only the visual/interaction layer changed.
