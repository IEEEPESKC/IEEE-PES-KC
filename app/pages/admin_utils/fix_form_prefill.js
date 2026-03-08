const fs = require('fs');
const path = require('path');

const adminPagesDir = path.join(process.cwd(), 'app', 'admin', 'ad_pages');
const files = fs.readdirSync(adminPagesDir).filter(f => f.startsWith('ad_') && f.endsWith('.js'));

files.forEach(file => {
    const filePath = path.join(adminPagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Add defaultValue to all input/select/textarea based on selectedItem
    // Pattern: <input ... name="XYZ" ... /> -> <input ... name="XYZ" defaultValue={selectedItem?.XYZ || ''} ... />
    
    // 1. Text/Email/Date inputs
    content = content.replace(/<(input|select|textarea)([^>]+)name="([^"]+)"([^>]*)/g, (match, tag, before, name, after) => {
        if (tag === 'input' && before.includes('type="file"')) return match; // Files don't get default values
        if (match.includes('defaultValue=')) return match; // Already fixed or handled
        
        return `<${tag}${before}name="${name}" defaultValue={selectedItem?.${name} || ''}${after}`;
    });

    fs.writeFileSync(filePath, content);
    console.log(`Fixed prefill for: ${file}`);
});
