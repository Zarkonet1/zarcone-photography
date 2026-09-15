'use client';

// Reusable Stats section — team-leader cards + per-game box scores.
// Fully data-driven: this one component serves any team/sport page. It
// makes no assumptions about which stat categories exist (Passing/Rushing
// for football, Wins/Pins for wrestling, Kills/Digs for volleyball, etc.)
// — a `boxScores` week just supplies its own `categories` array of
// { label, columns, rows }, and this component renders whatever it's
// given. Built for BRHS football first (2026-08-29), but nothing here is
// football- or BRHS-specific; other team pages can pass their own
// lib/*Stats.js data through the same props.
//
// `leaders` entries: { category, name, number, value, detail, photo }.
// `photo` is an explicit path (or omitted) — this component doesn't derive
// a jersey-number-to-photo path itself, since not every sport/team has a
// portraits-by-number convention; pass whatever path the page already uses.
//
// Player linking (added 2026-08-29): pass `roster` (the page's own
// ROSTER_2026-shaped array — anything with `.first`/`.last`/`.slug`) and a
// leader card whose `name` matches a roster entry becomes a real link to
// that player's existing Roster-section anchor (id={`roster-${slug}`}) via
// lib/players.js's shared helpers — no second player-identity system, no
// hardcoded per-leader hrefs. A leader with no matching roster entry stays
// a plain, non-interactive card rather than linking to nothing. The
// scroll-and-highlight behavior itself is generic (see jumpToPlayerAnchor)
// and reusable by any future component, not just this one. Pass
// `onPlayerLinkClick(rosterEntry, anchorId, event)` when the host page
// needs to do something first (e.g. this page's Roster section can filter/
// paginate players out of the DOM — the football page resets those
// filters and waits a tick before jumping, see its own handler); omit it
// and this component just jumps directly, which is enough for a page
// whose roster always fully renders.
import { useState } from 'react';
import Image from 'next/image';
import styles from './StatsSection.module.css';
import { findRosterEntryByName, rosterAnchorId, jumpToPlayerAnchor } from '@/lib/players';

// Reads the leading "W"/"L" off a free-text result string (e.g.
// 'W, 28-7' or 'L, 0-2 (22-25, 17-25)') to color-code the tab. Returns
// null for anything else (Season Totals' result is null; an unexpected
// string just renders with no color), so this never throws on data it
// doesn't recognize.
function resultOutcome(result) {
  if (!result) return null;
  const t = result.trim();
  if (t.startsWith('W')) return 'win';
  if (t.startsWith('L')) return 'loss';
  return null;
}

export default function StatsSection({
  id = 'stats',
  eyebrow = 'Season',
  title = 'Player',
  titleAccent = 'Stats',
  subtitle,
  leaders = [],
  boxScores = [],
  roster = [],
  onPlayerLinkClick,
}) {
  const hasContent = leaders.length > 0 || boxScores.length > 0;

  // Tabbed-by-game box scores (added 2026-09-15, replacing the old
  // "stack every week in one long list" layout — see git history for
  // that version). Defaults to the LAST entry: for volleyball that's
  // the most recently played match, and for football (which prepends
  // a `buildSeasonTotalsEntry()` season-overview entry) that's the
  // most recent week rather than the season aggregate — most-recent-
  // first is the more useful default on either page. With 0 or 1
  // boxScores entries there's nothing to switch between, so no tab bar
  // renders at all and the single entry (if any) displays exactly as
  // it did before this change — a page with one week of data sees no
  // behavior change.
  const [activeWeek, setActiveWeek] = useState(
    boxScores.length > 0 ? boxScores.length - 1 : 0
  );
  const showTabs = boxScores.length > 1;

  return (
    <section id={id} style={{ scrollMarginTop: 120 }}>
      <div className={styles.sectionHead}>
        <div>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h2 className={styles.sectionH2} style={{ marginTop: 12 }}>
            {title} <em>{titleAccent}</em>
          </h2>
        </div>
        {subtitle && <p className={styles.sectionSub}>{subtitle}</p>}
      </div>

      {leaders.length > 0 && (
        <div className={styles.leadersGrid}>
          {leaders.map((l, i) => {
            const rosterEntry = findRosterEntryByName(roster, l.name);
            const anchorId = rosterEntry ? rosterAnchorId(rosterEntry.slug) : null;

            const cardBody = (
              <>
                <div className={styles.leaderPhotoWrap}>
                  {l.photo ? (
                    <Image src={l.photo} alt={l.name} fill sizes="80px" style={{ objectFit: 'cover' }} />
                  ) : (
                    <div aria-hidden="true" className={styles.leaderPhotoFallback}>{l.number ?? '—'}</div>
                  )}
                </div>
                <div className={styles.leaderValue}>{l.value}</div>
                <div className={styles.leaderLabel}>{l.category}</div>
                <div className={styles.leaderName}>
                  {l.name}
                  {l.number != null ? ` · #${l.number}` : ''}
                </div>
                {l.detail && <div className={styles.leaderDetail}>{l.detail}</div>}
              </>
            );

            // No roster match (e.g. name mismatch, or player not on this
            // page's roster) — stay a plain, non-clickable card rather
            // than link to an anchor that doesn't exist.
            if (!anchorId) {
              return (
                <div key={i} className={styles.leaderCard}>
                  {cardBody}
                </div>
              );
            }

            return (
              <a
                key={i}
                href={`#${anchorId}`}
                className={`${styles.leaderCard} ${styles.leaderCardLink}`}
                aria-label={`Jump to ${l.name}'s entry in the roster`}
                onClick={(e) => {
                  if (onPlayerLinkClick) {
                    onPlayerLinkClick(rosterEntry, anchorId, e);
                  } else {
                    e.preventDefault();
                    jumpToPlayerAnchor(anchorId);
                  }
                }}
              >
                {cardBody}
              </a>
            );
          })}
        </div>
      )}

      {boxScores.length > 0 && (
        <div>
          {showTabs && (
            <div className={styles.tabBar} role="tablist" aria-label="Select game">
              {boxScores.map((wk, wi) => {
                const outcome = resultOutcome(wk.result);
                return (
                  <button
                    key={wi}
                    type="button"
                    role="tab"
                    id={`${id}-tab-${wi}`}
                    aria-selected={activeWeek === wi}
                    aria-controls={`${id}-panel-${wi}`}
                    tabIndex={activeWeek === wi ? 0 : -1}
                    className={`${styles.tab} ${activeWeek === wi ? styles.tabActive : ''}`}
                    onClick={() => setActiveWeek(wi)}
                  >
                    <span className={styles.tabWeek}>{wk.week}</span>
                    {wk.opponent && <span className={styles.tabOpponent}>{wk.opponent}</span>}
                    {outcome && (
                      <span className={styles.tabResult} data-outcome={outcome}>
                        {wk.result.trim().slice(0, wk.result.indexOf(',') > -1 ? wk.result.indexOf(',') : undefined)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {boxScores.map((wk, wi) => {
            if (showTabs && wi !== activeWeek) return null;
            return (
              <div
                key={wi}
                id={showTabs ? `${id}-panel-${wi}` : undefined}
                role={showTabs ? 'tabpanel' : undefined}
                aria-labelledby={showTabs ? `${id}-tab-${wi}` : undefined}
                className={styles.weekBlock}
              >
                <div className={styles.weekHead}>
                  <span className={styles.weekLabel}>
                    {wk.week}
                    {wk.opponent ? ` — ${wk.opponent}` : ''}
                  </span>
                  <span className={styles.weekResult}>
                    {wk.result}
                    {wk.date ? ` · ${wk.date}` : ''}
                  </span>
                </div>

                {(wk.categories || []).map((cat, ci) => (
                  <div key={ci} className={styles.catBlock}>
                    <div className={styles.catHead}>{cat.label}</div>
                    <table className={styles.statsTable}>
                      <thead>
                        <tr>
                          {cat.columns.map((c, cj) => (
                            <th key={cj}>{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {cat.rows.map((r, rj) => (
                          <tr key={rj}>
                            {r.cells.map((val, cj) => (
                              <td key={cj} data-label={cat.columns[cj]}>{val}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}

                {wk.sources && wk.sources.length > 0 && (
                  <p className={styles.sourceNote}>
                    Sources:{' '}
                    {wk.sources.map((s, si) => (
                      <span key={si}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
                        {si < wk.sources.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!hasContent && (
        <p className={styles.sectionSub}>Stats will appear here once games are played and box scores are published.</p>
      )}
    </section>
  );
}
