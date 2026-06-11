import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'posts');

export function getAllPosts() {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

  const posts = files.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(postsDir, filename), 'utf8');
    const { data } = matter(raw);
    return {
      slug,
      title:      data.title      || slug,
      date:       data.date       || '',
      excerpt:    data.excerpt    || '',
      category:   data.category   || '',
      coverImage:     data.coverImage     || '',
      imagePosition:  data.imagePosition  || 'center 15%',
    };
  });

  // Sort newest first
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  const filepath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;
  const raw = fs.readFileSync(filepath, 'utf8');
  const { data, content } = matter(raw);
  return {
    slug,
    title:          data.title          || slug,
    date:           data.date           || '',
    excerpt:        data.excerpt        || '',
    category:       data.category       || '',
    coverImage:     data.coverImage     || '',
    imagePosition:  data.imagePosition  || 'center 15%',
    content,
  };
}
