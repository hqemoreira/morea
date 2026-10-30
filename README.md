# Morea Evidence Pack

Personal reskilling project · Non-commercial · Not a product for sale · No accounts / no billing.

Educational prototype for an EU AI Act **Article 4** literacy trail aimed at small European professional firms: inventory AI tools → exposure intake → role-aware module → quiz → optional policy draft → exportable **Evidence Pack**.

**Public brand:** Morea · **GitHub:** [hqemoreira/morea](https://github.com/hqemoreira/morea) · **Live host (legacy name):** [litrixeu.vercel.app](https://litrixeu.vercel.app)  
**Not** a compliance service, legal advice, or commercial SaaS.

## Demo object

A dated, SHA-256-verified, exportable **Evidence Pack** (`MOREA-…` code) — educational / illustrative.

Flow: inventory → assess → literacy module (Mistral + fallback) → quiz (staff or partner/ops) → policy (optional) → pack export / verify.

## Posture

- SEO: `Allow: /` + `noindex` / `X-Robots-Tag`
- Portfolio-card discovery; GRYPS remains the hiring lead
- Optional demo login is experimental only — not a product account ladder

## Stack

- Plain HTML / JS on Vercel (no build step)
- Serverless functions · Mistral (`mistral-small-latest`)
- Optional Neon for demo register saves

## Docs

Project context for agents: [`CLAUDE.md`](./CLAUDE.md).

## License

Proprietary — see [`LICENSE`](./LICENSE). All rights reserved.
