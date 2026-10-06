# A Field Guide to the Tribes of Silicon Valley

A microsite from the Foundation for American Innovation: 27 tribes in seven families, a three-axis habitat map, a 25-question sorting quiz, a phrasebook, and a public wall of quiz takers.

Live (pre-launch, not indexed): https://tribes.thefai.workers.dev

## Editing

The site is one file, `index.html`. All copy lives in the first `<script>` block, between `CONTENT` and `END OF CONTENT`:

- `SITE`: title, dek, intro, footer; `WALL`: the wall's API address and privacy note
- `AXES`: what 0 and 100 mean on speed (`x`), steering (`y`) and destination (`d`)
- `FAMILIES` and `TRIBES`: one object per tribe, with its position on the three axes
- `QUIZ`: `likert` statements move the axes by `w` per step of agreement; `choice` questions move them by `m` and give bonus points `b` to tribes
- `PHRASES`: the phrasebook; `ids` link a term to tribes

Wrap book, magazine and blog titles in `*asterisks*` for italics; use curly quotes. `content-source.js` is a standalone copy of the block for reviewing diffs; the site reads only `index.html`.

Tribe ids also appear in `worker/tribes.js`. Add or rename a tribe in both places.

After changing tribes or quiz weights, run `node tools/check-quiz.mjs`. It checks the data, shows how 100,000 random quiz takers are distributed, and confirms every tribe can be reached.

## Avatars and plates

Each tribe has an avatar (a portrait) in `AVATARS` and a plate (abstract emblem art) in `PLATES`, keyed by tribe id, as `"viewBox|shapes"`. Both were generated with QuiverAI Arrow 2, snapped to the four FAI master fills (`#FF4F00`, `#121212`, `#F3F3F3`, `#D9D9D6`) and optimized with SVGO. The characters are generic types, not real people. Ancestral tribes sit on a Timberwolf circle, the rest on orange. Plates head each tribe's entry, the quiz result, the map's hover cards and the shareable result card, and crop to fit their box. A tribe without an avatar renders a plain placeholder; one without a plate shows none.

The cover art beside the title (a pith helmet and binoculars) is made the same way. `og.png` is the link-preview image built from it; the Worker points the page's `og:image` and `og:url` at whichever domain served the page.

## Hosting

A Cloudflare Worker named `tribes` on FAI's Cloudflare account serves the page, the wall API and the moderation page. Configuration is in `wrangler.jsonc`; `.assetsignore` keeps everything except the site files out of the published assets.

```
npm install
npm test                 # Worker tests and the quiz check
npx wrangler dev         # local copy with a local database
npm run deploy           # publish (needs the FAI Cloudflare token in CLOUDFLARE_API_TOKEN)
npm run migrate          # apply new files in worker/migrations to the live database
```

Every response carries `X-Robots-Tag: noindex` while `NOINDEX` is `"1"` in `wrangler.jsonc`. Set it to `"0"` and deploy at launch.

The page also works from any static host (GitHub Pages, for example). Off the Worker it calls the wall at `WALL.API`, and the Worker accepts posts only from origins listed in `ALLOWED_ORIGINS`.

### tribes.thefai.org

thefai.org's DNS is at Hover, and `*.thefai.org` already points at Vercel, so the subdomain needs one change by whoever manages those accounts. Either:

- in FAI's Vercel team, add `tribes.thefai.org` to a project that deploys this repository (no build step; no DNS change needed); or
- at Hover, add a `CNAME` record `tribes` → `fai-org.github.io`, then set the custom domain in this repository's GitHub Pages settings.

A Worker custom domain would need thefai.org's DNS moved to Cloudflare. `tribes.thefai.org` is already in `ALLOWED_ORIGINS`.

## The wall

After the quiz, people can add their initials. The wall shows a running count, a tribe census, recent sightings, and faint dots on the map. Entries live in the D1 database `tribes-wall`.

- **Rules:** one to three letters, stored in capitals; the box accepts nothing else, and periods and spaces are dropped (`c.m.` becomes `CM`). A filter (`worker/filter.js`) blocks letter combinations that read as profanity, slurs or hate symbols, plus any word moderators add. The page inlines the same file for instant feedback.
- **Limits:** one entry per browser, five tries per minute per IP address (IPs are not stored), and 30 entries a minute overall.
- **Moderation:** https://tribes.thefai.workers.dev/admin, behind Cloudflare Access (FAI Google sign-in, any `@thefai.org` address). Hide or delete entries, download a CSV, and add words to the blocklist.
- **Inside claude.ai** the page uses the artifact's built-in database instead, visible only inside the FAI organization.

## Fonts

Uses IBM Plex from Google Fonts. The title is set in the licensed Schmalfette Grotesk, but this site ships it as vector outlines in `index.html`, not as a font file: the license limits self-hosting the font to FAI-owned properties, and the binaries stay out of Git. If you change `SITE.title`, regenerate the outlines with the FAI brand kit's `SchmalfetteGrotesk.otf`:

```
npm i --no-save opentype.js
node tools/outline-display.mjs /path/to/SchmalfetteGrotesk.otf "A field guide" "to the tribes" "of Silicon Valley"
```

Each argument is one line of the title, 2–3 words per line.
