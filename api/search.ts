import { formatGeminiErrorMessage, runProductSearch } from '../lib/geminiSearch.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
    return;
  }

  const { query, location = 'Worldwide' } = req.body || {};

  if (!query || typeof query !== 'string' || query.trim() === '') {
    res.status(400).json({ success: false, error: 'Product search query is required.' });
    return;
  }

  try {
    const result = await runProductSearch(query, location);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error during product search:', error);
    res.status(500).json({
      success: false,
      error: formatGeminiErrorMessage(error),
    });
  }
}
