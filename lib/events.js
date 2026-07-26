// ─── ADD / EDIT EVENTS HERE ───────────────────────────────────────────────────
// `status` is computed automatically from `dateISO` below (see the bottom of
// this file) — do NOT set it by hand. An event shows as 'upcoming' through
// the end of its own day (local time) and flips to 'past' starting the next
// day, on every page load, with no manual edit and no scheduled task needed.
// This runs client-side (both consumers — AnnouncementBar and the News page
// — are 'use client'), so it's always evaluated against the visitor's real
// current date, never frozen at build/deploy time.
//
// dateISO: 'YYYY-MM-DD' — the actual calendar date the event happens/ends.
// date:    the human-readable string actually displayed on the page — keep
//          this in sync with dateISO, but it can say whatever reads best
//          ("Sat, July 25" etc.); only dateISO drives the upcoming/past math.
// team: 'football'   → also eligible for the football-only Upcoming bar shown
//                      on /brhs-panther-football (see components/AnnouncementBar.jsx).
//                      Omit for events that aren't tied to a specific team page.

const RAW_EVENTS = [
  {
    title:       'Stars, Stripes & Tails',
    badge:       'Mini Sessions',
    date:        'July 3, 2026',
    dateISO:     '2026-07-03',
    location:    "Barkley's Marketplace · Branchburg, NJ",
    description: "Celebrate the 4th with a mini portrait session for you and your pet. Partnering with Barkley's Marketplace for a fun, patriotic shoot — $24.99 per pet includes 3 digital images. Book in advance and receive $5 in Barkley's Bucks.",
    image:       '/photos/sst-ig-v2.jpg',
    link:        'https://bit.ly/4eiV0Su',
    linkLabel:   'Book Your Spot',
  },
  {
    title:       'Christmas in July',
    badge:       'Mini Sessions',
    date:        'July 25, 2026',
    dateISO:     '2026-07-24',
    location:    'Black Dog Books · Lafayette Township, NJ',
    description: "Black Dog Books and Zarcone Photography present Christmas in July — a fun, festive, fur-friendly mini session event! Saturday July 25, 11:00 AM – 4:00 PM. $15 in advance (includes one professionally edited digital photo) · $20 walk-ins as available. Advance registrants receive $10 in Black Dog Bucks. Proceeds support Black Dog Books and their mission to celebrate books and build community.",
    image:       '/photos/BDB_ZP-Christmas_In_July_Square-1.jpg',
    link:        'https://calendly.com/zarconephotography-info/stars-stripes-tails-mini-session-clone',
    linkLabel:   'Book Your Spot',
  },
  {
    title:       'BRHS Panther Football Media Day',
    badge:       'Official Media Partner',
    date:        'July 29, 2026',
    dateISO:     '2026-07-29',
    location:    'Bridgewater-Raritan High School · Bridgewater, NJ',
    description: "Zarcone Photography kicks off the 2026 season as the official media partner of BRHS Panther Football. Media Day brings full team and individual portraits, social media graphics, and recruiting content for every athlete — the start of a partnership that also covers every home game, Senior Night, and the postseason. All this coming off the program's first-ever NJSIAA sectional championship.",
    image:       '/photos/BRHS_Ad_v2.png',
    link:        '/brhs-panther-football',
    linkLabel:   'See the Partnership',
    team:        'football',
  },
  {
    title:       "Andi's Team 5K Walk & Run",
    badge:       'Charity Event',
    date:        'October 11, 2026',
    dateISO:     '2026-10-11',
    location:    'Duke Island Park · Bridgewater, NJ',
    description: "Proud sponsors and official photographers of Andi's Team Fourth Annual 5K Walk & Run, benefiting the A-T Children's Project. Andi is a seven-year-old Bridgewater girl living with ataxia-telangiectasia — a rare, terminal genetic disease. Join us for a 5K walk or run, kids fun run, food trucks, vendors, and more. All proceeds fund A-T research.",
    image:       '/photos/andis-5k-flyer-2026.jpg',
    link:        'https://atcp.org/andis-team-5k-register',
    linkLabel:   'Register Now',
  },
];
// ─────────────────────────────────────────────────────────────────────────────

// Date-only comparison (local midnight) so an event stays 'upcoming' through
// the end of its own calendar day, then flips to 'past' starting the next
// day — same cutoff Tom was applying by hand before.
function computeStatus(dateISO) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDay = new Date(`${dateISO}T00:00:00`);
  return eventDay >= today ? 'upcoming' : 'past';
}

export const EVENTS = RAW_EVENTS.map((e) => ({ ...e, status: computeStatus(e.dateISO) }));
