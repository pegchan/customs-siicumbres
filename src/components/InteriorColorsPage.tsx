import { motion } from 'framer-motion';
import { useCustomization } from '../context/CustomizationContext';
import { HorizontalOptionGrid } from './HorizontalOptionGrid';
import { useAutoScroll } from '../hooks/useAutoScroll';
import type { CustomizationOption, CustomizationState } from '../types';

interface InteriorColorsPageProps {
  onNext: () => void;
}

// Secciones de interiores (colores y maderas combinados)
const sections = [
  { key: 'sala' as keyof CustomizationState['interiores'], title: 'Sala', icon: '🛋️' },
  { key: 'comedor' as keyof CustomizationState['interiores'], title: 'Comedor', icon: '🍽️' },
  { key: 'recamara1' as keyof CustomizationState['interiores'], title: 'Recámara Principal', icon: '🛏️' },
  { key: 'recamara2' as keyof CustomizationState['interiores'], title: 'Recámara 2', icon: '🛏️' },
  { key: 'recamara3' as keyof CustomizationState['interiores'], title: 'Recámara 3', icon: '🛏️' },
  { key: 'escaleras' as keyof CustomizationState['interiores'], title: 'Estudio', icon: '📚' },
];

export function InteriorColorsPage({ onNext }: InteriorColorsPageProps) {
  const { state, setInteriorColor, catalog } = useCustomization();
  const { scrollToNextSection, scrollToTop } = useAutoScroll();

  const handleOptionSelect = (section: keyof CustomizationState['interiores'], option: CustomizationOption, sectionIndex: number) => {
    setInteriorColor(section, option);

    // Auto-scroll to next section after selection
    scrollToNextSection(sectionIndex);
  };

  // Verificar si todas las secciones están completas
  const isComplete = sections.every(section =>
    state.interiores[section.key] !== null
  );

  const handleContinue = () => {
    if (isComplete) {
      scrollToTop();
      setTimeout(() => {
        onNext();
      }, 300); // Small delay for smooth transition
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
          Colores de Interiores
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Selecciona el color o acabado de madera para cada área de tu hogar.
        </motion.p>
      </div>

      <div className="space-y-8">
        {sections.map((section, sectionIndex) => (
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
              <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
              {state.interiores[section.key] && (
                <span className="ml-auto text-corporate-600 font-medium">
                  ✓ {state.interiores[section.key]?.name}
                </span>
              )}
            </div>

            <HorizontalOptionGrid
              options={catalog?.options.interiores[section.key] || []}
              selectedOption={state.interiores[section.key]}
              onSelect={(opt) => handleOptionSelect(section.key, opt, sectionIndex)}
              sectionIndex={sectionIndex}
            />
          </motion.div>
        ))}
      </div>

      {/* Indicador de progreso */}
      {!isComplete && (
        <div className="text-center mt-6">
          <p className="text-gray-600">
            {sections.filter(s => state.interiores[s.key] !== null).length} de {sections.length} áreas seleccionadas
          </p>
        </div>
      )}

      {isComplete && (
        <div className="text-center mt-6">
          <p className="text-corporate-600 font-semibold">
            ✓ Todos los interiores seleccionados
          </p>
        </div>
      )}

      {/* Botón continuar */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8"
        >
          <button
            onClick={handleContinue}
            className="bg-corporate-600 hover:bg-corporate-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Continuar a Cocina
          </button>
        </motion.div>
      )}

      {!isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600">
            Selecciona un color o acabado para todas las áreas para continuar
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
