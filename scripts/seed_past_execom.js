const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../app/admin/data.json');

const pastExecoms = [
    { name: 'TBD', role: 'Chair', year: '2023 - 2024', status: 'past', category: 'professionals', id: 'past_2324_1' },
    { name: 'TBD', role: 'Secretary', year: '2023 - 2024', status: 'past', category: 'professionals', id: 'past_2324_2' },
    { name: 'TBD', role: 'Treasurer', year: '2023 - 2024', status: 'past', category: 'professionals', id: 'past_2324_3' },

    { name: 'TBD', role: 'Chair', year: '2021 - 2022', status: 'past', category: 'professionals', id: 'past_2122_1' },
    { name: 'TBD', role: 'Secretary', year: '2021 - 2022', status: 'past', category: 'professionals', id: 'past_2122_2' },
    { name: 'TBD', role: 'Treasurer', year: '2021 - 2022', status: 'past', category: 'professionals', id: 'past_2122_3' }
];

try {
    const rawData = fs.readFileSync(dataFile, 'utf-8');
    const db = JSON.parse(rawData);

    if (!db.execom) db.execom = [];

    db.execom.push(...pastExecoms);

    fs.writeFileSync(dataFile, JSON.stringify(db, null, 2));
    console.log("Successfully seeded past execom data.");
} catch (e) {
    console.error("Error seeding data:", e);
}
