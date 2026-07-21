// scripts/fetch-youtube.js
// Fetches latest YouTube videos using server-side API key and writes js/videos.json
// Usage: set env YT_API_KEY and YT_CHANNEL_ID, then run `node scripts/fetch-youtube.js`

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.YT_API_KEY;
const CHANNEL_ID = process.env.YT_CHANNEL_ID;
const MAX_RESULTS = process.env.MAX_RESULTS || 5;

if (!API_KEY || !CHANNEL_ID) {
  console.error('Missing YT_API_KEY or YT_CHANNEL_ID environment variables.');
  process.exit(1);
}

(async () => {
  try {
    const params = new URLSearchParams({
      key: API_KEY,
      channelId: CHANNEL_ID,
      part: 'snippet',
      order: 'date',
      maxResults: String(MAX_RESULTS),
      type: 'video',
    });

    const url = `https://www.googleapis.com/youtube/v3/search?${params}`;
    console.log('Fetching', url);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`YouTube API returned ${res.status}`);

    const data = await res.json();
    const items = (data.items || []).map((it) => ({
      videoId: it.id?.videoId,
      title: it.snippet?.title,
      thumbnail: it.snippet?.thumbnails?.medium?.url || it.snippet?.thumbnails?.default?.url,
      publishedAt: it.snippet?.publishedAt,
    })).filter((item) => item.videoId);

    const outPath = path.join(__dirname, '..', 'data', 'videos.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify({ items }, null, 2), 'utf8');
    console.log('Wrote', outPath);
  } catch (err) {
    console.error('Error fetching YouTube:', err);
    process.exit(1);
  }
})();
