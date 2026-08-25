'use client';

// The dynamic dashboard hero — replaces the old marketing hero entirely
// (2026-08-25 rebuild, per Tom's brief). Three states, computed fresh on
// every render from real schedule/gallery data — no timers, no manual
// toggle:
//
//   1. NEXT   — default. Shown whenever there's an upcoming game AND the
//               most recent played game (if any) happened more than
//               RECENT_GAME_WINDOW_DAYS ago. This is what makes it
//               "transition back to promoting the next scheduled game"
//               per the brief, instead of getting stuck showing last
//               week's final forever.
//   2. FINAL  — shown for a short window right after a game (see the
//               constant below) if no gallery has posted for it yet.
//   3. GALLERY— shown in that same short window if a gallery HAS posted
//               on/after the game date (compared via GALLERIES_2026's
//               ISO date vs. the schedule's 'Mon, Aug 27' style date,
//               both assumed 2026 — see toSeasonDate below).
//
// Props are raw data, not pre-formatted strings — this component owns its
// own layout/copy per state. Pass getNextGame/getLastPlayedGame results
// from lib/teamSchedule.js and getLatestGallery's result from
// lib/footballGalleries.js directly.
import Image from 'next/image';
import styles from './NextGameHero.module.css';

// How many days after a game the hero keeps showing Final/Gallery before
// flipping back to promoting the next one. 4 days covers a Thursday game
// through the following Monday. Tune freely — this is a judgment call, not
// a sourced fact.
const RECENT_GAME_WINDOW_DAYS = 4;

// SCHEDULE_2026 dates look like 'Thu, Aug 27' with no year — this file is
// scoped to the 2026 season only (see lib/footballSchedule.js), so hardcode
// 2026 here. If this component gets reused for a future season, this needs
// to read the year from somewhere instead of assuming it.
function toSeasonDate(scheduleDateStr) {
  const stripped = scheduleDateStr.replace(/^[A-Za-z]+,\s*/, '');
  return new Date(`${stripped}, 2026`);
}

function opponentName(opponentStr) {
  return opponentStr.replace(/^(at|vs)\s+/i, '').toUpperCase();
}

export default function NextGameHero({ nextGame, lastPlayedGame, latestGallery, bgPhotoSrc }) {
  const now = new Date();
  const gameRecent =
    lastPlayedGame &&
    (now - toSeasonDate(lastPlayedGame.date)) / 86400000 <= RECENT_GAME_WINDOW_DAYS;

  let state = 'next';
  if (gameRecent) {
    const galleryCoversGame =
      latestGallery && new Date(latestGallery.date) >= toSeasonDate(lastPlayedGame.date);
    state = galleryCoversGame ? 'gallery' : 'final';
  }

  return (
    <section className={styles.hero}>
      <Image src={bgPhotoSrc} alt="Bridgewater-Raritan Panther Football" fill priority sizes="100vw" className={styles.heroImg} />
      <div className={styles.scrim} />

      {state === 'gallery' && (
        <div className={styles.content}>
          <span className={styles.eyebrow}>{opponentName(lastPlayedGame.opponent)} Game Gallery</span>
          <h1 className={styles.bigLine}>
            {latestGallery.photoCount ? `${latestGallery.photoCount} Photos` : 'Photos Are Live'}
          </h1>
          <a href={latestGallery.href} target="_blank" rel="noopener noreferrer" className={styles.cta}>View Gallery →</a>
        </div>
      )}

      {state === 'final' && (
        <div className={styles.content}>
          <span className={styles.eyebrow}>Final</span>
          {lastPlayedGame.result.usScore != null && lastPlayedGame.result.themScore != null ? (
            <div className={styles.scoreLine}>
              <span>BRHS <strong>{lastPlayedGame.result.usScore}</strong></span>
              <span>{opponentName(lastPlayedGame.opponent)} <strong>{lastPlayedGame.result.themScore}</strong></span>
            </div>
          ) : (
            <h1 className={styles.bigLine}>
              {lastPlayedGame.result.win ? 'W' : 'L'} {lastPlayedGame.result.score} — {opponentName(lastPlayedGame.opponent)}
            </h1>
          )}
          <a href="#schedule" className={styles.cta}>Full Schedule →</a>
        </div>
      )}

      {state === 'next' && (
        <div className={styles.content}>
          <span className={styles.eyebrow}>{nextGame ? 'Next Game' : '2026 Season Complete'}</span>
          {nextGame ? (
            <>
              <h1 className={styles.matchup}>
                Bridgewater-Raritan Panthers
                <span className={styles.vs}>{nextGame.home ? 'vs' : '@'}</span>
                {opponentName(nextGame.opponent)}
              </h1>
              <div className={styles.metaRow}>
                <span>{nextGame.date} · {nextGame.time}</span>
                <span className={styles.badge}>{nextGame.home ? 'Home' : 'Away'}</span>
                {nextGame.location && <span>{nextGame.location}</span>}
              </div>
              <a href="#schedule" className={styles.cta}>Game Day Info →</a>
            </>
          ) : (
            <a href="#schedule" className={styles.cta}>Full Schedule &amp; Results →</a>
          )}
        </div>
      )}
    </section>
  );
}
