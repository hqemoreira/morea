# Litrix — Project Context for Claude Code

## What this is
EU AI Act Article 4 compliance and literacy platform for European SMEs. Solo-founder product by Henrique (Espoo, Finland), part of a five-product portfolio (Forge, GRYPS, Grantemia, Velu, Litrix) built under a zero-cost constraint through May 2027.

## Core thesis — do not lose this in future sessions
**The product is not the course. The product is the record.** Article 4 of the EU AI Act makes AI literacy mandatory for every company deploying AI in the EU. Article 4 is a Chapter I general provision under Article 113's phased rollout and has applied since **2 February 2025** (alongside the Article 5 prohibitions) — not August 2026, which is when the bulk of separate high-risk/Annex III obligations apply. This means the messaging angle is "you are already required to comply," not "prepare for an upcoming deadline." Companies don't want training — they need to *demonstrate* training. Every Litrix module ends in a dated, SHA-256-verified, exportable training register entry. That register is the retention hook and the reason a company pays annually instead of once.

## Repo / domain / infra
- GitHub: `ghostcat0to1/litrix`
- Domain: **litrix.eu** is the brand (EU regulation = Brussels credibility, not geographic). `litrix.fi` is registered separately at Domainhotelli purely as a cheap redirect for Finnish trust — never the primary domain.
- Hosting: Vercel, no build step, plain HTML/JS, one serverless function.
- AI inference: **Mistral API**, model `mistral-small-latest`, JSON mode, env var `MISTRAL_API_KEY`. (Originally scaffolded on Gemini, migrated to Mistral — if you see Gemini references anywhere, they're stale.)
- DNS/master domain for mail etc: henriquemoreira.eu via Cloudflare (shared pattern across all Henrique's products).

## Current MVP flow (built and working)
1. Landing page
2. 6-question intake (company size, sector, AI usage, role)
3. Deterministic Article 4 classification engine — client-side, instant, no API call (exposure "stamp" / dossier-style result card)
4. Personalized 10-minute literacy module — Mistral-generated, with a **built-in fallback curriculum** so the product never breaks even with zero API config or if rate-limited
5. 3-question comprehension quiz
6. Training register entry — SHA-256 verification code, printable, exportable as JSON

## Product ladder
Free assessment (lead magnet) → Individual €19/person → Company €99–299/month (annual, living register + policy pack) → consulting attach (elevated-exposure results route straight into Henrique's consulting pipeline as pre-qualified leads).

## Capacity / cost math (Mistral)
Each training ≈ 3,000 tokens (~€0.002 on paid rates). Free tier: ~2 req/min, effectively unlimited token headroom for early traction — good for dozens of trainings/day. On paid Scale tier: ~€1.60 per 1,000 modules against €19/seat — margin is a non-issue. Flip to Scale the moment there's one paying company.

## SEO / AIO / GEO / AEO / SXO — already implemented, don't rebuild
- SEO: keyword-led title, canonical to litrix.eu, meta description phrased as search intent, sitemap.xml, semantic HTML, sub-second load
- AEO: visible "Article 4, answered" FAQ section mirrored 1:1 in FAQPage JSON-LD
- GEO: `llms.txt` at root, `robots.txt` explicitly allowing GPTBot, ClaudeBot, PerplexityBot, Google-Extended; every claim on-page written as a citable declarative statement with dates/article numbers
- AIO: Organization + SoftwareApplication JSON-LD
- SXO: intent answered above the fold, one repeated CTA, keyboard focus states, reduced-motion support, mobile-first
- Known gap: GEO's "being referenced" half isn't code-solvable — needs LinkedIn/association mentions pairing "Litrix" with "Article 4 AI literacy" to actually happen.

## Design system
Deliberately **not** Forge Fire. IBM Plex font family, paper-and-ink regulatory dossier aesthetic — distinct brand identity from the rest of the portfolio.

## Next planned build (not yet started)
**Neon (Postgres) persistence + company workspace.** This is the unlock for Tier 2 (Company, €99–299/mo) being sellable at all — right now the register entry is exportable JSON with no server-side persistence or multi-seat workspace. Priorities for that session:
- Neon schema for company accounts, seats, and persisted register entries (EU Frankfurt region, matching the pattern already used on Iraun)
- Company workspace view (living register across employees)
- Auth layer still to decide — Litrix's data layer is Neon, not Supabase, so don't default to Supabase Auth without checking fit

## Working style reminders
- Henrique wants decisive recommendations and clean execution, not menus of options.
- Zero-cost constraint is real — don't introduce paid infra without flagging cost first.
- Don't rename Litrix, don't second-guess litrix.eu as the domain.
