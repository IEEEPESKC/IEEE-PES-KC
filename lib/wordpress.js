/**
 * WordPress REST API Client
 * Maps WordPress data to the IEEE PES KC site's internal data shapes.
 * 
 * WordPress Setup Required:
 *  - WP REST API (built-in)
 *  - Advanced Custom Fields (ACF) plugin
 *  - ACF to REST API plugin (exposes ACF fields in WP REST API)
 *  - Custom Post Types:
 *    ├── pes_event       → Events (upcoming & past, differentiated by category)
 *    ├── pes_gallery     → Gallery images
 *    ├── pes_execom      → Executive committee members
 *    ├── pes_chapter     → Student branch chapters
 *    ├── pes_award       → Awards & recognitions
 *    ├── pes_newsletter  → Newsletters
 *    ├── pes_magazine    → Magazines
 *    └── posts (built-in) → Announcements
 */

const WP_BASE = process.env.NEXT_PUBLIC_WP_BASE_URL;

const WP_REVALIDATE = parseInt(process.env.WP_REVALIDATE_SECONDS || '60', 10);

/**
 * Generic fetch wrapper with ISR revalidation + error handling.
 */
async function wpFetch(endpoint, params = {}) {
  const url = new URL(`${WP_BASE}/${endpoint}`);
  // Always ask for max items per page & embedded media
  const defaults = { per_page: '100', _embed: 'true' };
  Object.entries({ ...defaults, ...params }).forEach(([k, v]) =>
    url.searchParams.set(k, String(v))
  );

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: WP_REVALIDATE },
    });
    if (!res.ok) {
      console.warn(`[WP] ${url} → ${res.status} ${res.statusText}`);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error(`[WP] Failed to fetch ${url}:`, err.message);
    return [];
  }
}

/** Extract the best available featured image URL from an embedded WP post. */
function featuredImage(post) {
  try {
    return (
      post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
      post?.acf?.image ||
      null
    );
  } catch {
    return null;
  }
}

/** Strip HTML tags from WP rendered content. */
function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').trim();
}

/** Parse a tag/category array from WP (name strings). */
function tagNames(post) {
  try {
    return (
      post?._embedded?.['wp:term']?.flat()?.map((t) => t?.name).filter(Boolean) || []
    );
  } catch {
    return [];
  }
}

// ─── Mappers ────────────────────────────────────────────────────────────────

function mapEvent(post) {
  const acf = post.acf || {};
  return {
    id: String(post.id),
    title: post.title?.rendered ? stripHtml(post.title.rendered) : 'Untitled',
    description: acf.description || stripHtml(post.excerpt?.rendered || ''),
    date: acf.event_date || acf.date || post.date?.slice(0, 10) || '',
    venue: acf.venue || acf.location || '',
    imageUrl: acf.image || featuredImage(post) || '',
    link: acf.registration_link || acf.link || post.link || '',
    tags: tagNames(post),
    status: acf.status || 'published',
  };
}

function mapAnnouncement(post) {
  const acf = post.acf || {};
  return {
    id: String(post.id),
    title: post.title?.rendered ? stripHtml(post.title.rendered) : 'Untitled',
    description: acf.description || stripHtml(post.excerpt?.rendered || ''),
    date: acf.date || post.date?.slice(0, 10) || '',
    imageUrl: acf.image || featuredImage(post) || '',
    link: acf.link || post.link || '',
    tags: tagNames(post),
  };
}

function mapGallery(post) {
  const acf = post.acf || {};
  return {
    id: String(post.id),
    title: post.title?.rendered ? stripHtml(post.title.rendered) : 'Gallery',
    imageUrl: acf.image || featuredImage(post) || '',
    url: acf.image || featuredImage(post) || '',
    date: post.date?.slice(0, 10) || '',
    tags: tagNames(post),
  };
}

function mapExecom(post) {
  const acf = post.acf || {};
  return {
    id: String(post.id),
    name: post.title?.rendered ? stripHtml(post.title.rendered) : 'Member',
    role: acf.role || acf.designation || '',
    category: acf.category || acf.group || 'professionals',
    imageUrl: acf.image || featuredImage(post) || '',
    email: acf.email || '',
    linkedin: acf.linkedin || '',
    status: acf.status || 'current',
    year: acf.year || '',
  };
}

function mapChapter(post) {
  const acf = post.acf || {};
  return {
    id: String(post.id),
    name: post.title?.rendered ? stripHtml(post.title.rendered) : 'Chapter',
    college: acf.college || '',
    location: acf.location || '',
    imageUrl: acf.image || featuredImage(post) || '',
    link: acf.link || post.link || '',
    tags: tagNames(post),
  };
}

function mapAward(post) {
  const acf = post.acf || {};
  return {
    id: String(post.id),
    title: post.title?.rendered ? stripHtml(post.title.rendered) : 'Award',
    description: acf.description || stripHtml(post.excerpt?.rendered || ''),
    year: acf.year || post.date?.slice(0, 4) || '',
    imageUrl: acf.image || featuredImage(post) || '',
    tags: tagNames(post),
  };
}

function mapNewsletter(post) {
  const acf = post.acf || {};
  return {
    id: String(post.id),
    title: post.title?.rendered ? stripHtml(post.title.rendered) : 'Newsletter',
    description: acf.description || stripHtml(post.excerpt?.rendered || ''),
    date: acf.date || post.date?.slice(0, 10) || '',
    imageUrl: acf.image || featuredImage(post) || '',
    link: acf.file_url || acf.link || post.link || '',
    volume: acf.volume || '',
    issue: acf.issue || '',
  };
}

function mapMagazine(post) {
  const acf = post.acf || {};
  return {
    id: String(post.id),
    title: post.title?.rendered ? stripHtml(post.title.rendered) : 'Magazine',
    description: acf.description || stripHtml(post.excerpt?.rendered || ''),
    date: acf.date || post.date?.slice(0, 10) || '',
    imageUrl: acf.image || featuredImage(post) || '',
    link: acf.file_url || acf.link || post.link || '',
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getEvents() {
  const posts = await wpFetch('pes_event');
  return posts.map(mapEvent);
}

export async function getAnnouncements() {
  // Use built-in posts with category "announcements", or the pes_announcement CPT if created
  const posts = await wpFetch('posts', { categories_exclude: '', per_page: '50' });
  return posts.map(mapAnnouncement);
}

export async function getGallery() {
  const posts = await wpFetch('pes_gallery');
  return posts.map(mapGallery);
}

export async function getExecom() {
  const posts = await wpFetch('pes_execom');
  return posts.map(mapExecom);
}

export async function getChapters() {
  const posts = await wpFetch('pes_chapter');
  return posts.map(mapChapter);
}

export async function getAwards() {
  const posts = await wpFetch('pes_award');
  return posts.map(mapAward);
}

export async function getNewsletters() {
  const posts = await wpFetch('pes_newsletter');
  return posts.map(mapNewsletter);
}

export async function getMagazines() {
  const posts = await wpFetch('pes_magazine');
  return posts.map(mapMagazine);
}

/**
 * Fetches all content types in parallel — mirrors the shape returned by the 
 * old /api/admin endpoint so existing page components need zero changes.
 */
export async function getAllContent() {
  const [events, announcements, gallery, execom, chapters, awards, newsletters, magazines] =
    await Promise.all([
      getEvents(),
      getAnnouncements(),
      getGallery(),
      getExecom(),
      getChapters(),
      getAwards(),
      getNewsletters(),
      getMagazines(),
    ]);

  return { events, announcements, gallery, execom, chapters, awards, newsletters, magazines, recognitions: awards };
}
