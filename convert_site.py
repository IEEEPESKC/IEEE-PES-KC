import re
import os

# Create app directory
os.makedirs('app', exist_ok=True)

# Read index.html
with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extract CSS
style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
css_content = style_match.group(1) if style_match else ""

with open('app/globals.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

# 2. Extract Body Content (between <body> and the start of the script/end)
# We look for the main content wrapper "box-layout" usually or just body content
body_match = re.search(r'<body>(.*?)<script src', content, re.DOTALL)
if not body_match:
    print("Could not find body content properly.")
    # Fallback to looking for just before the inline script
    body_match = re.search(r'<body>(.*?)<script>', content, re.DOTALL)

html_body = body_match.group(1) if body_match else ""

# 3. Extract Inline Script
# Finding the last script tag which contains the custom logic
scripts = re.findall(r'<script>(.*?)</script>', content, re.DOTALL)
custom_js = scripts[-1] if scripts else ""

# 4. Generate app/page.js
# Convert HTML to JSX
jsx = html_body

# Common JSX replacements
jsx = jsx.replace('class=', 'className=')
jsx = jsx.replace('autoplay', 'autoPlay')
jsx = jsx.replace('muted', 'muted') 
jsx = jsx.replace('loop', 'loop')
jsx = jsx.replace('playsinline', 'playsInline')
jsx = jsx.replace('fetchpriority', 'fetchPriority')
jsx = jsx.replace('<!--', '{/*').replace('-->', '*/}')
jsx = jsx.replace('targe="_blank"', 'target="_blank"') # visual check

# Replace inline styles
def style_replacer(match):
    style_content = match.group(1)
    props = [p.split(':', 1) for p in style_content.split(';') if ':' in p]
    js_props = []
    for k, v in props:
        k = k.strip()
        v = v.strip()
        # kebab to camel
        k_camel = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k)
        js_props.append(f"{k_camel}: '{v}'")
    return f"style={{{{{', '.join(js_props)}}}}}"

jsx = re.sub(r'style="([^"]*)"', style_replacer, jsx)

# Close self-closing tags
def close_tag(match):
    tag = match.group(0)
    if not tag.endswith('/>'):
        return tag[:-1] + ' />'
    return tag

jsx = re.sub(r'<(img|source|br|hr|input|link|meta)[^>]*>', close_tag, jsx)

# Remove onclick (we will handle via global listeners as per the script's style, or it's just broken for now)
# The script provided assumes some global functions or attaches listeners.
# We'll strip inline handlers to avoid JSX errors.
jsx = re.sub(r'onclick="[^"]*"', '', jsx)

page_content = f"""'use client';
import {{ useEffect }} from 'react';
import Script from 'next/script';

export default function Home() {{
  useEffect(() => {{
    // Helper to load AOS/Swiper if they are global
    const initScripts = () => {{
        {custom_js}
        
        // Fix for removed inline onclick
        const closeBtn = document.querySelector('.gallery-preview-close');
        if (closeBtn) {{
            closeBtn.addEventListener('click', closeGalleryPreview);
        }}
    }};
    
    // Slight delay to ensure external scripts are loaded
    const timer = setTimeout(initScripts, 500);
    return () => clearTimeout(timer);
  }}, []);

  return (
    <>
      <div className="box-layout">
        {jsx}
      </div>
    </>
  );
}}
"""

with open('app/page.js', 'w', encoding='utf-8') as f:
    f.write(page_content)

# 5. Generate app/layout.js
layout_content = """import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'IEEE PES Kerala Chapter - Power & Energy Society',
  description: 'IEEE Power and Energy Society Kerala Chapter - Advancing Technology for Humanity',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script src="https://unpkg.com/aos@2.3.1/dist/aos.js" strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
"""

with open('app/layout.js', 'w', encoding='utf-8') as f:
    f.write(layout_content)
