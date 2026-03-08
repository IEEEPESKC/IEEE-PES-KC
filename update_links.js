const fs = require('fs');
const path = require('path');

const targetPaths = [
    'about', 'announcements', 'membership-benefits', 'awards',
    'newsletters', 'contact', 'past-events', 'execom', 'past-execom',
    'gallery', 'resources', 'student-branches', 'history',
    'upcoming-events', 'initiatives', 'vision-mission'
];

function recursivelyUpdateFiles(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            // skip node_modules, .next, etc. just in case
            if (!['node_modules', '.next', '.git'].includes(file)) {
                recursivelyUpdateFiles(filePath);
            }
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let originalContent = content;

            // Loop through our list of paths and update link references
            for (const t of targetPaths) {
                // Look for "/target" or '/target' or `/target` exact matches, and add /pages prefix
                // e.g. href="/about" -> href="/pages/about"
                const regexes = [
                    new RegExp(`href=["'\`]/${t}["'\`]`, 'g'),
                    new RegExp(`path: ["'\`]/${t}["'\`]`, 'g'),
                    new RegExp(`href=\\{["'\`]/${t}["'\`]\\}`, 'g')
                ];

                regexes[0] = new RegExp(`(["'\`])\\/${t}\\1`, 'g'); // matches "/about", '/about', `/about`

                content = content.replace(regexes[0], `$1/pages/${t}$1`);

                // Also match paths with trailing slashes, e.g., "/about/"
                const trailingSlashRegex = new RegExp(`(["'\`])\\/${t}\\/\\1`, 'g');
                content = content.replace(trailingSlashRegex, `$1/pages/${t}/$1`);
            }

            if (content !== originalContent) {
                fs.writeFileSync(filePath, content);
                console.log(`Updated paths in ${filePath}`);
            }
        }
    }
}

const dirsToSearch = [
    path.join(process.cwd(), 'app'),
    path.join(process.cwd(), 'components'),
];

dirsToSearch.forEach(dir => {
    if (fs.existsSync(dir)) {
        recursivelyUpdateFiles(dir);
    }
});

console.log('Finished updating URL references.');
