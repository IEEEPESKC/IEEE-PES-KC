const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetFolders = [
    'about', 'announcements', 'membership-benefits', 'awards',
    'newsletters', 'contact', 'past-events', 'execom', 'past-execom',
    'gallery', 'resources', 'student-branches', 'history',
    'upcoming-events', 'initiatives', 'vision-mission'
];

const appDir = path.join(process.cwd(), 'app');
const pagesDir = path.join(appDir, 'pages');

// Create the new pages directory
if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
}

// Move folders to the new root
targetFolders.forEach(folder => {
    const oldPath = path.join(appDir, folder);
    const newPath = path.join(pagesDir, folder);
    
    if (fs.existsSync(oldPath)) {
        // Move directory
        try {
            execSync(`mv ${oldPath} ${newPath}`);
            console.log(`Moved ${folder} to pages/${folder}`);
        } catch (e) {
            console.error(`Failed to move ${folder}:`, e.message);
        }
    }
});
