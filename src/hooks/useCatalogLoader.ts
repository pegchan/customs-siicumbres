/**
 * Hook personalizado para cargar el catálogo desde el backend
 * Maneja loading states, errores y retry logic
 * Ahora soporta carga dinámica por modelo
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
  reloadWithModel: (modelId: number | string) => void;
}

export interface UseCatalogLoaderOptions {
  modelId?: number | string;
}

export function useCatalogLoader(options?: UseCatalogLoaderOptions): CatalogLoadingState {
  const [catalog, setCatalog] = useState<BackendFullCatalog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [currentModelId, setCurrentModelId] = useState<number | string | undefined>(options?.modelId);

  const loadCatalog = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (currentModelId) {
        console.log(`[useCatalogLoader] Loading catalog for model ${currentModelId} from API...`);
      } else {
        console.log('[useCatalogLoader] Loading house models from API...');
      }

      const data = await catalogAPI.getFullCatalog(currentModelId);

      setCatalog(data);

      if (currentModelId) {
        console.log(`[useCatalogLoader] Catalog for model ${currentModelId} loaded successfully`);
      } else {
        console.log('[useCatalogLoader] House models loaded successfully');
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      console.error('[useCatalogLoader] Error loading catalog:', error);
      setError(error);
      setCatalog(null);
    } finally {
      setLoading(false);
    }
  }, [retryCount, currentModelId]);

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

  // Función para recargar con un modelo específico
  const reloadWithModel = useCallback((modelId: number | string) => {
    console.log(`[useCatalogLoader] Reloading catalog with model ${modelId}...`);
    setCurrentModelId(modelId);
    setRetryCount((prev) => prev + 1);
  }, []);

  return {
    catalog,
    loading,
    error,
    retry,
    clearCache,
    reloadWithModel,
  };
}
