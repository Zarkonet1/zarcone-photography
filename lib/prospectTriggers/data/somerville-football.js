// Prospect Trigger data — Somerville Pioneers Football.
//
// This file is the ONLY thing that should change to build this specific
// trigger. The presentation (components/ProspectTrigger) and the route
// (app/high_school/[school]/[sport]/page.jsx) are shared and should never
// contain a school name, stat, or color value — see
// lib/prospectTriggers/registry.js for how this file gets wired to a URL.
//
// Program-level facts only. No player names, jersey numbers, individual
// stats, roster data, or athlete photos anywhere in this file — see
// project memory / the feasibility addendum for why.

const somervilleFootball = {
  school: 'Somerville',
  sport: 'Football',
  mascot: 'Pioneers',

  // Verified via Wikipedia's infobox only (single source) — colors are a
  // low-stakes, static fact, not worth a second confirmation pass. No
  // school logo/crest artwork used anywhere — typography only.
  colors: {
    primary: '#E8590C',   // Pioneer orange
    secondary: '#0A0A0A', // near-black
  },

  wordmark: 'SOMERVILLE PIONEERS FOOTBALL',

  // The one non-fakeable fact — the entire personalization hook. Verified
  // via Yahoo Sports/NJ Advance Media (Dec. 10, 2024) and independently
  // corroborated as still-current head coach via MaxPreps' live staff page
  // and CJ Sports Radio's Dec. 21, 2022 appointment article. See
  // sourceNotes below for the full chain.
  headlineLines: [
    '12-1. NINTH SECTIONAL TITLE.',
    'THE WINNINGEST SEASON IN',
    'SOMERVILLE FOOTBALL HISTORY.',
  ],

  // The current-season anchor — the second fact. Independently confirmed by
  // PJR Sports Report's June 17, 2026 team preview AND MaxPreps' live 2026
  // schedule agreeing exactly on date/opponent/site. A same-day MaxPreps
  // listing for Aug. 18 vs. Wall Township was deliberately NOT used here —
  // single-sourced, unusual 10 AM start time, almost certainly a scrimmage;
  // omitted rather than researched further per the 45-60 min budget.
  seasonAnchor: '2026 season opens August 27 — home vs. South Plainfield.',

  // Tom's voice, not an agency's. Flattering framing, not a legal
  // disclaimer — but still unmissable, placed directly under the hero.
  disclosure:
    "I put together a quick idea for Somerville Football — not an official team page, just a glimpse of what dedicated season-long media coverage could look like for the Pioneers.",

  // The visual payoff. images[0] renders large/hero-style; the rest render
  // as smaller supporting proof. Chosen for visual impact (rim-lit leaping
  // catch, night-game atmosphere, dynamic wrestling throw) — not simply the
  // most convenient files. All real Zarcone Photography work for
  // Bridgewater-Raritan — never implied to be Somerville's own team.
  proof: {
    images: [
      {
        src: '/photos/i-HkmJPk8.jpg',
        alt: 'Bridgewater-Raritan Panther Football — Zarcone Photography',
      },
      {
        src: '/photos/i-s7zBdzk.jpg',
        alt: 'Bridgewater-Raritan Panther Football, Friday night — Zarcone Photography',
      },
      {
        src: '/photos/wrestling-throw-hero.jpg',
        alt: 'Bridgewater-Raritan Panther Wrestling — Zarcone Photography',
      },
    ],
    credibilityLine: 'Official Season Media Partner — Bridgewater-Raritan Panther Football & Wrestling',
    disclaimerNote: "Zarcone Photography's real work — not Somerville's team.",
  },

  // The possibility — the product being sold, framed for 2026 and beyond,
  // not the 2024 season used as the hook above. Two sentences, one tag
  // line. This is NOT a services grid — do not expand it into one.
  possibility: {
    lead: 'Somerville has already built the tradition.',
    body: "Our job would be to make sure the moments that define 2026 aren't just remembered — they're documented.",
    tags: ['Game-Day Coverage', 'Media Day', 'Senior Night', 'Season Media Hub'],
  },

  // One CTA. No form. The component builds the mailto: link from these
  // plain fields so this file never needs manual URL-encoding.
  cta: {
    primary: 'SHOW ME WHAT THIS COULD LOOK LIKE',
    email: 'tom@zarconephotography.com',
    subject: 'Somerville Football — tell me more',
    body:
      "Hi Tom,\n\nI saw the page you put together for Somerville Football — let's talk about what this could look like for our program this season.",
    tel: '9087770631',
    telDisplay: '(908) 777-0631',
  },

  meta: {
    title: 'Somerville Pioneers Football — A Concept From Zarcone Photography',
    description:
      'A concept prepared for Somerville Pioneers Football by Zarcone Photography — not an official team page.',
    // Reuses a real, existing site image so link-preview unfurling (iMessage/
    // email) has something to show — this is about link previews, not search
    // indexing, and is unrelated to the noindex/nofollow robots setting on
    // this whole route (see app/high_school/layout.jsx).
    ogImage: 'https://www.zarconephotography.com/photos/i-HkmJPk8.jpg',
  },

  // Internal only — never rendered. Kept here so the next person (or the
  // next session) can see the verification chain without re-researching it.
  sourceNotes: `
Researched 2026-08-14, ~10 targeted searches/fetches.
- 12-1 record, Liberty Silver Division title, 9th sectional championship,
  Matt Bloom named 2024 Big Central Conference Coach of the Year:
  Yahoo Sports / NJ Advance Media, published 2024-12-10.
  https://sports.yahoo.com/football-coach-somerville-matt-bloom-091025211.html
- Bloom confirmed as (still) head coach, appointed full-time 2022-12-21,
  prior OL coach since 2016: CJ Sports Radio, 2022-12-21.
  https://cjsportsradio.com/2022/12/21/somervilles-bloom-officially-appointed-full-time-football-coach/
  Cross-checked against MaxPreps' live staff listing (2026-08-14).
- 2026 opener Aug 27 home vs. South Plainfield: independently confirmed by
  PJR Sports Report's 2026 team preview (published 2026-06-17) AND
  MaxPreps' live 2026 schedule (checked 2026-08-14).
  https://www.pjrsportsreport.com/uncategorized/post-1692-team-preview-2026-somerville-pioneers/
  https://www.maxpreps.com/nj/somerville/somerville-pioneers/football/schedule/
- Colors (orange/black) and mascot (Pioneers): Wikipedia infobox only,
  single-sourced, not re-verified — low-stakes static fact.
  https://en.wikipedia.org/wiki/Somerville_High_School_(New_Jersey)
- Deliberately OMITTED: MaxPreps' Aug 18 "game" vs. Wall Township (10 AM
  start, not in PJR's preview, likely a scrimmage) — single-sourced and
  unconfirmed, left out rather than researched further.
- No roster, player names, individual stats, or athlete photos were
  searched for or used, per the program-level-only constraint.
`,
};

export default somervilleFootball;
