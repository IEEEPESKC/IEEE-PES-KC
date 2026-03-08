const fs = require('fs');
const path = require('path');

const adminPagesDir = path.join(process.cwd(), 'app', 'admin', 'ad_pages');
const filesToUpdate = ['ad_events.js', 'ad_gallery.js', 'ad_awards.js', 'ad_recognitions.js'];

filesToUpdate.forEach(file => {
    const filePath = path.join(adminPagesDir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Search for <input type="file"... and blindly add "multiple" if it's missing
    content = content.replace(/<input type="file"([^>]+)>/g, (match, attrs) => {
        if (!attrs.includes('multiple')) {
            return `<input type="file"${attrs} multiple>`;
        }
        return match;
    });

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file} to definitely allow multiple image uploads.`);
});
