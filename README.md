# A Field Guide to the Tribes of Silicon Valley

A microsite from the Foundation for American Innovation: 44 tribes, a three-axis habitat map, and a 21-question sorting quiz.

## Editing

Everything is in `index.html`. All copy lives in one block at the top of the second `<script>` tag, between `CONTENT` and `END OF CONTENT`:

- `SITE`: title, subtitle, intro, footer
- `TRIBES`: one object per tribe. `x` = speed (0 halt, 100 floor it), `y` = steering (0 markets, 100 strong state), `d` = destination (0 stay human, 100 transcend)
- `QUIZ`: `likert` items shift the axes by `w` when the reader agrees; `choice` items shift by `m` and give bonus points `b` to specific tribes
- `TIMELINE`, `PHRASES`, `TIPS`, `WARNING`

`content-source.js` is a standalone copy of the same block for reviewing diffs; the live site reads only `index.html`.

## Deploying

Enable GitHub Pages (Settings → Pages → Deploy from branch → `main` / root). The site is a single static file with no build step.

## Fonts

Uses IBM Plex from Google Fonts. The hero title is set in the licensed Schmalfette Grotesk, but this site ships it as vector outlines in `index.html`, not as a font file: the license limits self-hosting the font to FAI-owned properties, and the binaries stay out of Git. If you change `SITE.title`, regenerate the outlines with the FAI brand kit's `SchmalfetteGrotesk.otf`:

```
npm i --no-save opentype.js
node tools/outline-display.mjs /path/to/SchmalfetteGrotesk.otf "A field guide" "to the tribes" "of Silicon Valley"
```

Each argument is one line of the title, 2–3 words per line.

## Plates

Each tribe has a Bauhaus emblem in `PLATES`, just after the content block, keyed by tribe `id`. Plates are drawn on a 120 × 120 grid with four fills: `a` orange, `k` Cod Gray, `p` white, `r` Timberwolf (`as`/`ks`/`ps`/`rs` for strokes). A new tribe without a plate simply renders without one.

## The wall (shared quiz results)

Quiz takers can add their initials or first name to a public wall that shows a running count, a tribe census, recent sightings, and faint dots on the habitat map.

- **On claude.ai** the wall uses the artifact's built-in database. That version is visible only inside the FAI organization.
- **On GitHub Pages** it uses a Google Sheet:
  1. Create a Google Sheet, open Extensions → Apps Script, and paste `wall/Code.gs`.
  2. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone.
  3. Paste the web app URL into `WALL.SHEET_URL` near the top of the content block in `index.html`, and commit.
- If `SHEET_URL` is blank, the wall and the sign-up box are hidden.

Moderation: type `HIDE` in column G of a row, or delete the row. Names are limited to 20 characters and two words, with a basic profanity filter on both the page and the script. The script also caps writes at 30 per minute.

If "Anyone" is greyed out in step 2, your Google Workspace admin restricts public Apps Script deployments; use a personal Google account or ask the admin.
