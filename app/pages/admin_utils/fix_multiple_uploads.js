const fs = require('fs');
const path = require('path');

const adminPagesDir = path.join(process.cwd(), 'app', 'admin', 'ad_pages');
const filesToUpdate = ['ad_events.js', 'ad_gallery.js', 'ad_awards.js', 'ad_recognitions.js'];

filesToUpdate.forEach(file => {
    const filePath = path.join(adminPagesDir, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Change input file to accept multiple
    content = content.replace(/<input type="file" name="image"/g, '<input type="file" name="image" multiple');
    content = content.replace(/<input type="file" name="image" multiple id="[/a-zA-Z-]*"/g, (match) => match + ' multiple');
    if(file === 'ad_awards.js' || file === 'ad_gallery.js' || file === 'ad_recognitions.js') {
         content = content.replace(/<input type="file" name="image" id=".*?className=".*?accept="image\/\*" \/>/, (match) => {
             if (!match.includes('multiple')) return match.replace('accept="image/*"', 'accept="image/*" multiple');
             return match;
         });
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file} to allow multiple image uploads.`);
});
