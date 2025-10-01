import { motion } from 'framer-motion';
import { useCustomization } from '../context/CustomizationContext';
import { mockCatalog } from '../data/mockData';
import { OptionCard } from './OptionCard';
import type { CustomizationOption } from '../types';

type KitchenKey = 'alacenaSuperior' | 'alacenaInferior' | 'alacenaBarraL' | 'alacenaExtra' | 'cubierta' | 'backsplash' | 'tarja';

const kitchenSections = [
  { key: 'alacenaSuperior' as KitchenKey, title: 'Alacena Superior', icon: '🏠' },
  { key: 'alacenaInferior' as KitchenKey, title: 'Alacena Inferior', icon: '📦' },
  { key: 'alacenaBarraL' as KitchenKey, title: 'Barra en L', icon: '🔄' },
  { key: 'alacenaExtra' as KitchenKey, title: 'Alacena Extra', icon: '➕' },
  { key: 'cubierta' as KitchenKey, title: 'Cubierta', icon: '🪨' },
  { key: 'backsplash' as KitchenKey, title: 'Backsplash', icon: '🏺' },
  { key: 'tarja' as KitchenKey, title: 'Tarja', icon: '🚰' },
];

export function KitchenPage() {
  const { state, setKitchenOption } = useCustomization();

  const handleOptionSelect = (section: KitchenKey, option: CustomizationOption) => {
    setKitchenOption(section, option);
  };

  const isComplete = kitchenSections.every(section =>
    state.cocina[section.key] !== null
  );

  // Usar las mismas opciones para todas las secciones (maderas)
  const woodOptions = mockCatalog.options.cocina.alacenas.superior;

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
          Personalización de Cocina
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Selecciona los acabados para cada elemento de tu cocina
        </motion.p>
      </div>

      <div className="space-y-12">
        {kitchenSections.map((section, sectionIndex) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + sectionIndex * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">{section.icon}</span>
              <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              {state.cocina[section.key] && (
                <span className="ml-auto text-blue-600 font-medium">
                  ✓ {state.cocina[section.key]?.name}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {woodOptions.map((option) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  isSelected={state.cocina[section.key]?.id === option.id}
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
            ✓ Todos los elementos de cocina seleccionados
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
            Selecciona acabados para todos los elementos ({kitchenSections.filter(s => state.cocina[s.key]).length}/{kitchenSections.length} completados)
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
