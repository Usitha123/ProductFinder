import { LocationOption, SearchResponse, UrlInspectionResult } from '../types';

/**
 * Client-side service to communicate with the application's server-side
 * Gemini API routes (/api/search and /api/inspect-url).
 */

export async function searchProducts(
  query: string,
  location: LocationOption = 'Worldwide'
): Promise<SearchResponse> {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    throw new Error('Please enter a product name to search.');
  }

  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: cleanQuery,
      location,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.error || 'Failed to retrieve products from the server-side search engine.'
    );
  }

  return data as SearchResponse;
}

export async function inspectProductUrl(
  url: string,
  productName?: string
): Promise<UrlInspectionResult> {
  if (!url || !url.startsWith('http')) {
    throw new Error('A valid web URL is required for inspection.');
  }

  const response = await fetch('/api/inspect-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      productName,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Unable to inspect supplier product page.');
  }

  return data.inspection as UrlInspectionResult;
}
