# Litrix

Non-commercial learning demo for EU AI Act **Article 4** literacy and training-register practice (European SME contexts). Built in Espoo, Finland. **Not a company SaaS product** — open via the Portfolio card only.

**Live:** [litrixeu.vercel.app](https://litrixeu.vercel.app)

## Demo object

The learning hook is a dated, SHA-256-verified, exportable **training register** entry — educational, not a paid seat ladder.

Typical flow: intake → deterministic Article 4 classification → short literacy module (Mistral + fallback curriculum) → quiz → register export.

## Posture

- SEO: `Allow: /` + `noindex` / `X-Robots-Tag`
- Shared demo register / demo-login framing — no pricing or Offer schema

## Stack

- Plain HTML / JS on Vercel (no build step)
- One serverless function · Mistral (`mistral-small-latest`)

## Docs

Project context for agents: [`CLAUDE.md`](./CLAUDE.md).

## License

Proprietary — see [`LICENSE`](./LICENSE). All rights reserved.
