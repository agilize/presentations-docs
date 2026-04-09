# Talk: Comece a Orquestrar

## Deployment

- **Platform**: Vercel (Agilize corporate account)
- **URL**: https://comece-a-orquestrar.vercel.app
- **CRITICAL — 404 prevention**: This project lives in a subdirectory of a larger repo. The `.vercel/project.json` ONLY exists in this subdirectory. A duplicate was removed from the repo root — **never recreate it there**.
- **ALWAYS deploy with explicit cd** in a single chained command:
  ```bash
  cd /Users/afialho/workspace/agilize/presentations-docs/2026/talk-comece-a-orquestrar && vercel --prod --yes
  ```
- Why: The Bash tool may reset cwd to the repo root between calls. If `vercel` picks up a `.vercel/project.json` from the root, or runs from the root, it deploys the entire repo (no index.html at root) → **404**.
- If a 404 happens: check `pwd` and verify `.vercel/project.json` does NOT exist at repo root.

## Workflow

- **Always commit + push** after every change to `index.html` (or any file)
- Standard flow: edit → `git add` → `git commit` → `git push` → `cd <talk-dir> && vercel --prod --yes`

## Project Structure

- Single-file HTML presentation: `index.html` (all slides, CSS, JS)
- Password gate: `api/verify.js` (Vercel serverless, reads `PRESENTATION_PASSWORD` env var)
- Config: `vercel.json` (no build, outputDirectory ".", noindex headers)

## Slide Management

- Slides use sequential `data-slide="N"` attributes starting from 0
- When adding/removing slides, update ALL of these:
  1. `data-slide` attributes on all subsequent slides
  2. Nav names array (search for `slideNames` or the array of slide name strings)
  3. `totalSlides` display span
  4. Hardcoded slide index references in JS (e.g., typewriter trigger `index === N`)
