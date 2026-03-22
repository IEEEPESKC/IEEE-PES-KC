import fs from 'fs';
import path from 'path';

// Ensure app directory exists
if (!fs.existsSync('app')) {
  fs.mkdirSync('app');
}

// Read index.html
const content = fs.readFileSync('public/index.html', 'utf-8');

// 1. Extract CSS
const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
const cssContent = styleMatch ? styleMatch[1] : '';
fs.writeFileSync('app/globals.css', cssContent, 'utf-8');

// 2. Extract Body Content
let bodyMatch = content.match(/<body>([\s\S]*?)<script src/);
if (!bodyMatch) {
    console.log('Could not find body content properly.');
    bodyMatch = content.match(/<body>([\s\S]*?)<script>/);
}
const htmlBody = bodyMatch ? bodyMatch[1] : '';

// 3. Extract Inline Script
const scripts = [...content.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const customJs = scripts.length > 0 ? scripts[scripts.length - 1][1] : '';

// 4. Generate app/page.js
let jsx = htmlBody
    .replace(/class=/g, 'className=')
    .replace(/autoplay/g, 'autoPlay')
    .replace(/muted/g, 'muted')
    .replace(/loop/g, 'loop')
    .replace(/playsinline/g, 'playsInline')
    .replace(/fetchpriority/g, 'fetchPriority')
    .replace(/<!--/g, '{/*')
    .replace(/-->/g, '*/}')
    .replace(/targe="_blank"/g, 'target="_blank"');

// Replace inline styles
jsx = jsx.replace(/style="([^"]*)"/g, (match, styleContent) => {
    const props = styleContent.split(';').filter(p => p.includes(':')).map(p => p.split(/:\s*/));
    const jsProps = props.map(([k, v]) => {
        const camelKey = k.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        return `${camelKey}: '${v ? v.trim().replace(/'/g, "\\'") : ''}'`;
    });
    return `style={{${jsProps.join(', ')}}}`;
});

// Close self-closing tags
jsx = jsx.replace(/<(img|source|br|hr|input|link|meta)([^>]*)>/g, (match, tag, attrs) => {
    if (!attrs.endsWith('/')) {
        return `<${tag}${attrs} />`;
    }
    return match;
});

// Remove onclick attributes
jsx = jsx.replace(/onclick="[^"]*"/g, '');

const pageContent = `'use client';
import { useEffect } from 'react';
import Script from 'next/script';

export default function Home() {
  useEffect(() => {
    const initScripts = () => {
        ${customJs}
        
        const closeBtn = document.querySelector('.gallery-preview-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeGalleryPreview);
        }
    };
    
    const timer = setTimeout(initScripts, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="box-layout">
        {jsx}
      </div>
    </>
  );
}
`;

fs.writeFileSync('app/page.js', pageContent, 'utf-8');

// 5. Generate app/layout.js
const layoutContent = `import './globals.css';
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
`;

fs.writeFileSync('app/layout.js', layoutContent, 'utf-8');
console.log('Conversion sequence completed successfully.');
