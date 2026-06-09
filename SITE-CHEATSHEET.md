# Zarcone Photography — Site Cheat Sheet

A quick reference for every common content task. After any edit, deploy with the three commands at the bottom.

---

## Deploy (always the same three commands)

```bash
cd ~/Claude/Projects/ZP\ Web\ Redsign/zarcone-next
git add -A
git commit -m "describe what you changed"
git push
```
Vercel auto-deploys in ~2 minutes after push.

---

## Add a Photo to a Gallery (Sports / Portraits / Design)

**Drop the photo** into `~/Claude/Projects/ZP Web Redsign/zarcone-next/public/photos/`

**Then open the gallery file** and add a line to the `PHOTOS` array:

| Gallery | File |
|---------|------|
| Sports | `app/sports/page.jsx` |
| Portraits | `app/portraits/page.jsx` |
| Design | `app/design/page.jsx` |

**Format:**
```js
{ src: '/photos/your-filename.jpg', category: 'Wrestling', size: 'half' },
```
- `category` must match one of the filter buttons at the top of the file
- `size`: `'half'` (normal) or `'wide'` (spans full width)

**Sports categories:** Football, Wrestling, Lacrosse, Softball, Basketball, Gymnastics, Baseball, Soccer, Track, Other

**Portrait categories:** Individual, Family, Senior, Headshot

---

## Edit the Events Gallery Page

The Events gallery (`app/events/page.jsx`) uses **showcase cards** — not a photo grid. Each card has a title, description, category, and 1–2 photos.

**Card structure:**
```js
{
  category: 'Music',                      // which filter tab it appears under
  title: 'Your Event Title',
  desc: 'Short description paragraph.',
  images: ['/photos/photo.jpg'],          // one photo
  layout: 'single',
},
// — or with two photos —
{
  category: 'Prom',
  title: 'BRHS Prom 2026',
  desc: '...',
  images: ['/photos/left.jpg', '/photos/right.jpg'],
  layout: 'double',
  reverse: true,   // optional: flips image/text sides
},
```

**To change a photo:** find the card by title, update the path inside `images: []`

**To add a card:** copy a block, paste it in the array, fill in all fields

**To remove a card:** delete the entire `{ ... }` block

**To reorder:** move blocks up/down — top of array = appears first on page

**Available categories:** `Music`, `Prom`, `Celebration`, `Events`
(To add a new category, also add it to the `CATEGORIES` array at the top of the file)

---

## Remove a Photo from a Gallery

Open the gallery file (see table above), find the line with that filename, and delete it. Deploy.

---

## Change the Homepage Hero Rotation

Open `app/page.jsx`. Find `HERO_PHOTOS` near the top:

```js
const HERO_PHOTOS = [
  '/photos/i-s7zBdzk-hero.jpg',      // football
  '/photos/chloe-portrait-hero.jpg',  // portrait
  ...
];
```

- **Add a photo:** drop a 1920×1080 jpg in `/public/photos/` and add its path to the array
- **Remove a photo:** delete that line
- **Reorder:** move lines up or down — top of array = first slide

> Hero photos should be 1920×1080 (16:9). Ask Claude to crop and process any new ones.

---

## Change the Discipline Card Covers (Sports / Portraits / Events / Design)

Open `app/page.jsx`. Find the `DISCIPLINES` array. Each card has an `img` field:

```js
{ num: '01', slug: 'sports',    title: 'Sports',    img: '/photos/your-photo.jpg' },
{ num: '02', slug: 'portraits', title: 'Portraits', img: '/photos/your-photo.jpg' },
{ num: '03', slug: 'events',    title: 'Events',    img: '/photos/your-photo.jpg' },
{ num: '04', slug: 'design',    title: 'Design',    img: '/photos/your-photo.jpg' },
```

Change the `img` path to any photo in `/public/photos/`.

---

## Change the Selected Work Grid (Homepage)

Open `app/page.jsx`. Find `WORK_GRID`:

```js
const WORK_GRID = [
  { src: '/photos/photo1.jpg', tall: true },  // slot 1 — tall
  { src: '/photos/photo2.jpg' },               // slot 2
  { src: '/photos/photo3.jpg', tall: true },  // slot 3 — tall
  { src: '/photos/photo4.jpg' },               // slot 4
  { src: '/photos/photo5.jpg' },               // slot 5
];
```

Replace any `src` path. Slots 1 and 3 are taller — portrait-oriented photos work best there.

> Ask Claude to rebuild the visual picker tool anytime to browse and choose photos.

---

## Add or Edit an Upcoming Event

**One file controls everything** — the announcement bar AND the News page both pull from:

`lib/events.js`

```js
{
  title:       'Event Name',
  badge:       'Mini Sessions',        // small tag on the image
  date:        'July 3, 2026',
  location:    'Venue · City, NJ',
  description: 'Short paragraph...',
  image:       '/photos/filename.jpg',
  link:        'https://booking-url.com',
  linkLabel:   'Book Your Spot',
  status:      'upcoming',             // 'upcoming' or 'past'
},
```

- **Add event:** copy the block above, fill in details, add to the array
- **Move to past:** change `status: 'upcoming'` to `status: 'past'` — it disappears from the announcement bar and moves to Past Events on the News page
- **Remove:** delete the block entirely

---

## Add a "From the Studio" Charity Blurb

Open `app/news/page.jsx`. Find the `NOTES` array near the top:

```js
const NOTES = [
  {
    title: 'Event Name',
    date:  'March 2026',
    body:  'Short paragraph about what happened and why it mattered.',
  },
];
```

Add as many entries as you like. They appear as text cards below the events section.

---

## Add a Blog Post

1. Create a new `.md` file in `posts/` — e.g. `posts/my-new-post.md`
2. Start the file with this frontmatter:

```markdown
---
title: Your Post Title
date: 2026-06-10
excerpt: One sentence that shows under the post card.
category: Behind the Scenes
coverImage: /photos/your-cover-photo.jpg
---

Your post content goes here. Write in plain markdown.
```

3. Save and deploy. The post appears automatically on `/blog`.

> **Tip:** Use Format → Make Plain Text (⇧⌘T) in TextEdit before saving as `.md` to prevent macOS from adding `.txt`.

---

## Change the About Page Photos

Open `app/about/page.jsx`:

- **Hero photo** (approachable headshot): find `url('/photos/tz-headshot.jpg')` — replace filename
- **Pullquote break** (dramatic B&W): find `url('/photos/tom-portrait.jpg')` — replace filename
- **Contact section** (on a shoot): find `url('/photos/tz-shoot-portrait.jpg')` — replace filename

---

## Git Lock File Error

If you see `fatal: Unable to create ...HEAD.lock` run:

```bash
rm -f .git/HEAD.lock .git/index.lock
```

Then retry your git command.

---

## Common File Map

| What | File |
|------|------|
| Homepage | `app/page.jsx` |
| Sports gallery | `app/sports/page.jsx` |
| Portraits gallery | `app/portraits/page.jsx` |
| Events gallery | `app/events/page.jsx` |
| Design gallery | `app/design/page.jsx` |
| About page | `app/about/page.jsx` |
| News & events | `app/news/page.jsx` + `lib/events.js` |
| Blog index | `app/blog/page.jsx` |
| Blog posts | `posts/*.md` |
| Nav links | `components/Nav.jsx` |
| Announcement bar | `components/AnnouncementBar.jsx` |
| Global styles | `app/globals.css` |
| Photos folder | `public/photos/` |
