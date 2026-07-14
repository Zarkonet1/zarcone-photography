// Live business-status lookup from the Google Places API (New), sourced from
// the same data as the public Google Business Profile listing.
//
// Requires two env vars in Vercel (Production scope):
//   GOOGLE_PLACES_API_KEY — API key with "Places API (New)" enabled, billing on
//   GOOGLE_PLACE_ID       — this business's Place ID (see setup notes in CLAUDE.md)
//
// Cached in-memory to keep cost near-zero — hours don't change minute to minute,
// and Places API bills per request. Cache is per serverless instance, so a cold
// start will always re-fetch; that's fine at this traffic volume.

let cache = { data: null, fetchedAt: 0 };
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export async function getLiveBusinessStatus() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null; // feature not configured yet

  const now = Date.now();
  if (cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'currentOpeningHours,regularOpeningHours,businessStatus,internationalPhoneNumber',
      },
      // Keep this fast — if Google is slow, fail open rather than delay the chat reply.
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      console.error('Places API error:', res.status, await res.text().catch(() => ''));
      return cache.data; // serve stale cache rather than nothing, if we have it
    }
    const json = await res.json();
    cache = { data: json, fetchedAt: now };
    return json;
  } catch (err) {
    console.error('Places API fetch failed:', err);
    return cache.data;
  }
}

export function formatBusinessStatusForPrompt(data) {
  if (!data) return '';
  const lines = [];

  if (typeof data.currentOpeningHours?.openNow === 'boolean') {
    lines.push(`Currently ${data.currentOpeningHours.openNow ? 'OPEN' : 'CLOSED'} per published Google Business Profile hours.`);
  }
  const weekday = data.regularOpeningHours?.weekdayDescriptions;
  if (Array.isArray(weekday) && weekday.length) {
    lines.push(`Published hours: ${weekday.join('; ')}.`);
  }
  if (data.businessStatus && data.businessStatus !== 'OPERATIONAL') {
    lines.push(`Google Business Profile status: ${data.businessStatus}.`);
  }

  return lines.join(' ');
}
