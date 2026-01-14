export default async function handler(req, res) {
  // 1. Get the "endpoint" the frontend is asking for (e.g., "/search/multi?query=avengers")
  const { endpoint } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: "Endpoint required" });
  }

  // 2. Get the Secret Key from Vercel's Environment Variables
  const TMDB_KEY = process.env.TMDB_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  // 3. Construct the real URL (Backend side)
  // We check if the endpoint already has '?' to decide whether to use '&' or '?'
  const joiner = endpoint.includes('?') ? '&' : '?';
  const targetUrl = `${BASE_URL}${endpoint}${joiner}api_key=${TMDB_KEY}`;

  try {
    // 4. Fetch from TMDB
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      throw new Error(`TMDB Error: ${response.status}`);
    }

    const data = await response.json();

    // 5. Send data back to your frontend
    // Cache-Control makes it fast (caches results for 1 hour)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch data" });
  }
}