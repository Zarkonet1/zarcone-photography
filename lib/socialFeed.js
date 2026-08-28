// Social Feed data layer — powers the reusable <SocialFeedStrip> component
// (components/team-dashboard/SocialFeedStrip.jsx). Added 2026-08-28 for the
// BRHS Football "Panthers Social" section.
//
// WHY THIS SHAPE: the Media Hub platform pitch is "surface content teams
// already create on social — don't make them duplicate work." Doing that
// with fully-automated Instagram ingestion requires infrastructure this
// project doesn't have yet (see "AUTOMATING THIS LATER" below), so today
// this file exports a manually-curated post list per team. The function
// below — getSocialFeedPosts() — is the one seam a future live integration
// replaces: swap its body for a server-side Instagram Graph API call and
// nothing in <SocialFeedStrip> or the pages that use it has to change,
// because the returned shape ({ enabled, platform, account, displayName,
// title, subtitle, posts }) stays identical either way.
//
// SOURCING: every post below was manually verified against the account's
// own live, public profile on 2026-08-28 (permalink, date, and caption
// copied verbatim — nothing generated or approximated). This is the same
// manual-verification standard already used elsewhere in this codebase for
// real data (footballSchedule.js, footballGalleries.js) — not an automated
// scraper, and not run on a schedule. Re-verify against the live profile
// before reusing these captions/dates for anything beyond this demo.
//
// AUTOMATING THIS LATER (Instagram):
// Full automatic ingestion from a real Instagram account requires, at
// minimum:
//   1. The account (@brhspanthersfb, or whichever handle a future team
//      uses) converted to an Instagram Business or Creator account.
//   2. That account linked to a Facebook Page (can be minimal/unpublished).
//   3. A Meta developer app with the Instagram Graph API product added.
//   4. An admin of the Instagram account completing a one-time "Facebook
//      Login for Business" grant to that app (Zarcone cannot generate this
//      token — it has to come from whoever administers the team's account).
//   5. The resulting long-lived access token stored as a Vercel env var
//      (e.g. INSTAGRAM_ACCESS_TOKEN) — never in source — plus a refresh
//      job, since these tokens expire (~60 days) and need silent renewal
//      before that, ideally in a small scheduled function or on each fetch
//      with a stored refresh token.
//   6. A server-side fetch (an API route, not client-side — the token
//      can't be exposed to the browser, and Instagram's Graph API doesn't
//      allow direct browser calls anyway) hitting
//      GET /{ig-user-id}/media?fields=caption,media_url,permalink,timestamp
//      and caching the result (ISR / revalidate) so page loads don't call
//      Instagram directly and rate limits stay far out of reach.
// Instagram's old no-token embed paths (oEmbed, Basic Display API) are
// gone — Meta shut Basic Display down in Dec 2024 and locked oEmbed behind
// the same app-review process. There is no token-free automated path left.
//
// REUSE: to enable this for another team, add a new key to SOCIAL_FEEDS
// below with that team's own account/config/posts and pass that key to
// getSocialFeedPosts(). Nothing else needs to change — <SocialFeedStrip>
// already takes all of this as props.

export const SOCIAL_FEEDS = {
  'brhs-football': {
    enabled: true,
    platform: 'instagram',
    account: 'brhspanthersfb',
    displayName: 'BRHS Football',
    title: 'Panthers Social',
    subtitle: 'Latest from @brhspanthersfb',
    profileUrl: 'https://www.instagram.com/brhspanthersfb/',
    postCount: 5,
    posts: [
      {
        id: 'Dci-uLlum-r',
        type: 'photo',
        date: '2026-08-27',
        permalink: 'https://www.instagram.com/brhspanthersfb/p/Dci-uLlum-r/',
        caption: "2026-2027 SENIOR CLASS 🏈 Thank you to our incredible sponsors for helping make this season possible! LET'S GO PANTHERS! 🔥",
        // No confirmed-matching Zarcone asset on file for this specific
        // post — falls back to the branded gradient treatment (see
        // MediaCenterGrid's identical `img: ''` fallback pattern) rather
        // than guessing which photo it is.
        image: null,
      },
      {
        id: 'DcY7xyjR7pp',
        type: 'photo',
        date: '2026-08-23',
        permalink: 'https://www.instagram.com/brhspanthersfb/p/DcY7xyjR7pp/',
        caption: 'BR PANTHER FOOTBALL KICKOFF 2026! The countdown is on! Join us Sunday, August 30th at Green Knoll Grill as we bring together our past, present & future Panther football families.',
        // Same Family Day / Kickoff flyer already used in the page's own
        // Family Day section further down — same event, same real asset.
        image: '/photos/brhs-football-kickoff-2026-flyer.jpg',
      },
      {
        id: 'Dbv2_ziRhT6',
        type: 'reel',
        date: '2026-08-07',
        permalink: 'https://www.instagram.com/brhspanthersfb/reel/Dbv2_ziRhT6/',
        caption: 'BCC Media Day 2026! The 2026 season is officially underway! Our Bridgewater-Raritan Panthers are ready to put in the work, compete together, and chase something special. #EAT',
        // Real Media Day team photo already on file for this exact event.
        image: '/photos/media-day-varsity-team.jpg',
      },
      {
        id: 'DbTAxf5OQYf',
        type: 'photo',
        date: '2026-07-27',
        permalink: 'https://www.instagram.com/brhspanthersfb/p/DbTAxf5OQYf/',
        caption: 'A huge thank you to Zarcone Photography for being a Gold Sponsor of the Bridgewater Raritan Football Program! Your generosity helps provide the equipment, resources, and opportunities our players need.',
        image: null,
      },
    ],
  },
};

// Returns the display-ready feed for one team, already trimmed to
// postCount. Never throws — an unknown or disabled key returns a
// `posts: []` shape so <SocialFeedStrip> can render its graceful
// no-content fallback instead of the caller needing a try/catch.
export function getSocialFeedPosts(feedKey) {
  const feed = SOCIAL_FEEDS[feedKey];
  if (!feed || !feed.enabled) {
    return { enabled: false, posts: [] };
  }
  return {
    enabled: true,
    platform: feed.platform,
    account: feed.account,
    displayName: feed.displayName,
    title: feed.title,
    subtitle: feed.subtitle,
    profileUrl: feed.profileUrl,
    posts: feed.posts.slice(0, feed.postCount),
  };
}
