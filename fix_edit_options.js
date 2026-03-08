const fs = require('fs');
const path = require('path');

const adminPagesDir = path.join(process.cwd(), 'app', 'admin', 'ad_pages');
const pagesConfig = [
    { name: 'ad_events', var: 'events', formTitle: 'Event' },
    { name: 'ad_announcements', var: 'items', formTitle: 'Announcement' },
    { name: 'ad_gallery', var: 'images', formTitle: 'Image' },
    { name: 'ad_execom', var: 'members', formTitle: 'Member' },
    { name: 'ad_chapters', var: 'chapters', formTitle: 'Chapter' },
    { name: 'ad_awards', var: 'awards', formTitle: 'Award' },
    { name: 'ad_recognitions', var: 'recognitions', formTitle: 'Recognition' },
    { name: 'ad_newsletters', var: 'lists', formTitle: 'Newsletter' },
    { name: 'ad_magazines', var: 'lists', formTitle: 'Magazine' }
];

pagesConfig.forEach(p => {
    const filePath = path.join(adminPagesDir, p.name + '.js');
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');

    // Add selectedItem state
    if (!content.includes('const [selectedItem, setSelectedItem] = useState(null)')) {
        content = content.replace(
            /const \[isModalOpen, setIsModalOpen\] = useState\(false\);/,
            `const [isModalOpen, setIsModalOpen] = useState(false);\n    const [selectedItem, setSelectedItem] = useState(null);`
        );
    }
    
    // Modify "Add <Item>" click handler to clear selected item
    content = content.replace(
        /<button className="admin-btn-primary" onClick=\{\(\) => setIsModalOpen\(true\)\}>/g,
        `<button className="admin-btn-primary" onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}>`
    );
    
    const capVarResult = 'set' + p.var.charAt(0).toUpperCase() + p.var.slice(1);
    const typeVar = p.name.replace('ad_', '');
    
    // Modify HandleSubmit to handle PUT/Editing gracefully
    const submitRegex = /const handleSubmit = async \(e\) => {[\s\S]*?e\.target\.reset\(\);\n\s*}\n\s*} catch \((error|err)\) {[\s\S]*?}\n\s*};/;
    
    const newSubmit = `const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('type', '${typeVar}');
        if (selectedItem) formData.append('editId', selectedItem.id);

        try {
            const res = await fetch('/api/admin', {
                method: selectedItem ? 'PUT' : 'POST',
                body: formData
            });
            if (res.ok) {
                const { item } = await res.json();
                if (selectedItem) {
                    ${capVarResult}(${p.var}.map(i => i.id === selectedItem.id ? item : i));
                } else {
                    ${capVarResult}([item, ...${p.var}]);
                }
                setSelectedItem(null);
                setIsModalOpen(false);
                e.target.reset();
            }
        } catch (error) {
            console.error("Error submitting:", error);
        }
    };`;
    
    if (content.match(submitRegex)) {
         content = content.replace(submitRegex, newSubmit);
    }

    // Modify Map loop to include Edit click handler
    // e.g. <button className="admin-btn-text">Edit</button> => <button ... onClick={() => { setSelectedItem(event); setIsModalOpen(true); }}>Edit</button>
    const mapRegex = new RegExp(`{${p.var}\\.map\\(\\((.*?)\\s*,\\s*index\\)\\s*=>`);
    const iterMatch = mapRegex.exec(content);
    if (iterMatch && iterMatch[1]) {
        const itemVar = iterMatch[1];
        content = content.replace(
            /<button className="admin-btn-text">Edit<\/button>/g,
            `<button className="admin-btn-text" onClick={() => { setSelectedItem(${itemVar}); setIsModalOpen(true); }}>Edit</button>`
        );
    }
    
    // Modify Header to say "Edit" or "Add New"
    content = content.replace(
        new RegExp(`<h2>Add New ${p.formTitle}</h2>`), 
        `<h2>{selectedItem ? 'Edit ${p.formTitle}' : 'Add New ${p.formTitle}'}</h2>`
    );
    
    // Attempt dynamically populate fields! This is complex via generic script, so simply use defaultValue or key down trick
    // To make this easily work in React generic way, we need to pass a key to the form to force remount
    if (content.match(/<form onSubmit={handleSubmit} className="admin-sidepanel-body">/)) {
        content = content.replace(
          /<form onSubmit={handleSubmit} className="admin-sidepanel-body">/,
          `<form key={selectedItem ? selectedItem.id : 'new'} onSubmit={handleSubmit} className="admin-sidepanel-body">`
        );
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated Edit functionality for: ${p.name}`);
});
