import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { CustomizationOption, HouseModel } from '../types';

interface CustomizationState {
  selectedModel: HouseModel | null;
  interiores: {
    sala: CustomizationOption | null;
    comedor: CustomizationOption | null;
    recamara1: CustomizationOption | null;
    recamara2: CustomizationOption | null;
    recamara3: CustomizationOption | null;
    escaleras: CustomizationOption | null;
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
}

type CustomizationAction =
  | { type: 'SET_MODEL'; payload: HouseModel }
  | { type: 'SET_INTERIOR_COLOR'; category: keyof CustomizationState['interiores']; payload: CustomizationOption }
  | { type: 'SET_KITCHEN_OPTION'; category: keyof CustomizationState['cocina']; payload: CustomizationOption }
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