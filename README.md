# Zarcone Photography — Next.js

## Getting started on Replit

1. Create a new Replit → choose **Next.js** template
2. Delete the default files and upload everything from this folder
3. Copy your logo files into `public/assets/`
4. Click **Run** — Replit will install packages and start the dev server

## To connect the contact form

Open `app/api/contact/route.js` — two options are documented there:

- **Resend** (recommended): free, easy, no spam filters. Get an API key at resend.com, add it to Replit Secrets as `RESEND_API_KEY`
- **Nodemailer/Gmail**: use an app password, add to Replit Secrets as `SMTP_USER` and `SMTP_PASS`

## Replacing placeholder photos

Every `background-image` URL and `<img src>` pointing to `images.unsplash.com` is a placeholder. To use your own photos:

1. Upload images to `public/photos/`
2. Replace the URLs — e.g. `url('/photos/portrait-01.jpg')`

## Structure

```
app/
  page.jsx          — Homepage
  portraits/        — Portraits gallery with filter + lightbox
  sports/           — Sports editorial grid
  events/           — Events row layout
  about/            — About + contact form
  api/contact/      — Form submission API route
components/
  Nav.jsx           — Sticky nav with mobile hamburger
  Footer.jsx
  PageHero.jsx      — Reusable inner-page hero
  Lightbox.jsx      — Full-screen image viewer
public/
  assets/           — Put logo-white.png and logo-dark.png here
```
