# Talk: Comece a Orquestrar

## Deployment

- **Platform**: Vercel (Agilize corporate account)
- **URL**: https://comece-a-orquestrar.vercel.app
- **CRITICAL**: Always deploy from the talk subdirectory, NOT the repo root:
  ```bash
  cd /Users/afialho/workspace/agilize/presentations-docs/2026/talk-comece-a-orquestrar && vercel --prod --yes
  ```
  The Bash tool resets cwd between calls. If `vercel --prod` runs from the repo root, it deploys the wrong files and causes a **404**. Always use an absolute `cd` before `vercel`.

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
