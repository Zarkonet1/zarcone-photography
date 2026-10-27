// BRHS Panther Girls Basketball hub — every photo slot on the page, in one
// place. To add a photo: put the file in public/photos/girls-basketball/,
// then set that slot's `src` (and `alt`, and `position` if the crop needs
// it). Leave `src: null` and the page shows a designed placeholder at the
// right aspect ratio. Nothing else on the page needs to change.
//
// Rules (brief, 2026-10-27): Zarcone Photography originals only. No stock,
// no AI-generated athletes, no football or other-sport photos. No athlete
// imagery until Tom has approved the specific asset.
//
// Recommended sizes: hero 2400x1350 (16:9), team 2400x1600 (3:2),
// feature/action 1600x2000 (4:5), senior night 2400x1600, tiles 1200x900.
export const IMAGE_SLOTS = {
  hero: { src: null, alt: '', position: 'center', aspect: '16 / 9', label: 'Hero photo' },
  team: { src: null, alt: '', position: 'center', aspect: '3 / 2', label: 'Team photo' },
  feature: { src: null, alt: '', position: 'center', aspect: '4 / 5', label: 'Feature photo' },
  action: [
    { src: null, alt: '', position: 'center', aspect: '4 / 5', label: 'Game action' },
    { src: null, alt: '', position: 'center', aspect: '4 / 5', label: 'Game action' },
    { src: null, alt: '', position: 'center', aspect: '4 / 5', label: 'Game action' },
  ],
  featuredGame: { src: null, alt: '', position: 'center', aspect: '3 / 2', label: 'Featured game' },
  seniorNight: { src: null, alt: '', position: 'center', aspect: '3 / 2', label: 'Senior Night' },
  highlights: { src: null, alt: '', position: 'center', aspect: '3 / 2', label: 'Season highlights' },
  // Media Center navigation tiles (1200x900 works well).
  tiles: {
    galleries: null,
    team: null,
    schedule: null,
    stats: null,
    news: null,
  },
};

// Individual player portraits use the jersey-number convention instead of
// slots: public/photos/girls-basketball-portraits/{number}.jpg, enabled per
// number via PORTRAIT_NUMBERS in lib/girlsBasketballContent.js.
export function portraitSrc(number) {
  return `/photos/girls-basketball-portraits/${number}.jpg`;
}
