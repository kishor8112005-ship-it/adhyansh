# Adiyash Gym — Kandivali branch: rebuild concept

A single-branch, mobile-first rebuild of your site (`adiyashgym.in`) built around **one location instead of seven**. The reference site asks a visitor to pick a branch first; this one assumes the visitor is already in Kandivali East and answers everything about this room — the address, the 24×7 door, the ten facilities, the coaches, the plans, and a trial you can book in three taps.

---

## What's in this folder

| File | What it is |
| --- | --- |
| `index.html` | The whole page — one long-scroll landing page with 12 sections |
| `styles.css` | Design system (tokens, type, layout, states, responsive) |
| `main.js` | Header, drawer, reveals, counters, live IST clock, footfall chart, programme filter, gallery, FAQ, trial form → WhatsApp |
| `assets/img/` | 9 custom images generated for this concept |
| `assets/fonts/` | Self-hosted Anton, Manrope, JetBrains Mono (no Google Fonts call) |
| `assets/brand/favicon.svg` | Favicon built from the red diamond of your logo |
| `image-search/` | Reference photos of your real interiors, used to match the palette |

**Zero dependencies, zero build step.** Open `index.html`, or run `python3 -m http.server` in this folder. Fonts and images are local, so it works offline; the only third-party embeds are the Google Map and outbound links.

---

## Design direction

The current site is a clean light theme. This rebuild keeps the brand but gives it a spine:

- **Ember on iron.** Your actual brand orange (it's all over your reception walls) against a near-black base — the palette of a 24×7 gym at 11 PM, not a clinic.
- **Anton for headlines.** Tall, condensed, arena-poster type. Paired with **Manrope** for body and **JetBrains Mono** for labels, so data (ratings, hours, prices) reads like instrumentation.
- **Old-school with modern craft.** Film grain, thin grid lines, corner brackets on photos, a running ticker, a circular "Kandivali · EST 2020" stamp.
- **Deliberately local.** Copy names Road No. 1, Ashok Nagar, Thakur Village, the basement, dal-chawal. Generic gym-bro copy is what makes a local gym look like a chain.

Sections run in a rhythm: dark hero → light "The Room" → dark facilities → warm "Programmes" → dark membership → coaches → light timing/steps → dark stories → gallery → light reviews → dark FAQ → light visit → photo trial form.

---

## Creative inputs (the ideas worth stealing)

1. **"Kandivali doesn't stop. Neither do we."** — the 24×7 promise turned into a headline rather than a bullet point.
2. **Live "Open right now · 8:35 PM IST" card** on the hero, computed in the browser from Asia/Kolkata. The door being open at any hour becomes the proof.
3. **A footfall chart, not a timing table.** 24 bars modelled by hour, with quiet / busy / peak legend and a **Now** marker that moves with the clock. It answers "when will I get a rack?" visually. *(The values are illustrative — replace with real gate data if you have it.)*
4. **Goal matcher on programmes.** Tap *Fat loss / Muscle / Fitness / 1:1* and irrelevant cards dim, with a one-line recommendation underneath. Cheap to build, very effective.
5. **Pricing with honesty.** Four plans, indicative rates clearly footnoted, and a "Most picked" ribbon. Every pricing page needs a single recommendation.
6. **Real reviews, unedited**, credited by name from Google — including the 4.6★/105 review figure pulled from your listing.
7. **Trial form that doesn't need a backend.** It validates name + Indian mobile, then opens WhatsApp with everything pre-filled. Proof it worked: a "Nice — nearly there" confirmation telling the user to hit send.
8. **Facilities as a bento grid** with three photo tiles and a closing ember tile that says "Something specific in mind? Ask the desk."
9. **Sticky mobile action bar** — Call / WhatsApp / Book, thumb-friendly, plus a drawer menu for the full nav.
10. **Accessibility and performance as design** — skip link, focus-visible rings, `aria-expanded/pressed/live`, one-open-at-a-time accordion, full `prefers-reduced-motion` fallback, self-hosted fonts, and `loading="lazy"` below the fold.

---

## Things in the page you should confirm before publishing

| Item | Currently | Why it needs you |
| --- | --- | --- |
| Prices | ₹199 day / ₹1,499 month / ₹3,999 quarter / ₹11,999 year · PT from ₹4,000/month | **Indicative placeholders.** Replace with live rates. |
| Phone | +91 93243 37728 | From your contact page. A Google listing also shows +91 88798 39335 — pick the one that rings at the desk. |
| Facilities | **10 tiles** — *All-branch access* removed | Resolved: your site notes all-branch access is only when joining from Kurla, so the tile and its mentions in the Annual plan and FAQ were removed. **Branch transfer** is kept — it's listed for Kandivali on your own facilities page. |
| Reviews | 4 quotes credited to Google reviewers | Verify each quote is accurate and publicly visible; remove any you can't source. |
| Coaches section | "16+ certified coaches" + roles | No individual names/photos invented — add real ones if you want a team grid. |
| Footfall chart | Modelled curve | Replace `TRAFFIC` in `main.js` with real hourly counts if available. |
| Images | 9 AI-generated photos | Swap in your real branch photography — the layouts are already sized for 4:5 and 16:9. |
| Trial form | WhatsApp handoff | Works with no backend. If you later want leads in a sheet, point it at a form endpoint instead. |
| Map | Google Maps iframe | Confirm the embed terms you're comfortable with; the "Get directions" link uses your existing Maps short URL. |

---

## Where the current site is stronger — deliberately kept

- The **Before & After Stories** and Instagram reels section are your best conversion content; this rebuild keeps a three-card video row with play affordances and links to YouTube + `@adiyashgymkandivali`.
- Your **FAQ set** is preserved word-for-word in intent and expanded with a beginner question.
- **Branch transfer**, **steam & shower**, **lockers** and **nutrition counselling** are all still on the page — they're real differentiators. (All-branch access is intentionally absent: it's a Kurla-joining perk, not a Kandivali one.)
- The footer still lists **all seven branches**, so this page can become the template for a per-branch site.

---

## If you want to take this further

1. **Per-branch pages from one template** — swap the address, phone, Instagram handle and gallery, keep the design. Seven pages, one codebase.
2. **Real class timetable** for spinning, rendered with the same bar-chart language as the footfall chart.
3. **Transformation slider** — a before/after drag handle on one hero pair is a stronger first-screen story than a video grid.
4. **Membership enquiry routing** — split WhatsApp messages by plan so the desk knows what each lead wants.
5. **A tiny admin note** — your current site has an `/admin` route; this concept intentionally leaves that out of the marketing page.
