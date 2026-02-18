const API_URL = 'https://api.coingecko.com/api/v3';
const CACHE_KEY_PRICE = 'bitcalc_price_cache';
const CACHE_DURATION = 30 * 1000; // 30 seconds

export const getBitcoinPrice = async () => {
    try {
        // Check cache
        const cached = localStorage.getItem(CACHE_KEY_PRICE);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
        }

        const response = await fetch(`${API_URL}/simple/price?ids=bitcoin&vs_currencies=brl,usd,eur&include_24hr_change=true`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const result = data.bitcoin;

        // Save to cache
        localStorage.setItem(CACHE_KEY_PRICE, JSON.stringify({
            data: result,
            timestamp: Date.now()
        }));

        return result;
    } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        // Return cached data if available (even if expired) as fallback
        const cached = localStorage.getItem(CACHE_KEY_PRICE);
        if (cached) {
            return JSON.parse(cached).data;
        }
        throw error;
    }
};

export const getMarketChart = async (currency = 'brl', days = '1') => {
    try {
        const response = await fetch(`${API_URL}/coins/bitcoin/market_chart?vs_currency=${currency}&days=${days}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.prices;
    } catch (error) {
        console.error('Error fetching market chart:', error);
        return [];
    }
};
