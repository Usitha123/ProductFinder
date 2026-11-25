import { GoogleGenAI, ThinkingLevel } from '@google/genai';

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: string;
  numericPrice: number | null;
  currency: string;
  priceUnit: string;
  availableQuantity: string;
  minOrderQuantity: string;
  brand: string;
  material: string;
  capacityOrSize: string;
  supplierName: string;
  supplierCountry: string;
  specifications: Record<string, string>;
  sourceWebsite: string;
  sourceUrl: string;
  imageUrl: string | null;
  lastCheckedDate: string;
  priceStatus: 'verified' | 'not_found' | 'confirmation_required' | 'cached_or_outdated';
  accessNotes?: string;
}

export function formatGeminiErrorMessage(err: any): string {
  const msg = err?.message || String(err);
  if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429')) {
    return 'Gemini API quota or rate limit exceeded (429). Your current API key has reached its Google Search grounding or request quota. Please wait a moment and click Retry, or update your GEMINI_API_KEY with a billing-enabled key in Settings > Secrets (or Vercel Environment Variables).';
  }
  if (msg.includes('503') || msg.includes('UNAVAILABLE')) {
    return 'The Gemini service is temporarily experiencing high demand (503). Please wait a few seconds and click Retry.';
  }
  if (msg.includes('PERMISSION_DENIED') || msg.includes('403')) {
    return 'Gemini API permission denied (403). Please verify your GEMINI_API_KEY in Settings > Secrets.';
  }
  if (msg.includes('API_KEY_INVALID') || msg.includes('INVALID_ARGUMENT')) {
    return 'Invalid Gemini API key or request parameters. Please verify your GEMINI_API_KEY configuration.';
  }
  try {
    const parsed = JSON.parse(msg);
    if (parsed?.error?.message) {
      return parsed.error.message;
    }
  } catch {
    // ignore
  }
  return msg;
}

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractJsonFromText(rawText: string): any {
  if (!rawText) return null;

  const codeBlockMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const targetStr = codeBlockMatch ? codeBlockMatch[1].trim() : rawText.trim();

  try {
    return JSON.parse(targetStr);
  } catch {
    const firstBrace = targetStr.indexOf('{');
    const lastBrace = targetStr.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const sliced = targetStr.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(sliced);
      } catch (e) {
        console.error('Failed to parse sliced JSON:', e);
      }
    }
    throw new Error('Could not parse valid JSON from search response.');
  }
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const msg = err?.message || String(err);
      const isTransient =
        msg.includes('503') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('429') ||
        msg.includes('RESOURCE_EXHAUSTED');

      if (!isTransient || attempt === maxRetries) {
        throw err;
      }

      const delayMs = 1000 * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

export async function runProductSearch(query: string, location = 'Worldwide') {
  const cleanQuery = query.trim();
  const validLocation = ['Sri Lanka', 'International', 'Worldwide'].includes(location)
    ? location
    : 'Worldwide';

  const ai = getAiClient();
  const currentDate = new Date().toISOString().split('T')[0];

  const locationContext =
    validLocation === 'Sri Lanka'
      ? 'Location target: Sri Lanka. Strongly prioritize products, suppliers, manufacturers, importers, distributors, and retailers located in Sri Lanka (e.g. .lk domains, local factory suppliers, industrial suppliers in Sri Lanka, local e-commerce/wholesale portals like Daraz.lk, Singer, Kapruka, direct suppliers). Currency is typically LKR or USD.'
      : validLocation === 'International'
      ? 'Location target: International (suppliers outside Sri Lanka). Focus on global suppliers, manufacturers, export-oriented directories, regional industrial hubs, Alibaba, Made-in-China, Global Sources, Amazon Global, European, American, or Asian manufacturers.'
      : 'Location target: Worldwide. Search across all international and local markets, suppliers, manufacturers, and trade platforms globally.';

  const prompt = `You are the discovery engine for ProductFinder, an internet-based product search engine.
Search the live internet using Google Search to discover ACTUAL, REAL products from real supplier websites.

Product search term: "${cleanQuery}"
${locationContext}

CRITICAL RULES:
1. Search for actual, real products from real supplier/distributor/manufacturer websites right now.
2. DO NOT invent or fabricate products, fake prices, fake company names, or fake URLs.
3. Every product MUST correspond to a real supplier or product listing found through Google Search.
4. If an attribute cannot be found, strictly use "Not available".
5. For prices:
   - If a specific price is published, state it clearly (e.g., "$12.50", "LKR 4,500"), set currency (e.g., "USD", "LKR"), extract numericPrice as a number, and set priceStatus to "verified".
   - If the supplier requires inquiry/contact for a quote, set price to "Not available", numericPrice to null, and priceStatus to "confirmation_required".
   - If no price is displayed, set price to "Not available", numericPrice to null, and priceStatus to "not_found".
   - If price appears outdated or an approximate catalog estimate, set priceStatus to "cached_or_outdated".
6. Do not fabricate URLs. Provide the actual link from the search results.
7. Return between 6 and 15 distinct matching products if available.

Respond with ONLY a JSON object formatted in a \`\`\`json code block with this structure:
{
  "summary": "1-2 sentence factual summary of what products and suppliers were found on the web for '${cleanQuery}'.",
  "products": [
    {
      "id": "prod-1",
      "name": "Full product name as displayed on source",
      "description": "Clear description of product characteristics and usage",
      "price": "$12.50" or "LKR 4,500" or "Not available",
      "numericPrice": 12.50 or null,
      "currency": "USD" or "LKR" or "EUR" or "Not available",
      "priceUnit": "per piece" or "per unit" or "per 1,000 pcs" or "per pack" or "Not available",
      "availableQuantity": "Published stock status or Not available",
      "minOrderQuantity": "Minimum order quantity or Not available",
      "brand": "Brand or Not available",
      "material": "Material or Not available",
      "capacityOrSize": "Capacity or size or Not available",
      "supplierName": "Exact supplier or manufacturer name",
      "supplierCountry": "Supplier country (e.g. Sri Lanka, China, USA, India)",
      "specifications": {
        "Specification Title": "Value"
      },
      "sourceWebsite": "domain.com",
      "sourceUrl": "https://full-url-from-search",
      "imageUrl": "Direct image URL if present in source snippet, or null",
      "lastCheckedDate": "${currentDate}",
      "priceStatus": "verified" | "not_found" | "confirmation_required" | "cached_or_outdated",
      "accessNotes": "Short note on supplier access or contact requirements if applicable"
    }
  ]
}`;

  const response = await withRetry(() =>
    ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    })
  );

  const rawText = response.text || '';
  let parsedData: any = null;

  try {
    parsedData = extractJsonFromText(rawText);
  } catch (parseError) {
    console.warn('JSON parsing failed from rawText, attempting recovery:', parseError);
  }

  const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const groundingSources = rawChunks
    .filter((c: any) => c.web?.uri)
    .map((c: any) => ({
      title: c.web?.title || 'Web Source',
      uri: c.web?.uri || '',
    }));

  const webSearchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];
  const products: ProductItem[] = [];

  if (parsedData && Array.isArray(parsedData.products)) {
    parsedData.products.forEach((item: any, index: number) => {
      let sourceUrl = item.sourceUrl || '';
      if (!sourceUrl || !sourceUrl.startsWith('http')) {
        if (groundingSources.length > 0) {
          const matched = groundingSources.find(
            (s: any) =>
              item.sourceWebsite &&
              s.uri.toLowerCase().includes(item.sourceWebsite.toLowerCase().replace(/^www\./, ''))
          );
          sourceUrl = matched ? matched.uri : groundingSources[index % groundingSources.length].uri;
        }
      }

      let sourceWebsite = item.sourceWebsite || 'Supplier Website';
      try {
        if (sourceUrl && sourceUrl.startsWith('http')) {
          const parsedUrl = new URL(sourceUrl);
          sourceWebsite = parsedUrl.hostname.replace(/^www\./, '');
        }
      } catch {
        // ignore
      }

      const validStatuses = ['verified', 'not_found', 'confirmation_required', 'cached_or_outdated'];
      const priceStatus = validStatuses.includes(item.priceStatus)
        ? item.priceStatus
        : item.price && item.price !== 'Not available'
        ? 'verified'
        : 'confirmation_required';

      products.push({
        id: item.id || `prod-${index + 1}-${Date.now()}`,
        name: item.name || 'Unnamed Product',
        description: item.description || 'No description available from source listing.',
        price: item.price || 'Not available',
        numericPrice:
          typeof item.numericPrice === 'number' && !isNaN(item.numericPrice)
            ? item.numericPrice
            : null,
        currency: item.currency || 'Not available',
        priceUnit: item.priceUnit || 'Not available',
        availableQuantity: item.availableQuantity || 'Not available',
        minOrderQuantity: item.minOrderQuantity || 'Not available',
        brand: item.brand || 'Not available',
        material: item.material || 'Not available',
        capacityOrSize: item.capacityOrSize || 'Not available',
        supplierName: item.supplierName || 'Unknown Supplier',
        supplierCountry:
          item.supplierCountry || (validLocation === 'Sri Lanka' ? 'Sri Lanka' : 'International'),
        specifications:
          typeof item.specifications === 'object' && item.specifications !== null
            ? item.specifications
            : {},
        sourceWebsite,
        sourceUrl,
        imageUrl: item.imageUrl && item.imageUrl.startsWith('http') ? item.imageUrl : null,
        lastCheckedDate: item.lastCheckedDate || currentDate,
        priceStatus,
        accessNotes: item.accessNotes || undefined,
      });
    });
  }

  return {
    success: true,
    query: cleanQuery,
    location: validLocation,
    summary:
      parsedData?.summary || `Found ${products.length} live product results for "${cleanQuery}".`,
    products,
    groundingSources,
    webSearchQueries,
  };
}

export async function runUrlInspection(url: string, productName?: string) {
  const ai = getAiClient();

  const prompt = `Use the URL Context tool to inspect the webpage at: ${url}
Target product: ${productName || 'product on this page'}

Tasks:
1. Inspect the accessible content of this supplier product page.
2. Check if the page is directly accessible or if access is blocked (e.g., CAPTCHA, 403, Cloudflare, login required).
3. Extract verified pricing, current stock availability, MOQ, detailed technical specs, supplier verification data, and contact methods.
4. If the page is blocked or requires manual verification, describe the accessible status truthfully.

Format your output as a single JSON object in a \`\`\`json code block:
{
  "accessStatus": "accessible" | "restricted_or_login_required" | "unavailable",
  "pageTitle": "Title of page",
  "verifiedPrice": "Exact price or Not available",
  "stockStatus": "Current stock availability or Not available",
  "minOrderQuantity": "MOQ or Not available",
  "specifications": {
    "key": "value"
  },
  "supplierNotes": "Observations about supplier verification, shipping, or inquiry requirements",
  "inspectionDate": "${new Date().toISOString().split('T')[0]}"
}`;

  const response = await withRetry(() =>
    ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ urlContext: {} }],
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    })
  );

  const rawText = response.text || '';
  let inspectionData: any = null;

  try {
    inspectionData = extractJsonFromText(rawText);
  } catch {
    inspectionData = {
      accessStatus: 'accessible',
      pageTitle: productName || 'Supplier Product Page',
      verifiedPrice: 'See original supplier page',
      stockStatus: 'Published on supplier site',
      minOrderQuantity: 'Published on supplier site',
      specifications: {},
      supplierNotes: rawText.slice(0, 300),
      inspectionDate: new Date().toISOString().split('T')[0],
    };
  }

  return {
    success: true,
    url,
    inspection: inspectionData,
  };
}
