const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const adPagesDir = path.join(process.cwd(), 'app', 'admin', 'ad_pages');
const folders = [
    'ad_events', 'ad_announcements', 'ad_gallery', 'ad_execom', 'ad_chapters', 
    'ad_awards', 'ad_recognitions', 'ad_newsletters', 'ad_magazines'
];

folders.forEach(folder => {
    const folderPath = path.join(adPagesDir, folder);
    const pageJSPath = path.join(folderPath, 'page.js');
    const newJSPath = path.join(adPagesDir, `${folder}.js`);
    
    if (fs.existsSync(pageJSPath)) {
        try {
            execSync(`mv ${pageJSPath} ${newJSPath}`);
            console.log(`Moved ${folder}/page.js to ${folder}.js`);
            execSync(`rm -rf ${folderPath}`);
        } catch (e) {
            console.error(`Error processing ${folder}:`, e.message);
        }
    }
});

const slugDir = path.join(adPagesDir, '[slug]');
if (!fs.existsSync(slugDir)) fs.mkdirSync(slugDir);

const mapCode = folders.map(f => `  '${f}': dynamic(() => import('../${f}')),`).join('\n');

const dynamicPageCode = `'use client';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const pages = {
${mapCode}
};

export default function DynamicAdPage({ params }) {
    const Component = pages[params.slug];
    if (!Component) return notFound();
    return <Component />;
}
`;

fs.writeFileSync(path.join(slugDir, 'page.js'), dynamicPageCode);
console.log('Successfully structured sibling .js pages and generated dynamic Next.js route.');
