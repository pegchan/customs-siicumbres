import type { SubcategoryConfigResponse, SubcategoryConfig } from '../types';

// Mock service that simulates fetching subcategory configuration from an API
export class SubcategoryConfigService {
  private static instance: SubcategoryConfigService;
  private config: SubcategoryConfig | null = null;
  private lastFetched: string | null = null;

  private constructor() {}

  static getInstance(): SubcategoryConfigService {
    if (!SubcategoryConfigService.instance) {
      SubcategoryConfigService.instance = new SubcategoryConfigService();
    }
    return SubcategoryConfigService.instance;
  }

  // Mock API response - this would come from your backend service
  private mockApiResponse(): SubcategoryConfigResponse {
    return {
      subcategories: {
        // Optional subcategories
        'climate': { 
          isOptional: true, 
          displayName: 'Climatización', 
          description: 'Sistemas de aire acondicionado y calefacción'
        },
        'protection': { 
          isOptional: true, 
          displayName: 'Protecciones', 
          description: 'Sistemas de seguridad para ventanas'
        },
        'energy': { 
          isOptional: true, 
          displayName: 'Energía Solar', 
          description: 'Paneles fotovoltaicos y sistemas de energía renovable'
        },
        'dome': { 
          isOptional: true, 
          displayName: 'Domo de Patio', 
          description: 'Estructuras de techo para patio'
        },
        'window': { 
          isOptional: true, 
          displayName: 'Reflejante', 
          description: 'Películas reflejantes para ventanas'
        },
        
        // Required subcategories
        'color': { 
          isOptional: false, 
          displayName: 'Color', 
          description: 'Colores de pintura y acabados'
        },
        'finish': { 
          isOptional: false, 
          displayName: 'Acabado', 
          description: 'Acabados de madera y materiales'
        },
        'countertop': { 
          isOptional: false, 
          displayName: 'Cubierta', 
          description: 'Materiales para cubiertas de cocina'
        },
        'backsplash': { 
          isOptional: false, 
          displayName: 'Backsplash', 
          description: 'Revestimientos para pared de cocina'
        },
        'sink': { 
          isOptional: false, 
          displayName: 'Tarja', 
          description: 'Tipos de tarja y lavaderos'
        },
        'glass': { 
          isOptional: false, 
          displayName: 'Cristal', 
          description: 'Tipos de cristal para baños'
        },
        'floor': { 
          isOptional: false, 
          displayName: 'Piso', 
          description: 'Materiales de piso para patio'
        },
      },
      lastUpdated: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  // Simulate API call with delay
  async fetchConfig(): Promise<SubcategoryConfig> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = this.mockApiResponse();
    this.config = response.subcategories;
    this.lastFetched = response.lastUpdated;
    
    return this.config;
  }

  // Get cached config or fetch if not available
  async getConfig(): Promise<SubcategoryConfig> {
    if (!this.config) {
      return await this.fetchConfig();
    }
    return this.config;
  }

  // Check if a subcategory is optional
  async isSubcategoryOptional(subcategory: string): Promise<boolean> {
    const config = await this.getConfig();
    return config[subcategory]?.isOptional ?? false;
  }

  // Get display name for subcategory
  async getSubcategoryDisplayName(subcategory: string): Promise<string> {
    const config = await this.getConfig();
    return config[subcategory]?.displayName ?? subcategory;
  }

  // Force refresh from "API"
  async refreshConfig(): Promise<SubcategoryConfig> {
    this.config = null;
    return await this.fetchConfig();
  }

  // Get last fetch timestamp
  getLastFetched(): string | null {
    return this.lastFetched;
  }
}

// Export singleton instance
export const subcategoryConfigService = SubcategoryConfigService.getInstance();