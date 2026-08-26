# Talk: Frankfurt no meu trackpad (tech team, 2026)

Deck interno para o time de tech da Agilize sobre como o controle remoto por celular da talk da SECOMP foi construído: caminho físico dos pacotes (cabos submarinos, brokers na AWS), protocolos (MQTT/WSS, WebRTC DataChannel, ICE/STUN), o incidente na rede da UFBA, segurança (TLS, endpoints, supply chain) e riscos do vibecoding.

## Deployment

- **Ainda não tem projeto Vercel.** Quando criar, seguir o padrão da SECOMP: projeto próprio na conta Agilize, `.vercel/project.json` **só neste subdiretório** (nunca na raiz do repo), deploy com `cd` explícito:
  ```bash
  cd /Users/afialho/workspace/agilize/presentations-docs/2026/talk-frankfurt-no-meu-trackpad && vercel --prod --yes
  ```
- O painel do remoto (tecla R) gera o QR em runtime a partir de `location.href`, então funciona em qualquer URL sem editar nada.

## Local dev

- `python3 -m http.server <porta>` a partir deste diretório. Abrir `index.html`; o remoto em `/remote.html?c=<código>`.
- Para testar o remoto na mesma máquina: abrir `remote.html` numa segunda aba com o código do painel (ambos falam com o broker público; o P2P fecha via candidatos host).

## Estrutura

- `index.html` — deck (single-file). CSS base e o bloco laser/spot/zoom são cópias do deck da SECOMP; o resto (mapa, diagramas, remoto) é próprio.
- `remote.html` — controle pelo celular. Tópico `agz-remote-talk/<code>/{cmd,state,sig}` (prefixo diferente da SECOMP para não colidir).
- `assets/` — tudo vendorizado, **zero JS de CDN em runtime** (o deck prega isso):
  - `mqtt.min.js` — mqtt 5.10.1 (unpkg) · sha384-u4uqeACkFcoKl57rBQJHVGDd1pqhW4w8X3WjTu1ZksPdxoLqdt34jpoNkJisE25W
  - `qrcode.js` — qrcode-generator 1.4.4 (Kazuhiko Arase, MIT) · sha384-8FWZA6BGMXhsfO+BLtrJK0We6gg5o1JyO8xQm6peWDEUs17ACA5ziE/NIAkl9z2k
  - `world-dots.js` — Natural Earth 110m land (domínio público), rasterizado em grade de 1° para o mapa pontilhado (gerado com PIL; região lon −140..45, lat 72..−48)
  - ícones lucide-static 1.34.0 (ISC) inlinados no HTML na montagem
  - `ufba-erro.png` — screenshot real do erro no Wi-Fi da UFBA; `logo-branca.png`
- Fonte (Google Fonts) continua externa, como nos outros decks.

## Diferenças do remoto em relação à SECOMP

- `connectTimeout` 12 s (HiveMQ levou ~8 s para aceitar conexão em 3 de 8 medições).
- Falha nos dois brokers → `HEAD` na própria página para distinguir "sem internet" de "rede bloqueia 8084/8884 — use o hotspot".
- QR embute `?c=<código>`; `state` inclui `p2p: true/false`; erros WebRTC aparecem no status em vez de `catch` vazio.
- Painel do R desliga os overlays CRT (`body.no-crt`) para o QR escanear limpo.

## Slide management

- Slides navegam por ordem no DOM; `data-slide` é só documentação — manter em sincronia.
- Ao inserir/remover slides, atualizar: `slideTitles`, `chapterSlides` (hoje `[0, 4, 9, 19, 23, 29]`) e `FINAL_TYPEWRITER` (hoje 33) no motor.
- Os mapas são construídos em JS (`build('mapCloud','cloud')` / `build('mapP2P','p2p')`) antes do motor, porque os thumbnails clonam o DOM dos slides.
- Dados medidos nos slides (traceroute, latências, regiões dos brokers) são de 26/08/2026 a partir de Salvador; refazer se o deck for reapresentado muito depois.

## Workflow

- Commit + push após cada alteração, como nos outros decks.

## Testes (como foi validado em 26/08/2026)

- Capturas headless de todos os slides: `playwright-core` (existe em `~/.nvm/versions/node/v22.14.0/lib/node_modules/agent-browser/node_modules`) + Google Chrome, abrindo `index.html#N` (deep link por hash) com um `<style>` injetado que zera as transições.
- E2E do remoto: duas páginas no mesmo browser — `index.html` (tecla R, lê o código e a URL do painel) e `remote.html?c=<código>`; validou broker, P2P (`conectado · p2p`), `state` sincronizado, próximo slide, laser e o mapeamento absoluto do trackpad (erro de 1 px).
- Servidor local: `python3 -m http.server <porta>` — a 8765 costuma estar ocupada nesta máquina; usar outra.
