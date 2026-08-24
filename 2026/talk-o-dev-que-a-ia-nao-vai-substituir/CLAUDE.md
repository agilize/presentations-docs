# Talk: O Dev que a IA Não Vai Substituir (UFBA)

## Deployment

- **Platform**: Vercel (Agilize corporate account)
- **First deploy**: run `vercel --prod --yes` from THIS directory to link/create the project; set the `PRESENTATION_PASSWORD` env var on the Vercel project (the password gate calls `api/verify.js`).
- **CRITICAL — 404 prevention**: This project lives in a subdirectory of a larger repo. `.vercel/project.json` must ONLY exist in this subdirectory — **never at the repo root**.
- **ALWAYS deploy with explicit cd** in a single chained command:
  ```bash
  cd /Users/afialho/workspace/agilize/presentations-docs/2026/talk-o-dev-que-a-ia-nao-vai-substituir && vercel --prod --yes
  ```
- Why: The Bash tool may reset cwd to the repo root between calls. If `vercel` runs from the root, it deploys the entire repo (no index.html at root) → **404**.

## Local dev

- Static server is enough: `python3 -m http.server <port>` from this directory.
- The password gate auto-bypasses on `localhost`/`127.0.0.1` (see the gate script in `index.html`). In production it validates via `/api/verify` + `PRESENTATION_PASSWORD`.

## Workflow

- **Always commit + push** after every change to `index.html` (or any file)
- Standard flow: edit → `git add` → `git commit` → `git push` → `cd <talk-dir> && vercel --prod --yes`

## Project Structure

- Single-file HTML presentation: `index.html` (all slides, CSS, JS)
- Password gate: `api/verify.js` (Vercel serverless, reads `PRESENTATION_PASSWORD` env var)
- Config: `vercel.json` (no build, outputDirectory ".", noindex headers)

## Slide Management

- Slides use sequential `data-slide="N"` attributes starting from 0 — but the engine navigates by DOM order; keep both in sync
- When adding/removing slides, update ALL of these:
  1. `data-slide` attributes on all subsequent slides
  2. `slideTitles` array (preview tooltips)
  3. `chapterSlides` array (nav dot styling)
  4. `totalSlides` display span
  5. Hardcoded slide index references in JS (typewriter trigger: `index === N` / `current === N` — currently 50)
