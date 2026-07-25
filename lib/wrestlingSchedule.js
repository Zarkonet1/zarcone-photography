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
export const DUAL_SCHEDULE_2026_27 = [];
