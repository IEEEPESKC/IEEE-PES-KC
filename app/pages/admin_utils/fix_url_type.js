const fs = require('fs');
const path = require('path');

const adminPagesDir = path.join(process.cwd(), 'app', 'admin', 'ad_pages');
const filesToUpdate = [
    'ad_magazines.js',
    'ad_newsletters.js',
    'ad_execom.js',
    'ad_announcements.js',
    'ad_events.js'
];

filesToUpdate.forEach(file => {
    const filePath = path.join(adminPagesDir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Change type="url" to type="text"
    content = content.replace(/type="url"/g, 'type="text"');

    fs.writeFileSync(filePath, content);
    console.log(`Updated URL field type in ${file}.`);
});
