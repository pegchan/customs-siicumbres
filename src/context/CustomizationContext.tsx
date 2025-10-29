import React, { createContext, useContext, useReducer, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { CustomizationState, CustomizationOption, HouseModel, CustomizationCatalog } from '../types';
import { useCatalogLoader } from '../hooks/useCatalogLoader';
import { transformBackendCatalog } from '../data/catalogTransformer';

type CustomizationAction = 
  | { type: 'SET_MODEL'; payload: HouseModel }
  | { type: 'SET_INTERIOR_COLOR'; category: keyof CustomizationState['interiores']; payload: CustomizationOption }
  | { type: 'SET_KITCHEN_OPTION'; category: keyof CustomizationState['cocina']; payload: CustomizationOption }
  | { type: 'SET_BATHROOM_OPTION'; category: keyof CustomizationState['banos']; payload: CustomizationOption }
  | { type: 'SET_CLOSET_OPTION'; category: keyof CustomizationState['closets']; payload: CustomizationOption }
  | { type: 'SET_EXTRA_OPTION'; category: string; payload: CustomizationOption }
  | { type: 'RESET_CUSTOMIZATION' };

const initialState: CustomizationState = {
  selectedModel: null,
  interiores: {
    // Colores y Maderas combinados
    sala: null,
    comedor: null,
    recamara1: null,
    recamara2: null,
    recamara3: null,
    escaleras: null,
  },
  cocina: {
    alacenaSuperior: null,
    alacenaInferior: null,
    alacenaBarraL: null,
    alacenaExtra: null,
    cubierta: null,
    backsplash: null,
    tarja: null,
  },
  banos: {
    muebleBanoA: null,
    muebleBanoB: null,
    muebleBanoC: null,
    colorMueble: null,
    acabadoCanceles: null,
  },
  closets: {
    recamara1: null,
    recamara2: null,
    recamara3: null,
    muebleBajoEscalera: null,
    puertasMarcoEscalera: null,
  },
  extras: {
    colorFachada: null,
    minisplit: null,
    protecciones: null,
    paneles: null,
    patio: {
      estilo: null,
      domo: null,
    },
    reflejante: null,
  },
};

function customizationReducer(state: CustomizationState, action: CustomizationAction): CustomizationState {
  switch (action.type) {
    case 'SET_MODEL':
      return { ...state, selectedModel: action.payload };
    
    case 'SET_INTERIOR_COLOR':
      return {
        ...state,
        interiores: {
          ...state.interiores,
          [action.category]: action.payload,
        },
      };
    
    case 'SET_KITCHEN_OPTION':
      return {
        ...state,
        cocina: {
          ...state.cocina,
          [action.category]: action.payload,
        },
      };
    
    case 'SET_BATHROOM_OPTION':
      return {
        ...state,
        banos: {
          ...state.banos,
          [action.category]: action.payload,
        },
      };
    
    case 'SET_CLOSET_OPTION':
      return {
        ...state,
        closets: {
          ...state.closets,
          [action.category]: action.payload,
        },
      };
    
    case 'RESET_CUSTOMIZATION':
      return initialState;
    
    default:
      return state;
  }
}

interface CustomizationContextType {
  state: CustomizationState;
  dispatch: React.Dispatch<CustomizationAction>;
  catalog: CustomizationCatalog | null;
  setModel: (model: HouseModel) => void;
  setInteriorColor: (category: keyof CustomizationState['interiores'], option: CustomizationOption) => void;
  setKitchenOption: (category: keyof CustomizationState['cocina'], option: CustomizationOption) => void;
  setBathroomOption: (category: keyof CustomizationState['banos'], option: CustomizationOption) => void;
  setClosetOption: (category: keyof CustomizationState['closets'], option: CustomizationOption) => void;
  resetCustomization: () => void;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export function CustomizationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(customizationReducer, initialState);

  // Cargar catálogo desde el backend
  const { catalog: backendCatalog, loading, error, retry } = useCatalogLoader();

  // Transformar catálogo cuando esté disponible
  const catalog = useMemo(() => {
    if (!backendCatalog) return null;
    return transformBackendCatalog(backendCatalog);
  }, [backendCatalog]);

  const setModel = (model: HouseModel) => {
    dispatch({ type: 'SET_MODEL', payload: model });
  };

  const setInteriorColor = (category: keyof CustomizationState['interiores'], option: CustomizationOption) => {
    dispatch({ type: 'SET_INTERIOR_COLOR', category, payload: option });
  };

  const setKitchenOption = (category: keyof CustomizationState['cocina'], option: CustomizationOption) => {
    dispatch({ type: 'SET_KITCHEN_OPTION', category, payload: option });
  };

  const setBathroomOption = (category: keyof CustomizationState['banos'], option: CustomizationOption) => {
    dispatch({ type: 'SET_BATHROOM_OPTION', category, payload: option });
  };

  const setClosetOption = (category: keyof CustomizationState['closets'], option: CustomizationOption) => {
    dispatch({ type: 'SET_CLOSET_OPTION', category, payload: option });
  };

  const resetCustomization = () => {
    dispatch({ type: 'RESET_CUSTOMIZATION' });
  };

  // Mostrar loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-corporate-500 border-t-transparent mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Cargando catálogo...
          </h2>
          <p className="text-gray-600">
            Preparando tus opciones de personalización
          </p>
        </div>
      </div>
    );
  }

  // Mostrar error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Error al cargar el catálogo
          </h2>
          <p className="text-gray-600 mb-2">
            {error.message || 'No se pudo conectar con el servidor'}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Verifica que el servidor esté en funcionamiento y vuelve a intentarlo.
          </p>
          <button
            onClick={retry}
            className="bg-corporate-500 hover:bg-corporate-600 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Reintentar carga
          </button>
        </div>
      </div>
    );
  }

  return (
    <CustomizationContext.Provider value={{
      state,
      dispatch,
      catalog,
      setModel,
      setInteriorColor,
      setKitchenOption,
      setBathroomOption,
      setClosetOption,
      resetCustomization,
    }}>
      {children}
    </CustomizationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCustomization() {
  const context = useContext(CustomizationContext);
  if (context === undefined) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
}