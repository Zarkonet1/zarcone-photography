// Mahwah Thunderbirds Football gallery list — same shape as
// lib/footballGalleries.js (BRHS), deliberately empty.
//
// Zarcone Photography does not have a Mahwah photography library — no
// season partnership exists yet, so there is nothing real to link to here.
// This file exists so the Media/Gallery section of the Hub can demonstrate
// its ARCHITECTURE (weekly-gallery structure, "latest gallery" derivation,
// the same getLatestGallery() helper BRHS uses) without pretending any
// content exists. The Hub page renders an honest "no galleries yet" state
// when this array is empty — see app/mahwah-thunderbirds-football/page.jsx.
//
// To activate for real: once Zarcone Photography actually shoots for
// Mahwah (Media Day, a game, etc.), add entries here in the exact shape
// BRHS uses — { id, label, date, href, photoCount } — and reuse
// getLatestGallery from lib/footballGalleries.js (already a pure function,
// not BRHS-specific) exactly as this page already imports it. Nothing else
// needs to change.
export const MAHWAH_GALLERIES_2026 = [];
