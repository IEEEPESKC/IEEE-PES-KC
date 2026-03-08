const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'events', var: 'events' },
  { name: 'announcements', var: 'items' },
  { name: 'gallery', var: 'images' },
  { name: 'execom', var: 'members' },
  { name: 'chapters', var: 'chapters' },
  { name: 'awards', var: 'awards' },
  { name: 'recognitions', var: 'recognitions' },
  { name: 'newsletters', var: 'lists' },
  { name: 'magazines', var: 'lists' }
];

for (const p of pages) {
    const filePath = path.join(process.cwd(), 'app', 'admin', p.name, 'page.js');
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');

    // Inside the render method: adjust handleDelete(index) to handleDelete(index, ITEM.id)
    // Find the item variable inside the map
    const mapRegex = new RegExp(\`{\${p.var}\\\\.map\\\\(\\\\((\\w+), index\\\\) =>\`);
    const match = content.match(mapRegex);
    if (match && match[1]) {
        const itemVar = match[1];
        content = content.replace(/onClick=\{\(\) => handleDelete\(index\)\}/g, \`onClick={() => handleDelete(index, \${itemVar}?.id)}\`);
        fs.writeFileSync(filePath, content);
    }
}
console.log('Fixed handleDelete params across all 9 pages.');
