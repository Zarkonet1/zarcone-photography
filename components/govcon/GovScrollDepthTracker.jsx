'use client';

import { useEffect } from 'react';
import { trackGovEvent, GOV_EVENTS } from '@/lib/govconAnalytics';

const THRESHOLDS = [25, 50, 75, 100];

// Invisible instrumentation-only component — fires one analytics event per
// scroll-depth threshold, once per page visit. Renders nothing.
export default function GovScrollDepthTracker() {
  useEffect(() => {
    const fired = new Set();

    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      const pct = (window.scrollY / scrollable) * 100;

      for (const threshold of THRESHOLDS) {
        if (pct >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          trackGovEvent(GOV_EVENTS.SCROLL_DEPTH, { depth: threshold });
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
