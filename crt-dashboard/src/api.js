// Change this to match your live Render backend URL!
const BASE_URL = 'https://crt-screener-backend-1.onrender.com'; 

export const fetchDojiScan = async (timeframe) => {
  try {
    const response = await fetch(`${BASE_URL}/scan?timeframe=${timeframe}`);
    if (!response.ok) throw new Error('Network response failure');
    const data = await response.json();
    return { ok: true, results: data.results || [] };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

export const fetchStockQuote = async (symbol) => {
  try {
    const response = await fetch(`${BASE_URL}/quote/${symbol.toUpperCase()}`);
    if (!response.ok) throw new Error('Symbol not found');
    const data = await response.json();
    return { ok: true, quotes: [data] };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

export const fetchAIAnalysis = async (symbol) => {
  try {
    const response = await fetch(`${BASE_URL}/analyze/${symbol.toUpperCase()}`);
    if (!response.ok) throw new Error('Analysis failed');
    const data = await response.json();
    return { ok: true, analysisData: data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};