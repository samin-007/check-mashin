/**
 * چک‌ماشین — سرویس API
 * اتصال اپ به بک‌اند FastAPI
 */

// آدرس بک‌اند — وقتی روی یه شبکه‌ای، IP لوکالت رو بذار
// برای تست روی گوشی، IP واقعی کامپیوترت رو بذار (نه localhost)
const BASE_URL = 'http://10.0.2.2:8000'; // Android Emulator
// const BASE_URL = 'http://192.168.1.X:8000'; // گوشی واقعی — IP خودت رو بذار

/**
 * درخواست GET
 */
async function get(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API GET Error [${endpoint}]:`, error.message);
    return null;
  }
}

/**
 * درخواست POST
 */
async function post(endpoint, body) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API POST Error [${endpoint}]:`, error.message);
    throw error;
  }
}

// ======= API بازار =======

export const MarketAPI = {
  /** شاخص کل بازار */
  getIndex: () => get('/api/market/index'),
  
  /** لیست خودروها */
  getCars: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return get(`/api/market/cars${query ? '?' + query : ''}`);
  },
  
  /** جزئیات یک خودرو */
  getCarDetail: (carId) => get(`/api/market/cars/${carId}`),
  
  /** تاریخچه قیمت */
  getPriceHistory: (carId, days = 30) => get(`/api/market/cars/${carId}/history?days=${days}`),
  
  /** فرصت‌های خرید */
  getOpportunities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return get(`/api/market/opportunities${query ? '?' + query : ''}`);
  },
  
  /** لیست برندها */
  getBrands: () => get('/api/market/brands'),
  
  /** مقایسه بازارها */
  getCompare: () => get('/api/market/compare'),
};

// ======= API چک آگهی =======

export const CheckAPI = {
  /** چک آگهی — لینک بده، نتیجه بگیر */
  analyze: (url) => post('/api/check/analyze', { url }),
  
  /** تاریخچه چک‌ها */
  getHistory: (limit = 10) => get(`/api/check/history?limit=${limit}`),
  
  /** گزارش آگهی مشکوک */
  report: (adId) => post(`/api/check/report/${adId}`, {}),
};

export default { MarketAPI, CheckAPI, BASE_URL };
