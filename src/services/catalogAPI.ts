/**
 * Servicio de API para el Catálogo Maestro de Personalización
 * Backend: cumbres_leon_v2 (Laravel 5.6)
 */

// Tipos para los datos del catálogo (según response real del backend)
export interface BackendHouseModel {
  id: string; // El backend devuelve string, no number
  name: string;
  description: string;
  image: string; // El backend devuelve "image", no "main_image"
  floorPlans: {
    plantaBaja: string;
    plantaAlta: string | null;
  };
}

export interface BackendCatalogOption {
  id: string; // option_id
  name: string;
  image: string | null;
  category: string;
  subcategory: string;
  price: number;
}

export interface BackendFullCatalog {
  houseModels: BackendHouseModel[];
  options: {
    [category: string]: {
      [subcategory: string]: BackendCatalogOption[] | {
        [area: string]: BackendCatalogOption[];
      };
    };
  };
  categoryOrder?: string[]; // Orden de categorías definido en el CRM
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Configuración de la API
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/catalog',
  timeout: 10000, // 10 segundos
};

/**
 * Servicio principal del catálogo
 */
class CatalogAPIService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutos

  /**
   * Obtener catálogo completo (modelos + opciones)
   * Si se proporciona modelId, usa el endpoint dinámico por modelo
   * Si no, obtiene todos los modelos sin opciones
   */
  async getFullCatalog(modelId?: number | string): Promise<BackendFullCatalog> {
    // Si hay modelId, usar endpoint por modelo
    if (modelId) {
      return this.getCatalogByModel(modelId);
    }

    // Si no hay modelId, solo cargar modelos
    const cacheKey = 'house-models-only';

    // Verificar cache
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log('[CatalogAPI] Usando modelos en cache');
      return cached;
    }

    try {
      console.log('[CatalogAPI] Fetching house models from backend...');

      const response = await this.fetchWithTimeout(`${API_CONFIG.baseURL}/house-models`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<BackendHouseModel[]> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error al obtener modelos');
      }

      console.log('[CatalogAPI] House models loaded successfully:', result.data.length);

      // Formato compatible con BackendFullCatalog
      const catalogData: BackendFullCatalog = {
        houseModels: result.data,
        options: {}
      };

      // Guardar en cache
      this.setCacheData(cacheKey, catalogData);

      return catalogData;

    } catch (error) {
      console.error('[CatalogAPI] Error fetching house models:', error);
      throw error;
    }
  }

  /**
   * Obtener catálogo completo por modelo (modelo + opciones configuradas)
   * Usa el nuevo endpoint dinámico basado en configuración CRM
   */
  async getCatalogByModel(modelId: number | string): Promise<BackendFullCatalog> {
    const cacheKey = `catalog-model-${modelId}`;

    // Verificar cache
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log(`[CatalogAPI] Usando catálogo del modelo ${modelId} en cache`);
      return cached;
    }

    try {
      console.log(`[CatalogAPI] Fetching catalog for model ${modelId} from backend...`);

      const response = await this.fetchWithTimeout(`${API_CONFIG.baseURL}/by-model/${modelId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<BackendFullCatalog> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error al obtener catálogo del modelo');
      }

      console.log(`[CatalogAPI] Catalog for model ${modelId} loaded successfully:`, {
        models: result.data.houseModels?.length || 0,
        categories: Object.keys(result.data.options || {}).length
      });

      // Guardar en cache
      this.setCacheData(cacheKey, result.data);

      return result.data;

    } catch (error) {
      console.error(`[CatalogAPI] Error fetching catalog for model ${modelId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener solo modelos de casa
   */
  async getHouseModels(): Promise<BackendHouseModel[]> {
    const cacheKey = 'house-models';

    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.fetchWithTimeout(`${API_CONFIG.baseURL}/house-models`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<BackendHouseModel[]> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error al obtener modelos');
      }

      this.setCacheData(cacheKey, result.data);
      return result.data;

    } catch (error) {
      console.error('[CatalogAPI] Error fetching house models:', error);
      throw error;
    }
  }

  /**
   * Obtener opciones con filtros opcionales
   */
  async getOptions(filters?: {
    category?: string;
    subcategory?: string;
    active?: boolean;
  }): Promise<BackendCatalogOption[]> {
    const params = new URLSearchParams();

    if (filters?.category) params.set('category', filters.category);
    if (filters?.subcategory) params.set('subcategory', filters.subcategory);
    if (filters?.active !== undefined) params.set('active', String(filters.active));

    const url = `${API_CONFIG.baseURL}/options${params.toString() ? '?' + params.toString() : ''}`;
    const cacheKey = `options-${params.toString()}`;

    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.fetchWithTimeout(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<BackendCatalogOption[]> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error al obtener opciones');
      }

      this.setCacheData(cacheKey, result.data);
      return result.data;

    } catch (error) {
      console.error('[CatalogAPI] Error fetching options:', error);
      throw error;
    }
  }

  /**
   * Obtener categorías disponibles
   */
  async getCategories() {
    const cacheKey = 'categories';

    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.fetchWithTimeout(`${API_CONFIG.baseURL}/categories`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<any> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error al obtener categorías');
      }

      this.setCacheData(cacheKey, result.data);
      return result.data;

    } catch (error) {
      console.error('[CatalogAPI] Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Limpiar cache completo
   */
  clearCache() {
    console.log('[CatalogAPI] Clearing cache');
    this.cache.clear();
  }

  /**
   * Limpiar cache específico
   */
  clearCacheKey(key: string) {
    this.cache.delete(key);
  }

  /**
   * Fetch con timeout
   */
  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - el servidor no respondió a tiempo');
      }
      throw error;
    }
  }

  /**
   * Obtener datos del cache si son válidos
   */
  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);

    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Guardar datos en cache
   */
  private setCacheData(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
}

// Exportar instancia singleton
export const catalogAPI = new CatalogAPIService();

// Exportar clase para testing
export default CatalogAPIService;
