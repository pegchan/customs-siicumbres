import { motion } from 'framer-motion';
import { useCustomization } from '../context/CustomizationContext';
import { mockCatalog } from '../data/mockData';
import { OptionCard } from './OptionCard';
import type { CustomizationOption } from '../types';

type InteriorKey = 'sala' | 'comedor' | 'recamara1' | 'recamara2' | 'recamara3' | 'escaleras';

const interiorSections = [
  { key: 'sala' as InteriorKey, title: 'Sala', icon: '🛋️' },
  { key: 'comedor' as InteriorKey, title: 'Comedor', icon: '🍽️' },
  { key: 'recamara1' as InteriorKey, title: 'Recámara Principal', icon: '🛏️' },
  { key: 'recamara2' as InteriorKey, title: 'Recámara 2', icon: '🛏️' },
  { key: 'recamara3' as InteriorKey, title: 'Recámara 3', icon: '🛏️' },
  { key: 'escaleras' as InteriorKey, title: 'Escaleras', icon: '🪜' },
];

export function InteriorColorsPage() {
  const { state, setInteriorColor } = useCustomization();

  const handleOptionSelect = (section: InteriorKey, option: CustomizationOption) => {
    setInteriorColor(section, option);
  };

  const isComplete = interiorSections.every(section =>
    state.interiores[section.key] !== null
  );

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
          Selecciona los colores para cada área de tu hogar. Puedes elegir el mismo color para todas las habitaciones o personalizar cada una.
        </motion.p>
      </div>

      <div className="space-y-12">
        {interiorSections.map((section, sectionIndex) => (
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
              <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              {state.interiores[section.key] && (
                <span className="ml-auto text-blue-600 font-medium">
                  ✓ {state.interiores[section.key]?.name}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockCatalog.options.interiores.colores.sala.map((option) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  isSelected={state.interiores[section.key]?.id === option.id}
                  onSelect={() => handleOptionSelect(section.key, option)}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-lg"
        >
          <p className="text-lg font-semibold text-green-800">
            ✓ Todos los colores interiores seleccionados
          </p>
          <p className="text-sm text-green-600 mt-2">
          </p>
        </motion.div>
      )}

      {!isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600">
            Selecciona colores para todas las áreas ({interiorSections.filter(s => state.interiores[s.key]).length}/{interiorSections.length} completadas)
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}