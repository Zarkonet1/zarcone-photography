'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from './InlineImageLightbox.module.css';

/**
 * Global, delegated lightbox for images embedded inside markdown/blog
 * content (which is injected via dangerouslySetInnerHTML, so it can't
 * host a normal React click handler or the gallery <Lightbox> directly).
 *
 * Usage: add `data-lightbox-src="/photos/full-res.png"` to any <img> in
 * post content. Clicking it opens that image full-size in an overlay
 * rendered by this component — same page, same DOM tree, so it inherits
 * the sitewide right-click/drag protection from ImageProtection.jsx and
 * globals.css instead of losing it the way a raw `target="_blank"` link
 * to the image file would.
 */
export default function InlineImageLightbox() {
  const [open, setOpen] = useState(null); // { src, alt } | null

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    const handleClick = (e) => {
      const trigger = e.target.closest('[data-lightbox-src]');
      if (!trigger) return;
      e.preventDefault();
      setOpen({
        src: trigger.getAttribute('data-lightbox-src'),
        alt: trigger.getAttribute('alt') || '',
      });
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={close}>
      <button className={styles.close} onClick={close}>✕ &nbsp;Close</button>
      <div className={styles.imgWrap} onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={open.src} alt={open.alt} className={styles.img} />
      </div>
    </div>
  );
}
