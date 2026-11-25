import { formatGeminiErrorMessage, runUrlInspection } from '../lib/geminiSearch.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
    return;
  }

  const { url, productName } = req.body || {};

  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    res.status(400).json({
      success: false,
      error: 'A valid http/https URL is required for inspection.',
    });
    return;
  }

  try {
    const result = await runUrlInspection(url, productName);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error during URL inspection:', error);
    res.status(500).json({
      success: false,
      error: formatGeminiErrorMessage(error),
    });
  }
}
