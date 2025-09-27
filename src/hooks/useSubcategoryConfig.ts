import { useState, useEffect, useCallback } from 'react';
import type { SubcategoryConfig } from '../types';
import { subcategoryConfigService } from '../services/subcategoryConfigService';

interface UseSubcategoryConfigReturn {
  config: SubcategoryConfig | null;
  loading: boolean;
  error: string | null;
  isSubcategoryOptional: (subcategory: string) => boolean;
  getDisplayName: (subcategory: string) => string;
  refreshConfig: () => Promise<void>;
  lastFetched: string | null;
}

export function useSubcategoryConfig(): UseSubcategoryConfigReturn {
  const [config, setConfig] = useState<SubcategoryConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedConfig = await subcategoryConfigService.getConfig();
      setConfig(fetchedConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const refreshedConfig = await subcategoryConfigService.refreshConfig();
      setConfig(refreshedConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error refreshing configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  const isSubcategoryOptional = useCallback((subcategory: string): boolean => {
    if (!config) return false;
    return config[subcategory]?.isOptional ?? false;
  }, [config]);

  const getDisplayName = useCallback((subcategory: string): string => {
    if (!config) return subcategory;
    return config[subcategory]?.displayName ?? subcategory;
  }, [config]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    config,
    loading,
    error,
    isSubcategoryOptional,
    getDisplayName,
    refreshConfig,
    lastFetched: subcategoryConfigService.getLastFetched(),
  };
}