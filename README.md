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
  pricing/                          — Pricing page (Portraits $250, Sports $550, Events $750, Design $75)
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
| Portraits | $250 |
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

## Pending / Known Issues

- **Domain** — point `zarconephotography.com` to Vercel: A record `76.76.21.21`, CNAME `cname.vercel-dns.com` (via GoDaddy)
- **Next.js upgrade** — on 14.2.3; known security advisories; upgrade to v15 when ready
- **Trust strip logos** — several logos have generic filenames and need proper alt text
- **Andi's Team cover** — swap for real event photos after Oct 11 2026
