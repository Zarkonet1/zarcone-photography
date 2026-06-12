# Zarcone Photography — Next.js 14

Live site: **zarconephotography.com** | Hosted on Vercel (auto-deploys on push to `main`)

---

## Local Development

```bash
cd ~/Claude/Projects/ZP\ Web\ Redsign/zarcone-next
npm run dev
# → http://localhost:3000
```

## Deploying

```bash
cd ~/Claude/Projects/ZP\ Web\ Redsign/zarcone-next
git add -A
git commit -m "your message"
git push
# Vercel picks it up automatically (~2 min)
```

If you get a lock error first run:
```bash
rm -f .git/HEAD.lock .git/index.lock
```

---

## Project Structure

```
app/
  page.jsx                          — Homepage (hero rotation, discipline cards, selected work)
  sports/                           — Sports gallery with subcategory filters
  portraits/                        — Portraits gallery
  events/                           — Events gallery
  design/                           — Design gallery
  about/                            — About + contact form
  blog/                             — Blog index + [slug] post pages
  news/                             — News & upcoming events
  pricing/                          — Pricing page (Portraits $350+, Sports $550, Events $750, Design $75)
  404/                              — Custom 404 page
  senior-portrait-photographer-nj/  — SEO landing page
  sports-photographer-nj/           — SEO landing page
  event-photographer-nj/            — SEO landing page
  api/contact/                      — Contact form API route (Formspree)

components/
  Nav.jsx           — Sticky nav with mobile hamburger
  Footer.jsx        — Two-column nav (Services + Navigation)
  PageHero.jsx      — Reusable inner-page hero (<img fetchpriority="high"> for LCP)
  Lightbox.jsx      — Full-screen image viewer

posts/
  *.md              — Blog posts (gray-matter frontmatter)

public/
  photos/           — All site images (compressed: max 2400px, quality 82)
  assets/           — Logo files
```

---

## Blog

Drop a `.md` file in `posts/` and push. Frontmatter fields:

```yaml
---
title: Post Title
date: 2026-06-10
excerpt: One-sentence summary shown on the index card.
category: Senior Portraits
coverImage: /photos/your-image.jpg
imagePosition: center 15%   # optional — controls hero crop position
---
```

**Published posts:**
- `welcome-to-the-blog.md` — Behind the Lens (June 2026) — `imagePosition: 20% center`
- `what-to-wear-senior-portrait-session.md` — What to Wear (June 2026)

---

## Pricing

Current rates (website + HoneyBook in sync as of June 2026):

| Service | Price |
|---|---|
| Portraits | $350+ |
| Sports / Game Day | $550 |
| Events – 1 Photographer | $750 |
| Events – 2 Photographers | $1,200 |
| Design | $75 |

Weddings: **not offered.**

To update pricing edit the `PACKAGES` array in `app/pricing/page.jsx`.

---

## SEO Landing Pages

Three keyword-targeted pages with Schema.org markup:
- `/senior-portrait-photographer-nj`
- `/sports-photographer-nj`
- `/event-photographer-nj`

Shared styles: `app/seo-page.module.css`

---

## Contact Form

Using Formspree (`https://formspree.io/forms/mlgklzvy`). No env vars needed — just push.

---

## HoneyBook Integration

- **Client portal:** `book.zarconephotography.com` (CNAME `book → ssl.honeybook.com`, live as of June 11, 2026)
- **Lead forms:** All 6 forms have Scheduler actions (Introductory Call, 30-min phone). See `business-process-audit.md` for full table.
- **HoneyBook PID:** `5f380abc6556542c7717ad80` (used in About page contact form embed)

---

## Pending / Known Issues

- **Next.js upgrade** — on 14.2.3; known security advisories; upgrade to v15 when ready
- **Trust strip logos** — several logos have generic filenames and need proper alt text
- **Andi's Team cover** — swap for real event photos after the event (Oct 11, 2026)
- **HoneyBook automation segmentation** — all 3 inquiry automations (Event, Portrait, Sports) fire for every lead form submission; segmenting by form type is a future improvement (low urgency)

---

## Recent Changes (June 2026)

- **About page copy** — rewrote Story section: West Point / Army service woven in, "storyteller" positioning through copy not labels. Key line: "Every one of those moments has a story. My job is to find it before it disappears."
- **Stats bar** — updated to: 30+ Years Experience · 5,000+ Athletes Photographed · 500+ Events Covered · NJ · NYC · PHL Service Area
- **Portrait pricing** — updated site from $250 to $350+ (matches HoneyBook)
- **Business process audit** — all 12 items resolved; platforms (Website, HoneyBook, Pic-Time) are fully aligned. See `business-process-audit.md`.
