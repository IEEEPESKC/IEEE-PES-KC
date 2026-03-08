const fs = require('fs');
const path = require('path');

const publicPagesDir = path.join(process.cwd(), 'app', 'pages');
const items = fs.readdirSync(publicPagesDir).filter(name => {
    return fs.statSync(path.join(publicPagesDir, name)).isDirectory() && name !== '[slug]';
});

items.forEach(folder => {
    const pagePath = path.join(publicPagesDir, folder, 'page.js');
    if (fs.existsSync(pagePath)) {
        const destPath = path.join(publicPagesDir, folder + '.js');
        fs.renameSync(pagePath, destPath);
        fs.rmSync(path.join(publicPagesDir, folder), { recursive: true, force: true });
        console.log(`Flattened ${folder} and renamed to ${folder}.js`);
    }
});

// Create dynamic router for public pages
const routerDir = path.join(publicPagesDir, '[slug]');
if (!fs.existsSync(routerDir)) fs.mkdirSync(routerDir, { recursive: true });

const routerContent = `import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const pages = {
${items.map(name => `  '${name}': dynamic(() => import('../${name}')),`).join('\n')}
};

export default async function DynamicPublicPage({ params }) {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    const Component = pages[slug];
    if (!Component) return notFound();
    return <Component />;
}
`;

fs.writeFileSync(path.join(routerDir, 'page.js'), routerContent);
console.log('Created dynamic router for public pages.');
