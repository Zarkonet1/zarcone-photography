import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { marked } from 'marked';
import styles from './page.module.css';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Zarcone Photography`,
    description: post.excerpt,
  };
}

export default function PostPage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const html = marked(post.content);

  return (
    <>
      {/* Hero */}
      <div className={styles.hero}>
        {post.coverImage && (
          <div
            className={styles.heroImg}
            style={{ backgroundImage: `url('${post.coverImage}')` }}
          />
        )}
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          {post.category && <p className="eyebrow">{post.category}</p>}
          <h1 className={styles.h1}>{post.title}</h1>
          <p className={styles.meta}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className={styles.layout}>
        <article
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <aside className={styles.aside}>
          <Link href="/blog" className={styles.back}>← All Posts</Link>
          <div className={styles.asideMeta}>
            {post.category && (
              <div className={styles.asideItem}>
                <span className={styles.asideLabel}>Category</span>
                <span className={styles.asideValue}>{post.category}</span>
              </div>
            )}
            <div className={styles.asideItem}>
              <span className={styles.asideLabel}>Published</span>
              <span className={styles.asideValue}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
          </div>
          <Link href="/about#contact" className="btn" style={{ display: 'inline-block', marginTop: '40px' }}>
            Book a Session
          </Link>
        </aside>
      </div>
    </>
  );
}
