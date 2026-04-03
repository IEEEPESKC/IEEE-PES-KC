import { NextResponse } from 'next/server';
import { getAllContent } from '../../../lib/wordpress';

/**
 * GET /api/admin
 * Proxies all WordPress content and returns it in the legacy shape:
 * { success: true, data: { events, announcements, gallery, execom, ... } }
 * 
 * This keeps every existing page component working without changes.
 */
export async function GET() {
  try {
    const data = await getAllContent();
    return NextResponse.json({ success: true, data }, {
      headers: {
        // Allow Next.js ISR / edge caching
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      }
    });
  } catch (error) {
    console.error('[API] WordPress fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        data: {
          events: [], announcements: [], gallery: [], execom: [],
          chapters: [], awards: [], recognitions: [], newsletters: [], magazines: []
        }
      },
      { status: 502 }
    );
  }
}

/**
 * POST /api/admin — Content creation
 * In the WordPress branch, content is managed directly inside WordPress admin.
 * Attempts to create a post via the WP REST API using Application Passwords.
 */
export async function POST(req) {
  const WP_BASE = process.env.NEXT_PUBLIC_WP_BASE_URL || 'https://pes.ieeekerala.org/wp-json/wp/v2';
  const WP_USER = process.env.WP_ADMIN_USER;
  const WP_APP_PASS = process.env.WP_APP_PASSWORD;

  if (!WP_USER || !WP_APP_PASS) {
    return NextResponse.json(
      { error: 'WordPress credentials not configured. Set WP_ADMIN_USER and WP_APP_PASSWORD in .env.' },
      { status: 501 }
    );
  }

  try {
    const formData = await req.formData();
    const type = formData.get('type');
    const title = formData.get('title') || formData.get('name') || 'New Entry';

    // Map internal type → WP CPT slug
    const cptMap = {
      events: 'pes_event', gallery: 'pes_gallery', execom: 'pes_execom',
      chapters: 'pes_chapter', awards: 'pes_award', newsletters: 'pes_newsletter',
      magazines: 'pes_magazine', announcements: 'posts',
    };
    const cpt = cptMap[type] || type;

    const credentials = Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64');
    const body = { title, status: 'publish' };

    const res = await fetch(`${WP_BASE}/${cpt}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `WordPress error: ${err}` }, { status: res.status });
    }

    const item = await res.json();
    return NextResponse.json({ success: true, item: { id: String(item.id), title } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin — Content deletion
 * Deletes from WordPress via REST API with Application Password auth.
 */
export async function DELETE(req) {
  const WP_BASE = process.env.NEXT_PUBLIC_WP_BASE_URL || 'https://pes.ieeekerala.org/wp-json/wp/v2';
  const WP_USER = process.env.WP_ADMIN_USER;
  const WP_APP_PASS = process.env.WP_APP_PASSWORD;

  if (!WP_USER || !WP_APP_PASS) {
    return NextResponse.json(
      { error: 'WordPress credentials not configured.' },
      { status: 501 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    const cptMap = {
      events: 'pes_event', gallery: 'pes_gallery', execom: 'pes_execom',
      chapters: 'pes_chapter', awards: 'pes_award', newsletters: 'pes_newsletter',
      magazines: 'pes_magazine', announcements: 'posts',
    };
    const cpt = cptMap[type] || type;

    const credentials = Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64');

    const res = await fetch(`${WP_BASE}/${cpt}/${id}?force=true`, {
      method: 'DELETE',
      headers: { 'Authorization': `Basic ${credentials}` },
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `WordPress error: ${err}` }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}