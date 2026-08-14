// Prospect Trigger registry — single lookup table from a URL's [school]/
// [sport] params to that prospect's data module.
//
// To add a new Prospect Trigger: create lib/prospectTriggers/data/<slug>.js
// (copy somerville-football.js as a starting shape) and add one import + one
// line below. Nothing else changes — app/high_school/[school]/[sport]/
// page.jsx and components/ProspectTrigger are shared and stay untouched.

import somervilleFootball from './data/somerville-football';

const REGISTRY = {
  'somerville/football': somervilleFootball,
};

// URL segments arrive in whatever case/spacing a human typed into a link —
// /Somerville/Football, /somerville/football, and (for multi-word schools)
// /Watchung-Hills/Basketball should all resolve the same entry. Normalize
// before lookup rather than requiring exact-case keys above. In practice
// middleware.js already lowercases the whole path before this ever runs
// (see its header comment), so this is defense-in-depth, not the only
// thing standing between a mixed-case link and a 404.
function normalize(segment = '') {
  return decodeURIComponent(String(segment)).trim().toLowerCase().replace(/[\s_]+/g, '-');
}

export function getProspectTrigger(schoolParam, sportParam) {
  const key = `${normalize(schoolParam)}/${normalize(sportParam)}`;
  return REGISTRY[key] || null;
}

export function getAllProspectTriggerParams() {
  return Object.keys(REGISTRY).map((key) => {
    const [school, sport] = key.split('/');
    return { school, sport };
  });
}
