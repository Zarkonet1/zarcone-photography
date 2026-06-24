import Link from 'next/link';
import styles from './VideoReel.module.css';

// ─── Drop your video file here ───────────────────────────────────────────────
// Add a .mp4 file to public/videos/ and set the path below.
// Recommended: 1920×1080, H.264, compressed to ~10–20MB, no audio needed.
// Example: const VIDEO_SRC = '/videos/zarcone-reel-2026.mp4';
const VIDEO_SRC = '/videos/portraits-prosecco-reel.mp4';
// ─────────────────────────────────────────────────────────────────────────────

export default function VideoReel() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.videoWrap}>
          {VIDEO_SRC ? (
            <video
              className={styles.video}
              src={VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <div className={styles.placeholder}>
              <p className={`eyebrow ${styles.placeholderLabel}`}>Reel Coming Soon</p>
            </div>
          )}
          <div className={styles.overlay} />
        </div>
        <div className={styles.content}>
          <p className={`eyebrow ${styles.eyebrow}`}>In Motion</p>
          <h2 className={styles.title}>Photography <em>&amp; Video</em></h2>
          <p className={styles.desc}>
            Still images tell the story. Video captures the feeling. From sports highlights to event coverage and portrait sessions — the full picture, in motion.
          </p>
          <Link href="/about#contact" className="btn">Inquire About Video →</Link>
        </div>
      </div>
    </section>
  );
}
