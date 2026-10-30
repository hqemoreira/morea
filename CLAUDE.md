# Morea Evidence Pack — Project Context for Claude Code

## What this is
Non-commercial learning demo (**Morea Evidence Pack**) for EU AI Act Article 4 literacy + exportable evidence practice, for European SME / small professional-firm contexts. Built by Henrique (Espoo, Finland). **Not a company SaaS product** — open via the Portfolio card; GRYPS remains the hiring lead.

**Local folder / GitHub repo:** `morea` (`hqemoreira/morea`). Vercel project may still be named `litrix` until reconnected. Public UI brand is **Morea**.

## Public posture
- Required line: Personal reskilling project · Non-commercial · Not a product for sale · No accounts / no billing
- SEO: `Allow: /` + `noindex` / `X-Robots-Tag`
- Framing: illustrative Evidence Pack — not company signup, pricing, or Offer schema
- Privacy/Terms: plain non-commercial research-prototype notices

## Core thesis — do not lose this
**The demo object is the Evidence Pack.** Inventory + literacy measures + quiz + optional policy + SHA-256 `MOREA-…` verification code. Educational, not a paid seat ladder. Messaging: practice documenting measures; never “get compliant.”

Article 4 has applied since **2 February 2025**. Softened best-efforts language may exist in later amendments — still never sell compliance guarantees.

## Live URL
- **https://litrixeu.vercel.app** (legacy host name until a Morea domain is chosen)
- GitHub: `hqemoreira/morea` (formerly `litrix`)

## Current flow (v0.2)
1. Landing (Morea)
2. AI-use inventory (`inventory.html`)
3. 6-question exposure intake (`assess.html`) — client-side classification
4. Role-aware literacy module — tracks: `staff` | `partner_ops` (Mistral + fallback)
5. Track-matched 3-question quiz
6. Optional illustrative AI-use policy (`policy.html`)
7. Evidence Pack export (`register.html`) — JSON + print
8. Verify — local JSON hash check + optional demo code API

Session keys: `morea_*` (fallback read of legacy `litrix_*`).

## Stack
- Plain HTML/JS, Vercel, Mistral `mistral-small-latest`, env `MISTRAL_API_KEY`
- Optional Neon for demo register persistence

## Design
IBM Plex; paper-and-ink dossier aesthetic. Wordmark subtitle: **Evidence Pack**.

## Do not
- Restore public pricing / Buy / subscribe / waitlist
- Claim compliance, conformity assessment, or legal advice
- Compete as LLM-internals course (that is Anomalyda’s job)
- Rename away from Morea in public copy without owner decision

## Optional later
- Neon company workspace (still non-commercial unless status changes)
- Prompt sovereignty trail module
- Custom domain for Morea; reconnect Vercel if project still named `litrix`
