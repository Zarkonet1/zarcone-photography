import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import styles from './page.module.css';

export const metadata = {
  title: 'Blog — Zarcone Photography',
  description: 'Behind the lens — stories, sessions, and the craft of photography.',
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
                  style={{ backgroundImage: `url('${post.coverImage}')` }}
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
