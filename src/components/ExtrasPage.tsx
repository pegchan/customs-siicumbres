import React from 'react';
import { motion } from 'framer-motion';
import { useCustomization } from '../context/CustomizationContext';
import { mockCatalog } from '../data/mockData';
import { HorizontalOptionGrid } from './HorizontalOptionGrid';
import { useAutoScroll } from '../hooks/useAutoScroll';
import type { CustomizationOption } from '../types';

interface ExtrasPageProps {
  onNext: () => void;
}

const extraSections = [
  {
    key: 'colorFachada',
    title: 'Color de Fachada',
    icon: '🏠',
    options: mockCatalog.options.extras.fachadas,
    required: true
  },
  {
    key: 'minisplit',
    title: 'Minisplit',
    icon: '❄️',
    options: mockCatalog.options.extras.minisplit,
    required: false
  },
  {
    key: 'paneles',
    title: 'Paneles Fotovoltaicos',
    icon: '☀️',
    options: mockCatalog.options.extras.paneles,
    required: false
  },
  {
    key: 'patioEstilo',
    title: 'Estilo de Patio',
    icon: '🌿',
    options: mockCatalog.options.extras.patio.estilos,
    required: true
  },
  {
    key: 'patioDomo',
    title: 'Domo de Patio',
    icon: '🔆',
    options: mockCatalog.options.extras.patio.domos,
    required: false
  },
];

interface ExtrasState {
  colorFachada: CustomizationOption | null;
  minisplit: CustomizationOption | null;
  paneles: CustomizationOption | null;
  patioEstilo: CustomizationOption | null;
  patioDomo: CustomizationOption | null;
  protecciones: CustomizationOption[];
  reflejante: CustomizationOption[];
}

export function ExtrasPage({ onNext }: ExtrasPageProps) {
  const { state } = useCustomization();
  const { scrollToNextSection, scrollToTop } = useAutoScroll();
  
  // Simplified state for extras - using local state since the context doesn't handle extras properly yet
  const [extrasState, setExtrasState] = React.useState<ExtrasState>({
    colorFachada: state.extras.colorFachada,
    minisplit: state.extras.minisplit,
    paneles: state.extras.paneles,
    patioEstilo: state.extras.patio.estilo,
    patioDomo: state.extras.patio.domo,
    protecciones: state.extras.protecciones || [],
    reflejante: state.extras.reflejante || [],
  });

  const handleOptionSelect = (sectionKey: string, option: CustomizationOption, sectionIndex: number) => {
    setExtrasState(prev => ({
      ...prev,
      [sectionKey]: option
    }));
    scrollToNextSection(sectionIndex);
  };

  const handleMultiOptionToggle = (sectionKey: 'protecciones' | 'reflejante', option: CustomizationOption) => {
    setExtrasState(prev => {
      const currentOptions = prev[sectionKey];
      const isSelected = currentOptions.some(item => item.id === option.id);
      
      if (isSelected) {
        return {
          ...prev,
          [sectionKey]: currentOptions.filter(item => item.id !== option.id)
        };
      } else {
        return {
          ...prev,
          [sectionKey]: [...currentOptions, option]
        };
      }
    });
  };

  const requiredSections = extraSections.filter(section => section.required);
  const completedRequiredSections = requiredSections.filter(section => 
    extrasState[section.key as keyof ExtrasState] !== null
  ).length;

  const isComplete = completedRequiredSections === requiredSections.length;

  const handleContinue = () => {
    if (isComplete) {
      scrollToTop();
      setTimeout(() => {
        onNext();
      }, 300);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Extras y Accesorios
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-4"
        >
          Personaliza la fachada, patio y agrega accesorios especiales a tu hogar. Los elementos marcados con * son obligatorios.
        </motion.p>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <span>Progreso obligatorio:</span>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-corporate-600">{completedRequiredSections}</span>
            <span>/</span>
            <span>{requiredSections.length}</span>
          </div>
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-corporate-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedRequiredSections / requiredSections.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {extraSections.map((section, sectionIndex) => {
          const currentSelection = extrasState[section.key as keyof ExtrasState] as CustomizationOption | null;
          
          return (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + sectionIndex * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
              data-section
            >
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">{section.icon}</span>
                <h2 className="text-xl font-semibold text-gray-900">
                  {section.title}
                  {section.required && <span className="text-red-500 ml-1">*</span>}
                </h2>
                {currentSelection && (
                  <span className="ml-auto text-corporate-600 font-medium">
                    ✓ {currentSelection.name}
                  </span>
                )}
              </div>
              
              <HorizontalOptionGrid
                options={section.options}
                selectedOption={currentSelection}
                onSelect={(opt) => handleOptionSelect(section.key, opt, sectionIndex)}
                sectionIndex={sectionIndex}
              />
            </motion.div>
          );
        })}

        {/* Protecciones - Multi-select */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + extraSections.length * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
          data-section
        >
          <div className="flex items-center mb-6">
            <span className="text-2xl mr-3">🔒</span>
            <h2 className="text-xl font-semibold text-gray-900">Protecciones (Opcional)</h2>
            {extrasState.protecciones.length > 0 && (
              <span className="ml-auto text-corporate-600 font-medium">
                ✓ {extrasState.protecciones.length} seleccionadas
              </span>
            )}
          </div>
          
          <HorizontalOptionGrid
            options={mockCatalog.options.extras.protecciones}
            selectedOptions={extrasState.protecciones}
            onSelect={(opt) => handleMultiOptionToggle('protecciones', opt)}
            sectionIndex={extraSections.length}
            multiSelect={true}
          />
        </motion.div>

        {/* Reflejante - Multi-select */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + (extraSections.length + 1) * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
          data-section
        >
          <div className="flex items-center mb-6">
            <span className="text-2xl mr-3">🪟</span>
            <h2 className="text-xl font-semibold text-gray-900">Reflejante en Ventanas (Opcional)</h2>
            {extrasState.reflejante.length > 0 && (
              <span className="ml-auto text-corporate-600 font-medium">
                ✓ {extrasState.reflejante.length} seleccionadas
              </span>
            )}
          </div>
          
          <HorizontalOptionGrid
            options={mockCatalog.options.extras.reflejante}
            selectedOptions={extrasState.reflejante}
            onSelect={(opt) => handleMultiOptionToggle('reflejante', opt)}
            sectionIndex={extraSections.length + 1}
            multiSelect={true}
          />
        </motion.div>
      </div>

      <div className="text-center mt-8 space-y-4">
        {isComplete && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleContinue}
            className="bg-corporate-600 hover:bg-corporate-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Ver Resumen Final
          </motion.button>
        )}

        {!isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-600"
          >
            <p>Completa las secciones obligatorias (*) para continuar</p>
            <p className="text-sm">({requiredSections.length - completedRequiredSections} secciones obligatorias restantes)</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}