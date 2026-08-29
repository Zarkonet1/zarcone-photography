// Shared player-identity helpers — single source of truth for turning a
// player's name into the same slug/anchor already used by the Roster
// section (id={`roster-${p.slug}`} in app/brhs-panther-football/page.jsx),
// so any component that wants to link to a specific player (Stats leader
// cards today; game recaps, spotlights, or photo galleries later) resolves
// the exact same anchor instead of re-implementing slugify logic or
// inventing a second player-identity system.
//
// This deliberately does NOT own roster data itself — each team page still
// owns its own ROSTER_2026 array (name, number, position, etc.). These
// helpers just standardize (a) how a slug is derived from a name, (b) how
// to check whether a given name actually has a roster entry so linking
// code can fail safe instead of producing a broken anchor, and (c) the
// actual smooth-scroll-and-highlight interaction once a target anchor id
// is known.

// Same slug shape ROSTER_2026/MANAGERS_2026 already compute inline
// (`${p.first}-${p.last}`.toLowerCase()...) — centralized here so it's
// defined once, not duplicated in every array that needs a slug.
export function slugifyPlayerName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Finds a roster entry by full name (case-insensitive), matching on the
// "First Last" shape every ROSTER_2026-style array already produces from
// its own `first`/`last` fields. Returns the matching entry (which already
// carries a `.slug`) or null if the name isn't on this roster — callers
// should treat null as "don't render a link," not "guess an anchor."
export function findRosterEntryByName(roster, name) {
  if (!name || !Array.isArray(roster)) return null;
  const target = name.trim().toLowerCase();
  return roster.find((p) => `${p.first} ${p.last}`.trim().toLowerCase() === target) || null;
}

// The anchor id the Roster section renders for a given slug — kept in one
// place so it's never hand-typed differently by two different components.
export function rosterAnchorId(slug) {
  return `roster-${slug}`;
}

// Generic smooth-scroll-and-highlight for any anchored element, not just
// Roster rows — a game recap, a spotlight card, or a gallery caption could
// call this with its own anchor id later. Adds a plain (non-CSS-Module)
// global class, `.player-anchor-highlight` (defined in app/globals.css),
// so the caller never needs access to another component's scoped
// CSS-Module class names to trigger the effect on that component's markup.
export function jumpToPlayerAnchor(anchorId) {
  if (typeof document === 'undefined' || !anchorId) return;
  const el = document.getElementById(anchorId);
  if (!el) return; // fail safe — nothing to scroll to, do nothing

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });

  el.classList.add('player-anchor-highlight');
  window.setTimeout(() => el.classList.remove('player-anchor-highlight'), 1800);

  if (window.history && window.history.pushState) {
    window.history.pushState(null, '', `#${anchorId}`);
  }
}
