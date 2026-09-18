# Litrix — Project Context for Claude Code

## What this is
Non-commercial learning demo for EU AI Act Article 4 literacy and training-register practice, for European SME contexts. Built by Henrique (Espoo, Finland) as part of the portfolio (Forge, GRYPS, Grantemia, Velu, Litrix, …). **Not a company SaaS product** — open via Portfolio card only.

## Public posture
- SEO: `Allow: /` + `noindex` / `X-Robots-Tag` (shelved pattern). Open via Portfolio card only. Active/indexed elsewhere: Portfolio + GRYPS only; Forge is private ops (noindex).
- Framing: shared **demo register** / demo-login — not company signup, pricing, or Offer schema.
- Privacy/Terms: plain non-commercial research-prototype notices.
- **GitHub front door:** public `README.md` (posture + stack + how to run); architecture stays in this file (`CLAUDE.md`). Proprietary `LICENSE` harmonized with sibling portfolio repos.

### Changelog — 2026-09
- **2026-09-18 (Forge s20):** CLAUDE.md synced with Forge journals — remain archive (noindex / Portfolio-card-only); architecture doc stays this file.
- Public README shipped as GitHub front door (posture + stack + how to run); architecture stays in this CLAUDE.md.
- Proprietary LICENSE harmonized across the portfolio (same wording family as sibling repos).
- Archive products (Velu, Grantemia, LYCAON, DisclAI, Litrix, Iraun): still Allow+/noindex; Portfolio card discovery only.
- Active/indexed: Portfolio + GRYPS only. Forge is private ops (noindex).
- Learning / research-demo archive framing unchanged.

## Core thesis — do not lose this in future sessions
**The demo object is the record.** Article 4 of the EU AI Act makes AI literacy mandatory for every company deploying AI in the EU. Article 4 is a Chapter I general provision under Article 113's phased rollout and has applied since **2 February 2025** (alongside the Article 5 prohibitions) — not August 2026, which is when the bulk of separate high-risk/Annex III obligations apply. Messaging for the demo: “you are already required to comply,” not “prepare for an upcoming deadline.” The learning hook is a dated, SHA-256-verified, exportable training register entry — educational, not a paid annual seat ladder on the public surface.

## Repo / domain / infra
- GitHub: `ghostcat0to1/litrix`
- Live demo host (only public URL): **https://litrixeu.vercel.app**. Do not invent a separate brand domain.
- Hosting: Vercel, no build step, plain HTML/JS, one serverless function.
- AI inference: **Mistral API**, model `mistral-small-latest`, JSON mode, env var `MISTRAL_API_KEY`. (Originally scaffolded on Gemini, migrated to Mistral — if you see Gemini references anywhere, they're stale.)
- DNS/master domain for mail etc: henriquemoreira.eu via Cloudflare (shared pattern across Henrique's products).

## Current MVP flow (built and working)
1. Landing page
2. 6-question intake (company size, sector, AI usage, role)
3. Deterministic Article 4 classification engine — client-side, instant, no API call (exposure "stamp" / dossier-style result card)
4. Personalized 10-minute literacy module — Mistral-generated, with a **built-in fallback curriculum** so the product never breaks even with zero API config or if rate-limited
5. 3-question comprehension quiz
6. Training register entry — SHA-256 verification code, printable, exportable as JSON

## Product ladder (historical — not live commerce)
Older notes described Individual / Company pricing. **Do not restore public pricing, Offer schema, or paid CTAs.** If a paid workspace is ever revisited, treat it as a new decision — current public surface is learning-demo only.

## Capacity / cost math (Mistral)
Each training ≈ 3,000 tokens on paid rates — negligible for demo traffic. Free tier headroom is enough for personal/portfolio use. Do not invent margin/ARR claims in public copy.

## SEO / AIO / GEO / AEO / SXO — shelved posture
- Public discovery is Portfolio-only. Keep `noindex`; do not rebuild an indexed growth SEO program for Litrix while it remains archive.
- On-page Article 4 FAQ / JSON-LD may remain for demo honesty — they are not a reason to re-open indexing.

## Design system
Deliberately **not** Forge Fire. IBM Plex font family, paper-and-ink regulatory dossier aesthetic — distinct brand identity from the rest of the portfolio.

## Optional later build (not committed)
**Neon (Postgres) persistence + company workspace** remains an optional unlock if Litrix ever leaves archive learning-demo mode. Priorities then:
- Neon schema for company accounts, seats, and persisted register entries (EU Frankfurt)
- Company workspace view (living register across employees)
- Auth layer still to decide — Litrix's data layer is Neon, not Supabase

## Working style reminders
- Henrique wants decisive recommendations and clean execution, not menus of options.
- Zero-cost constraint is real — don't introduce paid infra without flagging cost first.
- Don't rename Litrix. Only claim the live URL https://litrixeu.vercel.app — never invent a brand domain.
