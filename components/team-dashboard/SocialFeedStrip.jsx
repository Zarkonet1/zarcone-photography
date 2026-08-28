'use client';

// Panthers Social — reusable social-content strip for the team dashboard
// pattern (added 2026-08-28, BRHS Football). Demonstrates the platform
// principle behind the Media Hub: a team's existing social content becomes
// part of its permanent home instead of living only on the platform it was
// posted to. Instagram is the only platform wired up today; nothing here
// assumes it stays that way (see the `platform` prop and lib/socialFeed.js).
//
// DATA: posts come from lib/socialFeed.js's getSocialFeedPosts(), which
// currently returns a manually-curated, verified list. See that file's
// header comment for exactly what real Instagram automation would require
// and why it isn't wired up yet. This component doesn't know or care
// whether `posts` came from a manual list or a live API call — same props
// either way, which is the point.
//
// REUSE: every prop below has a BRHS-shaped default so `<SocialFeedStrip />`
// with no props keeps rendering exactly the BRHS Football feed. A future
// team page passes its own account/title/posts (see lib/socialFeed.js's
// SOCIAL_FEEDS registry) and gets a fully-rebranded version with zero
// changes to this file.
//
// FAILURE BEHAVIOR: `enabled={false}` renders nothing at all. An empty
// `posts` array (e.g. a future live fetch that came back empty or failed)
// renders just the header + Follow CTA — never a big empty carousel, never
// a visible error, never anything that can slow or block the rest of the
// page. This component makes no network calls itself, so there is nothing
// here that can hang or retry.
import Image from 'next/image';
import styles from './SocialFeedStrip.module.css';

function InstagramIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// '2026-08-27' -> 'Aug 27'. Falls back to the raw string for anything that
// isn't a plain YYYY-MM-DD date, rather than showing 'Invalid Date'.
function formatPostDate(iso) {
  if (!iso) return '';
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function truncate(text, max = 140) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

export default function SocialFeedStrip({
  enabled = true,
  platform = 'instagram',
  account = 'brhspanthersfb',
  displayName = 'BRHS Football',
  title = 'Panthers Social',
  subtitle = `Latest from @${account}`,
  profileUrl = `https://www.instagram.com/${account}/`,
  posts = [],
}) {
  if (!enabled) return null;

  const platformLabel = platform === 'instagram' ? 'Instagram' : platform;
  const hasPosts = posts.length > 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div>
          <span className={styles.eyebrow}>{title}</span>
          <h2 className={styles.heading}>
            Latest from <em>@{account}</em>
          </h2>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.followBtn}
          aria-label={`Follow @${account} on ${platformLabel} (opens in a new tab)`}
        >
          <InstagramIcon />
          Follow @{account}
        </a>
      </div>

      {!hasPosts ? (
        // Graceful no-content fallback — see file header. No carousel, no
        // error, no empty space beyond the header row itself.
        <p className={styles.emptyNote}>
          New posts from {displayName}&rsquo;s {platformLabel} show up here as they go live —
          in the meantime, catch the latest directly{' '}
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">on {platformLabel}</a>.
        </p>
      ) : (
        <ul className={styles.track} role="list">
          {posts.map((post) => {
            const dateLabel = formatPostDate(post.date);
            const typeLabel = post.type === 'reel' ? 'Reel' : 'Photo';
            const ariaLabel = `${platformLabel} ${typeLabel.toLowerCase()} from ${displayName}${dateLabel ? `, ${dateLabel}` : ''}: ${truncate(post.caption, 90)} — opens on ${platformLabel}`;
            return (
              <li key={post.id} className={styles.cardItem}>
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                  aria-label={ariaLabel}
                >
                  <div className={styles.imgWrap}>
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt=""
                        fill
                        sizes="260px"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div aria-hidden="true" className={styles.imgFallback} />
                    )}
                    <div className={styles.scrim} />
                  </div>
                  <span className={styles.badge} aria-hidden="true">
                    <InstagramIcon size={14} />
                  </span>
                  <div className={styles.text}>
                    <span className={styles.meta}>
                      {typeLabel}{dateLabel ? ` · ${dateLabel}` : ''}
                    </span>
                    <span className={styles.caption}>{truncate(post.caption)}</span>
                  </div>
                </a>
              </li>
            );
          })}
          <li className={styles.cardItem}>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.followCard}
              aria-label={`See more from @${account} on ${platformLabel} (opens in a new tab)`}
            >
              <InstagramIcon size={26} />
              <span className={styles.followCardTitle}>Follow @{account}</span>
              <span className={styles.followCardSub}>on {platformLabel}</span>
            </a>
          </li>
        </ul>
      )}
    </div>
  );
}
