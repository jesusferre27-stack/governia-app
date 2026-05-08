const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const tokenMatch = env.match(/APIFY_API_TOKEN="(.*)"/);
if(tokenMatch) {
    const token = tokenMatch[1];
    fetch('https://api.apify.com/v2/acts/apify~facebook-pages-scraper/run-sync-get-dataset-items?token=' + token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startUrls: [{ url: 'https://www.facebook.com/GobiernoDeMexico' }], resultsLimit: 1 })
    }).then(r => r.text()).then(console.log).catch(console.error);
} else {
    console.log('No token');
}
