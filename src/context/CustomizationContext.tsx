import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { HouseModel } from '../types';

interface CustomizationState {
  selectedModel: HouseModel | null;
}

type CustomizationAction =
  | { type: 'SET_MODEL'; payload: HouseModel }
  | { type: 'RESET_CUSTOMIZATION' };

const initialState: CustomizationState = {
  selectedModel: null,
};

function customizationReducer(state: CustomizationState, action: CustomizationAction): CustomizationState {
  switch (action.type) {
    case 'SET_MODEL':
      return { ...state, selectedModel: action.payload };

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
  resetCustomization: () => void;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export function CustomizationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(customizationReducer, initialState);

  const setModel = (model: HouseModel) => {
    dispatch({ type: 'SET_MODEL', payload: model });
  };

  const resetCustomization = () => {
    dispatch({ type: 'RESET_CUSTOMIZATION' });
  };

  return (
    <CustomizationContext.Provider value={{
      state,
      dispatch,
      setModel,
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