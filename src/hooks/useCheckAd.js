/**
 * Hook چک آگهی — ارسال لینک و دریافت نتیجه
 */

import { useState, useCallback } from 'react';
import { CheckAPI } from '../services/api';

export function useCheckAd() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkAd = useCallback(async (url) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await CheckAPI.analyze(url);
      setResult(data);
      return data;
    } catch (e) {
      setError(e.message || 'خطا در بررسی آگهی');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { result, loading, error, checkAd, reset };
}
