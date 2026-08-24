# Talk: O Dev que a IA Não Vai Substituir (SECOMP/UFBA)

## Deployment

- **Platform**: Vercel (Agilize corporate account, scope `agilize-contabilidade-online`)
- **Project**: `dev-ia-secomp` → https://dev-ia-secomp.vercel.app (public, NO password gate)
- **CRITICAL — 404 prevention**: This project lives in a subdirectory of a larger repo. `.vercel/project.json` must ONLY exist in this subdirectory — **never at the repo root**.
- **ALWAYS deploy with explicit cd** in a single chained command:
  ```bash
  cd /Users/afialho/workspace/agilize/presentations-docs/2026/talk-o-dev-que-a-ia-nao-vai-substituir && vercel --prod --yes
  ```
- Why: The Bash tool may reset cwd to the repo root between calls. If `vercel` runs from the root, it deploys the entire repo (no index.html at root) → **404**.

## Local dev

- Static server is enough: `python3 -m http.server <port>` from this directory.
- No password gate — the presentation is public.

## Workflow

- **Always commit + push** after every change to `index.html` (or any file)
- Standard flow: edit → `git add` → `git commit` → `git push` → `cd <talk-dir> && vercel --prod --yes`

## Project Structure

- Single-file HTML presentation: `index.html` (all slides, CSS, JS)
- Config: `vercel.json` (no build, outputDirectory ".", noindex headers)

## Slide Management

- Slides use sequential `data-slide="N"` attributes starting from 0 — but the engine navigates by DOM order; keep both in sync
- When adding/removing slides, update ALL of these:
  1. `data-slide` attributes on all subsequent slides
  2. `slideTitles` array (preview tooltips)
  3. `chapterSlides` array (nav dot styling)
  4. `totalSlides` display span
  5. Hardcoded slide index references in JS (typewriter triggers: final quote `index === 49`, identity quote `index === 16`)
