'use client';

import { useEffect } from 'react';

/**
 * Blocks the right-click context menu on <img> elements sitewide, so
 * "Save Image As" isn't one click away for casual visitors.
 *
 * This is a deterrent, not real protection — anyone using dev tools,
 * view-source, or a screenshot can still get the image, and nothing
 * client-side changes that. It just removes the easiest path for the
 * average visitor. Pairs with the drag/select/callout rules on `img`
 * in app/globals.css.
 */
export default function ImageProtection() {
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return null;
}
