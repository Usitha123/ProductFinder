import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  formatGeminiErrorMessage,
  runProductSearch,
  runUrlInspection,
} from './lib/geminiSearch.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Search Endpoint
app.post('/api/search', async (req: Request, res: Response) => {
  const { query, location = 'Worldwide' } = req.body;

  if (!query || typeof query !== 'string' || query.trim() === '') {
    res.status(400).json({ success: false, error: 'Product search query is required.' });
    return;
  }

  try {
    const result = await runProductSearch(query, location);
    res.json(result);
  } catch (error: any) {
    console.error('Error during product search:', error);
    const friendlyMessage = formatGeminiErrorMessage(error);
    res.status(500).json({
      success: false,
      error: friendlyMessage,
    });
  }
});

// URL Context Inspection Endpoint
app.post('/api/inspect-url', async (req: Request, res: Response) => {
  const { url, productName } = req.body;

  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    res.status(400).json({ success: false, error: 'A valid http/https URL is required for inspection.' });
    return;
  }

  try {
    const result = await runUrlInspection(url, productName);
    res.json(result);
  } catch (error: any) {
    console.error('Error during URL inspection:', error);
    const friendlyMessage = formatGeminiErrorMessage(error);
    res.status(500).json({
      success: false,
      error: friendlyMessage,
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'ProductFinder API',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Start Express server and mount Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`ProductFinder server running at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
