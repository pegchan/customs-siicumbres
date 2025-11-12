export interface CustomizationOption {
  id: string;
  name: string;
  image?: string;
  category: string;
  subcategory?: string;
  price?: number;
}

export interface HouseModel {
  id: string;
  name: string;
  description: string;
  image?: string;
  floorPlans: {
    plantaBaja: string;
    plantaAlta?: string;
  };
}

export interface CustomizationState {
  selectedModel: HouseModel | null;
  interiores: {
    // Colores y Maderas combinados (una sola opción por área)
    sala: CustomizationOption | null;
    comedor: CustomizationOption | null;
    recamara1: CustomizationOption | null;
    recamara2: CustomizationOption | null;
    recamara3: CustomizationOption | null;
    escalera: CustomizationOption | null; // Cambiado de 'escalera' a 'escalera' (singular)
    // Soporte para áreas dinámicas del backend
    [key: string]: CustomizationOption | null;
  };
  cocina: {
    alacenaSuperior: CustomizationOption | null;
    alacenaInferior: CustomizationOption | null;
    alacenaBarraL: CustomizationOption | null;
    alacenaExtra: CustomizationOption | null;
    cubierta: CustomizationOption | null;
    backsplash: CustomizationOption | null;
    tarja: CustomizationOption | null;
  };
  banos: {
    muebleBanoA: CustomizationOption | null;
    muebleBanoB: CustomizationOption | null;
    muebleBanoC: CustomizationOption | null;
    colorMueble: CustomizationOption | null;
    acabadoCanceles: CustomizationOption | null;
  };
  closets: {
    recamara1: CustomizationOption | null;
    recamara2: CustomizationOption | null;
    recamara3: CustomizationOption | null;
    muebleBajoEscalera: CustomizationOption | null;
    puertasMarcoEscalera: CustomizationOption | null;
  };
  extras: {
    colorFachada: CustomizationOption | null;
    minisplit: CustomizationOption | null;
    protecciones: CustomizationOption[] | null;
    paneles: CustomizationOption | null;
    patio: {
      estilo: CustomizationOption | null;
      domo: CustomizationOption | null;
    };
    reflejante: CustomizationOption[] | null;
  };
  // Nuevo: Selecciones dinámicas para cualquier categoría del backend
  dynamicSelections: {
    [categoryId: string]: {
      [subcategoryId: string]: {
        [areaId: string]: CustomizationOption | null;
      };
    };
  };
}

export interface CustomizationCatalog {
  houseModels: HouseModel[];
  options: {
    interiores: {
      colores: {
        // DINÁMICO: Todas las áreas vienen del backend
        // No hardcodeamos áreas específicas
        [key: string]: CustomizationOption[];
      };
    };
    cocina: {
      alacenas: {
        superior: CustomizationOption[];
        inferior: CustomizationOption[];
        barraL: CustomizationOption[];
        extra: CustomizationOption[];
      };
      cubierta: CustomizationOption[];
      backsplash: CustomizationOption[];
      tarja: CustomizationOption[];
    };
    banos: {
      muebles: {
        banoA: CustomizationOption[];
        banoB: CustomizationOption[];
        banoC: CustomizationOption[];
        color: CustomizationOption[];
      };
      acabados: {
        canceles: CustomizationOption[];
      };
    };
    closets: {
      recamara1: CustomizationOption[];
      recamara2: CustomizationOption[];
      recamara3: CustomizationOption[];
      muebleBajoEscalera: CustomizationOption[];
      puertasMarcoEscalera: CustomizationOption[];
    };
    extras: {
      fachadas: CustomizationOption[];
      minisplit: CustomizationOption[];
      protecciones: CustomizationOption[];
      paneles: CustomizationOption[];
      patio: {
        estilos: CustomizationOption[];
        domos: CustomizationOption[];
      };
      reflejante: CustomizationOption[];
    };
  };
}

export type CustomizationStep = 
  | 'model'
  | 'interiores' 
  | 'cocina'
  | 'banos'
  | 'closets'
  | 'extras'
  | 'resumen';

// Configuration for optional subcategories
export interface SubcategoryConfig {
  [key: string]: {
    isOptional: boolean;
    displayName?: string;
    description?: string;
  };
}

export interface SubcategoryConfigResponse {
  subcategories: SubcategoryConfig;
  lastUpdated: string;
  version: string;
}