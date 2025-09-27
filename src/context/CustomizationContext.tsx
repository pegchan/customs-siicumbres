import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { CustomizationState, CustomizationOption, HouseModel } from '../types';

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

  return (
    <CustomizationContext.Provider value={{
      state,
      dispatch,
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