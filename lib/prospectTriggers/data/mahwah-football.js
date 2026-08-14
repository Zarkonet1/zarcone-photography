// Prospect Trigger data — Mahwah Thunderbirds Football.
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

const mahwahFootball = {
  school: 'Mahwah',
  sport: 'Football',
  mascot: 'Thunderbirds',

  // Confirmed by Tom directly (Mahwah alum) after web research alone
  // couldn't pin this down: Columbia Blue & Black, per the NJSIAA/MetLife
  // championship program's own "Team Colors" listing. White noted as a
  // neutral/accent but not needed as a third slot — the shared page chrome
  // (near-black background, off-white body text) already covers that role.
  colors: {
    primary: '#B9D9EB',   // Columbia Blue
    secondary: '#0A0A0A', // Black
  },

  wordmark: 'MAHWAH THUNDERBIRDS FOOTBALL',

  // The hook — deliberately NOT modeled on Somerville's current-season-
  // record framing (recent Mahwah seasons don't support that: 4-5 in 2025,
  // 1-7 in 2021, per MaxPreps history). Instead, program pedigree: five
  // sectional titles in school history, the last two back-to-back. Verified
  // via Wikipedia (full title-year list: 1978, 1979, 1981, 2015, 2016) AND
  // independently via a Dec. 2016 Patch.com game recap that explicitly
  // states the 2016 win was the program's "second consecutive" title and
  // its "fifth state championship in its history" — the count and the
  // back-to-back framing are corroborated by two independent sources. See
  // sourceNotes below for the full chain.
  headlineLines: [
    'FIVE SECTIONAL TITLES.',
    'THE LAST TWO CAME BACK-TO-BACK —',
    'AT METLIFE STADIUM.',
  ],

  // The current-season anchor. Independently confirmed on both teams' own
  // MaxPreps schedule pages (Mahwah's and Morristown-Beard's), agreeing
  // exactly on date, time, and that Mahwah is the away team. A conflicting
  // single-sourced On3 listing (different time, different home/away) was
  // deliberately NOT used — outlier, omitted rather than researched
  // further, same as Somerville's excluded scrimmage listing.
  seasonAnchor: '2026 season opens August 28 — at Morristown-Beard.',

  // Tom's voice. Acknowledges the real, personal reason this exists —
  // alma mater, prior outreach — in one breath, then hands off to the
  // program and the proof. Not sentimental; Mahwah Football stays the
  // subject.
  disclosure:
    "I put together this for Mahwah Football — not an official team page. Mahwah's my alma mater, and Zarcone Photography reached out to the program a while back about season coverage. Since then we've built exactly what we were describing — for Bridgewater-Raritan. Here's what it could look like for the Thunderbirds.",

  // Flagship proof — identical structure and copy to the canonical v1.0
  // Somerville build. Same two BRHS images, same credibility framing, same
  // hub link. Only the disclaimer note's school name changes.
  proof: {
    heading: 'SEE WHAT A FULL MEDIA PARTNERSHIP LOOKS LIKE',
    images: [
      {
        src: '/photos/i-HkmJPk8.jpg',
        alt: 'Bridgewater-Raritan Panther Football — Zarcone Photography',
      },
      {
        src: '/photos/i-s7zBdzk.jpg',
        alt: 'Bridgewater-Raritan Panther Football, Friday night — Zarcone Photography',
      },
    ],
    identityLine: 'BRIDGEWATER-RARITAN PANTHER FOOTBALL',
    credibilityLine: 'Official Season Media Partner — Zarcone Photography',
    disclaimerNote: "Zarcone Photography's real work — not Mahwah's team.",
    hub: {
      href: '/brhs-panther-football',
      label: 'VIEW THE LIVE BRHS FOOTBALL MEDIA HUB →',
    },
  },

  // The possibility — reused verbatim from the canonical v1.0 copy. This
  // text was already program-agnostic (never named Somerville), so
  // "adapting it to Mahwah" means keeping it exactly as approved. Tags
  // unchanged per the frozen framework.
  possibility: {
    lead: 'A PROGRAM LIKE THIS DESERVES MORE THAN GAME-DAY PHOTOS.',
    body: "Our job would be to make sure the moments that define 2026 aren't just remembered — they're documented.",
    tags: ['Game-Day Coverage', 'Media Day', 'Senior Night', 'Season Media Hub'],
  },

  // One CTA. No form.
  cta: {
    primary: "LET'S TALK ABOUT MAHWAH FOOTBALL",
    email: 'tom@zarconephotography.com',
    subject: 'Mahwah Football — tell me more',
    body:
      "Hi Tom,\n\nI saw the page you put together for Mahwah Football — let's talk about what this could look like for our program this season.",
    tel: '9087770631',
    telDisplay: '(908) 777-0631',
  },

  meta: {
    title: 'Mahwah Thunderbirds Football — A Concept From Zarcone Photography',
    description:
      'A concept prepared for Mahwah Thunderbirds Football by Zarcone Photography — not an official team page.',
    ogImage: 'https://www.zarconephotography.com/photos/i-HkmJPk8.jpg',
  },

  // Internal only — never rendered.
  sourceNotes: `
Researched 2026-08-14, ~20 targeted searches/fetches (colors proved
unusually hard to pin down — see below).
- Five sectional titles in program history (1978, 1979, 1981, 2015, 2016):
  Wikipedia, Mahwah High School.
  https://en.wikipedia.org/wiki/Mahwah_High_School
- 2016 title (35-28 over Westwood) explicitly stated as the program's
  "second consecutive" championship and "fifth state championship in its
  history"; played at MetLife Stadium (NJSIAA North 1 Group 2 final):
  Patch.com, published 2016-12-04.
  https://patch.com/new-jersey/mahwah/mahwah-beats-westwood-win-its-second-consecutive-north-1-group-2-football
- 2015 (11-1, program-record win total) and 2016 (11-1) seasons corroborated
  independently: MaxPreps football history page.
  https://www.maxpreps.com/nj/mahwah/mahwah-thunderbirds/football/history/
- 2026 opener (Aug 28, away at Morristown-Beard, 4:00 PM): confirmed on
  BOTH teams' own MaxPreps schedule pages, agreeing exactly.
  https://www.maxpreps.com/nj/mahwah/mahwah-thunderbirds/football/schedule/
  https://www.maxpreps.com/nj/morristown/morristown-beard-crimson/football/schedule/
- Deliberately OMITTED: On3.com's listing for the same game (8:00 PM, home
  for Mahwah) — conflicts with the two-source MaxPreps consensus on both
  time and location; treated as the uncorroborated outlier and excluded.
  https://www.on3.com/high-school/mahwah-mahwah-nj-6286/football/schedule/
- Deliberately OMITTED: current head coach. Jeff Remo has held the job most
  years since 2004 (MaxPreps), but MaxPreps lists no head coach for the
  2026-27 season — current status unverifiable, and not essential to the
  hook, so left out entirely.
- Deliberately OMITTED: recent record (4-5 in 2025, 1-7 in 2021, per
  MaxPreps) — accurate, but works against the page's purpose. The verified
  five-title pedigree is a stronger, fully-supportable hook and doesn't
  require downplaying anything to use.
- Deliberately OMITTED: NJ ranking number (161st) — irrelevant noise, not
  used.
- Colors: NOT verifiable via web search alone (checked Wikipedia infobox
  [blank], MaxPreps team page, prepsportswear.com, spiritshop.com,
  1stplacespiritwear.com, BSN Sports Mahwah team store, Big North
  Conference site — none confirmed a palette). Flagged to Tom directly
  rather than guessed; he confirmed same-day: Columbia Blue & Black, per
  the NJSIAA/MetLife championship program's own "Team Colors" listing —
  a more authoritative source than anything surfaced by search.
- No roster, player names, individual stats, or athlete photos were
  searched for or used, per the program-level-only constraint.
`,
};

export default mahwahFootball;
