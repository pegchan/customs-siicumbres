/**
 * Hook personalizado para cargar el catálogo desde el backend
 * Maneja loading states, errores y retry logic
 */

import { useState, useEffect, useCallback } from 'react';
import { catalogAPI } from '../services/catalogAPI';
import type { BackendFullCatalog } from '../services/catalogAPI';

export interface CatalogLoadingState {
  catalog: BackendFullCatalog | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
  clearCache: () => void;
}

export function useCatalogLoader(): CatalogLoadingState {
  const [catalog, setCatalog] = useState<BackendFullCatalog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadCatalog = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[useCatalogLoader] Loading catalog from API...');

      const data = await catalogAPI.getFullCatalog();

      setCatalog(data);
      console.log('[useCatalogLoader] Catalog loaded successfully');

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      console.error('[useCatalogLoader] Error loading catalog:', error);
      setError(error);
      setCatalog(null);
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  // Cargar catálogo al montar el componente
  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  // Función para reintentar la carga
  const retry = useCallback(() => {
    console.log('[useCatalogLoader] Retrying catalog load...');
    setRetryCount((prev) => prev + 1);
  }, []);

  // Función para limpiar cache y recargar
  const clearCache = useCallback(() => {
    console.log('[useCatalogLoader] Clearing cache and reloading...');
    catalogAPI.clearCache();
    setRetryCount((prev) => prev + 1);
  }, []);

  return {
    catalog,
    loading,
    error,
    retry,
    clearCache,
  };
}
