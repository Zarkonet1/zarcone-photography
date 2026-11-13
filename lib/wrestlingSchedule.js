// Shared BRHS Panther Wrestling dual-meet schedule data — mirrors
// lib/footballSchedule.js. Single source of truth for both the wrestling
// page's Record/Next Match tracker and the wrestling-only Upcoming bar
// (components/AnnouncementBar.jsx) — don't hand-edit a second copy anywhere.
//
// TIER 1 REFACTOR (2026-07-10): dual-meet schedule for 2026-27. MaxPreps has
// not published one yet (confirmed empty as of this writing), so this starts
// empty and Record/Next Match fall back to the honest "preseason" text — and
// the wrestling Upcoming bar simply won't show a Next Match item until this
// fills in (it'll show only whatever wrestling-tagged events exist in
// lib/events.js, or disappear entirely on the wrestling page if there are
// none — it never falls back to football or sitewide content). Once dates
// are released, add entries here the same way as football's SCHEDULE_2026 —
// { date, opponent, home, result: null } — and Record / Next Match
// everywhere start deriving automatically. Tournament placements
// (Districts/Regions/States) still go in RESULTS_2025_26 on the wrestling
// page as hand-written result strings — those aren't simple win/loss and
// shouldn't be forced into this array. See lib/teamSchedule.js for why.
//
// UPDATE 2026-11-13 (per Tom): 2026-27 schedule loaded from the preliminary
// schedule Coach Murphy gave Tom (screenshot, received 2026-11-13). EVERY ROW
// IS TENTATIVE (tentative: true) until MaxPreps / BRRSD / Trackwrestling or
// another independent source confirms it — the daily sweep should flip
// `tentative` to false and update `source` row by row as it confirms them.
// Times intentionally omitted per Tom ('TBA', or the sheet's own 'All Day' /
// 'All Afternoon' wording). Home/away and B/G come straight from the sheet;
// rows with no B/G marking carry squad: null rather than a guess.
// Locations Tom supplied: Boys Districts at BRHS; Girls Districts TBD;
// Regions (B & G) at Union High School; States at Boardwalk Hall.
// Interpretations to confirm (flagged to Tom 2026-11-13):
//  - 'Emerson Park/Ridge (Host)' read as the Emerson/Park Ridge co-op team.
//  - 'North Highlands' read as Northern Highlands Regional.
//  - 'Counties Boys' read as the Somerset County Tournament.
//  - 'Bound Brook Rec. Night' kept verbatim (not assumed to be a dual).
//  - Sam Cali / Skyland / team-sectional hosts left TBD (sheet gives no site).
//
// FULL_SCHEDULE_2026_27 = everything (duals, tri/quads, tournaments, events,
// postseason) — drives the schedule table, Next Match hero and the Upcoming
// bar. DUAL_SCHEDULE_2026_27 = duals only — drives the W-L record, so
// tournaments/quads never get forced into a single win/loss.
export const FULL_SCHEDULE_2026_27 = [
  { date: "Fri, Dec 11", opponent: "at Delaware Valley · JV Jamboree", home: false, siteLabel: "Away", type: "Varsity Girls / JV Jamboree", dual: false, squad: "Girls (V) · JV", time: "All Afternoon", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sat, Dec 12", opponent: "Dessino Invitational", home: false, siteLabel: "Away", type: "Tournament", dual: false, squad: "Boys", time: "All Day", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sun, Dec 13", opponent: "Dessino Invitational", home: false, siteLabel: "Away", type: "Tournament", dual: false, squad: "Girls", time: "All Day", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Wed, Dec 16", opponent: "at Immaculata", home: false, siteLabel: "Away", type: "Dual", dual: true, squad: null, time: "TBA", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Fri, Dec 18", opponent: "vs Bernards", home: true, siteLabel: "Home", type: "Dual", dual: true, squad: null, time: "TBA", location: "Bridgewater-Raritan High School", note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sat, Dec 19", opponent: "at Moorestown · with Pinelands Regional", home: false, siteLabel: "Away", type: "Tri Meet", dual: false, squad: null, time: "TBA", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sun, Dec 20", opponent: "Somerville Jamboree (Girls) · at Ridge (JV Boys)", home: false, siteLabel: "Away", type: "Jamboree", dual: false, squad: "Girls · JV Boys", time: "All Day", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Wed, Dec 23", opponent: "vs Ridge", home: true, siteLabel: "Home", type: "Dual", dual: true, squad: null, time: "TBA", location: "Bridgewater-Raritan High School", note: "Alumni Night", tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sun, Dec 27", opponent: "Sam Cali Tournament", home: false, siteLabel: "TBD", type: "Tournament", dual: false, squad: "Boys", time: "All Day", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Mon, Dec 28", opponent: "Sam Cali Tournament", home: false, siteLabel: "TBD", type: "Tournament", dual: false, squad: "Boys & Girls", time: "All Day", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Wed, Dec 30", opponent: "vs Hackettstown, Vernon, Pennsville", home: true, siteLabel: "Home", type: "Quad", dual: false, squad: null, time: "TBA", location: "Bridgewater-Raritan High School", note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sat, Jan 2", opponent: "at Montgomery", home: false, siteLabel: "Away", type: "Dual", dual: true, squad: null, time: "TBA", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Wed, Jan 6", opponent: "vs North Hunterdon", home: true, siteLabel: "Home", type: "Dual", dual: true, squad: null, time: "TBA", location: "Bridgewater-Raritan High School", note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Fri, Jan 8", opponent: "Bound Brook Rec Night", home: true, siteLabel: "Home", type: "Event", dual: false, squad: null, time: "TBA", location: "Bridgewater-Raritan High School", note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sat, Jan 9", opponent: "Quad vs Clearview, Middletown South, Point Pleasant Boro", home: false, siteLabel: "Away", type: "Quad", dual: false, squad: null, time: "TBA", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sun, Jan 10", opponent: "Bound Brook Tournament", home: false, siteLabel: "Away", type: "Tournament", dual: false, squad: "Girls", time: "All Day", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Wed, Jan 13", opponent: "at Phillipsburg", home: false, siteLabel: "Away", type: "Dual", dual: true, squad: null, time: "TBA", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sat, Jan 16", opponent: "Somerset County Tournament", home: false, siteLabel: "Away", type: "Tournament", dual: false, squad: "Boys", time: "All Day", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Wed, Jan 20", opponent: "at Manville", home: false, siteLabel: "Away", type: "Dual", dual: true, squad: null, time: "TBA", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Fri, Jan 22", opponent: "vs Voorhees", home: true, siteLabel: "Home", type: "Dual", dual: true, squad: null, time: "TBA", location: "Bridgewater-Raritan High School", note: "Senior Night", tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sat, Jan 23", opponent: "at Emerson/Park Ridge · with Hunterdon Central, Northern Valley", home: false, siteLabel: "Away", type: "Quad", dual: false, squad: null, time: "TBA", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Mon, Jan 25", opponent: "at Somerville", home: false, siteLabel: "Away", type: "Dual", dual: true, squad: null, time: "TBA", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Thu, Jan 28", opponent: "at Newton", home: false, siteLabel: "Away", type: "Dual", dual: true, squad: null, time: "TBA", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sat, Jan 30", opponent: "Skyland Conference Tournament", home: false, siteLabel: "TBD", type: "Tournament", dual: false, squad: "Girls", time: "All Day", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Mon, Feb 1", opponent: "NJSIAA Team Sectional Quarterfinals / Semifinals", home: false, siteLabel: "TBD", type: "Postseason", dual: false, squad: "Boys", time: "TBA", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Wed, Feb 3", opponent: "NJSIAA Team Sectional Finals", home: false, siteLabel: "TBD", type: "Postseason", dual: false, squad: "Boys", time: "TBA", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Fri, Feb 5", opponent: "NJSIAA Team State Semifinals", home: false, siteLabel: "TBD", type: "Postseason", dual: false, squad: "Boys", time: "TBA", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sat, Feb 6", opponent: "Quad vs Kinnelon, Wayne Hills, Northern Highlands", home: false, siteLabel: "Away", type: "Quad", dual: false, squad: null, time: "TBA", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sun, Feb 7", opponent: "NJSIAA Team Group Finals", home: false, siteLabel: "TBD", type: "Postseason", dual: false, squad: "Boys", time: "TBA", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sat, Feb 13", opponent: "NJSIAA District Tournament", home: true, siteLabel: "Home", type: "Postseason", dual: false, squad: "Boys", time: "TBA", location: "Bridgewater-Raritan High School", note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sun, Feb 14", opponent: "NJSIAA District Tournament", home: false, siteLabel: "TBD", type: "Postseason", dual: false, squad: "Girls", time: "TBA", location: null, note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Fri, Feb 19", opponent: "NJSIAA Region Tournament", home: false, siteLabel: "Away", type: "Postseason", dual: false, squad: "Boys", time: "TBA", location: "Union High School, Union, NJ", note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sat, Feb 20", opponent: "NJSIAA Region Tournament", home: false, siteLabel: "Away", type: "Postseason", dual: false, squad: "Boys", time: "TBA", location: "Union High School, Union, NJ", note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sun, Feb 21", opponent: "NJSIAA Region Tournament", home: false, siteLabel: "Away", type: "Postseason", dual: false, squad: "Girls", time: "TBA", location: "Union High School, Union, NJ", note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Thu, Feb 25", opponent: "NJSIAA State Championships", home: false, siteLabel: "Away", type: "Postseason", dual: false, squad: "Boys & Girls", time: "TBA", location: "Boardwalk Hall, Atlantic City, NJ", note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Fri, Feb 26", opponent: "NJSIAA State Championships", home: false, siteLabel: "Away", type: "Postseason", dual: false, squad: "Boys & Girls", time: "TBA", location: "Boardwalk Hall, Atlantic City, NJ", note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
  { date: "Sat, Feb 27", opponent: "NJSIAA State Championships", home: false, siteLabel: "Away", type: "Postseason", dual: false, squad: "Boys & Girls", time: "TBA", location: "Boardwalk Hall, Atlantic City, NJ", note: null, tentative: true, result: null, source: "Coaching staff preliminary schedule, received 2026-11-13 — unverified" },
];

export const DUAL_SCHEDULE_2026_27 = FULL_SCHEDULE_2026_27.filter((g) => g.dual);
