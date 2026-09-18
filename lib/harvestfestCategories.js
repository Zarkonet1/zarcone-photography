// Single source of truth for the /harvestfest QR landing page's five
// "What are you interested in?" tiles. Each category links out to a real,
// already-live gallery page rather than duplicating content here — the
// HarvestFest page's job is a fast visual intro + a few representative
// images, not a second portfolio.
//
// Schools & Teams intentionally does NOT pull generic game-action photos
// (that's already covered by Sports & Athletes) — per Tom (2026-09-18),
// its images should read as "media partnership," not "more football
// photos": Media Day team/portrait imagery plus one piece of real game
// coverage, drawn from the live BRHS Football/Volleyball hubs.
export const HARVESTFEST_CATEGORIES = [
  {
    id: 'sports',
    label: 'Sports & Athletes',
    tileImage: '/photos/i-s7zBdzk.jpg',
    blurb: 'Game-day action, season coverage, and senior athlete portraits.',
    exploreHref: '/sports',
    exploreLabel: 'See the Sports gallery',
    images: [
      { src: '/photos/i-s7zBdzk.jpg', alt: 'Football action — Zarcone Photography' },
      { src: '/photos/i-Lv2PXKm.jpg', alt: 'Wrestling action — Zarcone Photography' },
      { src: '/photos/i-TSHFjz3.jpg', alt: 'Lacrosse action — Zarcone Photography' },
      { src: '/photos/SPORTS-FB100.jpg', alt: 'Football game coverage — Zarcone Photography' },
    ],
  },
  {
    id: 'seniors',
    label: 'Senior Portraits',
    tileImage: '/photos/Sniors.jpg',
    blurb: 'Senior sessions built around multiple looks, real locations, and posters worth framing.',
    exploreHref: '/senior-portrait-photographer-nj',
    exploreLabel: 'See Senior Portraits',
    images: [
      { src: '/photos/Sniors.jpg', alt: 'Senior portraits — Zarcone Photography' },
      { src: '/photos/GiadaField.jpg', alt: 'Senior portrait — Zarcone Photography' },
      { src: '/photos/SENIOR-POSTER-Stark-Football.jpg', alt: 'Senior athlete poster — Zarcone Photography' },
      { src: '/photos/SENIOR-POSTER-Giada-Lacrosse.jpg', alt: 'Senior athlete poster — Zarcone Photography' },
    ],
  },
  {
    id: 'family',
    label: 'Family & Individual',
    tileImage: '/photos/i-pnGfzmw.jpg',
    blurb: 'Relaxed sessions for families, individuals, and headshots — real expressions, not stiff posing.',
    exploreHref: '/portraits',
    exploreLabel: 'See Portraits',
    images: [
      { src: '/photos/i-pnGfzmw.jpg', alt: 'Family portrait — Zarcone Photography' },
      { src: '/photos/i-3JzdPqR.jpg', alt: 'Family portrait — Zarcone Photography' },
      { src: '/photos/i-LdgcRk9.jpg', alt: 'Individual portrait — Zarcone Photography' },
      { src: '/photos/i-rkggQ5F.jpg', alt: 'Headshot — Zarcone Photography' },
    ],
  },
  {
    id: 'schools',
    label: 'Schools & Teams',
    tileImage: '/photos/media-day-varsity-team.jpg',
    blurb: 'Season-long media partnerships for schools and programs — Media Day, game coverage, and a dedicated team hub.',
    exploreHref: '/schools-athletic-programs-nj',
    exploreLabel: 'See Schools & Programs',
    images: [
      { src: '/photos/media-day-varsity-team.jpg', alt: 'BRHS Panther Football Media Day — Zarcone Photography' },
      { src: '/photos/media-day-seniors-coach.jpg', alt: 'BRHS Panther Football senior portrait — Zarcone Photography' },
      { src: '/photos/BRHS-Volleyball-2026-MSM-Kill.jpg', alt: 'BRHS Panther Volleyball game coverage — Zarcone Photography' },
      { src: '/photos/media-day-coaches.jpg', alt: 'BRHS Panther Football coaching staff — Zarcone Photography' },
    ],
  },
  {
    id: 'events',
    label: 'Events & Organizations',
    tileImage: '/photos/EVENT-Zarcone-Photography-201.jpg',
    blurb: 'Full-day coverage for celebrations, fundraisers, and organizational events.',
    exploreHref: '/events',
    exploreLabel: 'See Events',
    images: [
      { src: '/photos/EVENT-Zarcone-Photography-201.jpg', alt: 'Charity 5K team celebration — Zarcone Photography' },
      { src: '/photos/EVENT-Zarcone-Photography-13.jpg', alt: 'Event coverage — Zarcone Photography' },
      { src: '/photos/EVENT-Zarcone-Photography-65.jpg', alt: 'Event coverage — Zarcone Photography' },
      { src: '/photos/Ironman_Bike_Dylan.jpg', alt: 'Event coverage — Zarcone Photography' },
    ],
  },
];
