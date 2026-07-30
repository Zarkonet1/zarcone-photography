import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import styles from './page.module.css';

// Force server-side rendering so new posts always appear immediately
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Photography Blog | Behind the Lens | Zarcone Photography',
  description: 'Tips, behind-the-scenes stories, and photography insights from Tom Zarcone — NJ portrait, sports, and event photographer based in Bridgewater.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Photography Blog | Zarcone Photography',
    description: 'Tips, behind-the-scenes stories, and photography insights from Tom Zarcone.',
    url: 'https://www.zarconephotography.com/blog',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <p className="eyebrow">The Blog</p>
          <h1 className={styles.h1}>Behind the <em>lens.</em></h1>
          <p className={styles.lead}>Stories, sessions, and the craft of photography — written from the field.</p>
        </div>
      </div>

      {/* Posts */}
      <div className={styles.grid}>
        {posts.length === 0 ? (
          <p className={styles.empty}>No posts yet — check back soon.</p>
        ) : (
          posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
              {post.coverImage && (
                <div
                  className={styles.cardImg}
                  style={{
                    backgroundImage: `url('${post.coverImage}')`,
                    backgroundPosition: post.imagePosition || 'center 15%',
                    backgroundSize: post.imageSize || 'cover',
                  }}
                />
              )}
              <div className={styles.cardBody}>
                {post.category && <p className="eyebrow">{post.category}</p>}
                <h2 className={styles.cardTitle}>{post.title}</h2>
                {post.excerpt && <p className={styles.cardExcerpt}>{post.excerpt}</p>}
                <p className={styles.cardDate}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
