import { motion } from 'framer-motion';
import { useCustomization } from '../context/CustomizationContext';
import { HorizontalOptionGrid } from './HorizontalOptionGrid';
import { useAutoScroll } from '../hooks/useAutoScroll';
import type { CustomizationOption, CustomizationState, CustomizationCatalog } from '../types';

interface KitchenPageProps {
  onNext: () => void;
}

const kitchenSections = [
  {
    key: 'alacenaSuperior' as keyof CustomizationState['cocina'],
    title: 'Alacena Superior',
    icon: '🏠',
    options: 'alacenas.superior'
  },
  {
    key: 'alacenaInferior' as keyof CustomizationState['cocina'],
    title: 'Alacena Inferior',
    icon: '📦',
    options: 'alacenas.inferior'
  },
  {
    key: 'alacenaBarraL' as keyof CustomizationState['cocina'],
    title: 'Barra en L',
    icon: '🔄',
    options: 'alacenas.barraL'
  },
  {
    key: 'alacenaExtra' as keyof CustomizationState['cocina'],
    title: 'Alacena Extra',
    icon: '➕',
    options: 'alacenas.extra'
  },
  {
    key: 'cubierta' as keyof CustomizationState['cocina'],
    title: 'Cubierta',
    icon: '🪨',
    options: 'cubierta'
  },
  {
    key: 'backsplash' as keyof CustomizationState['cocina'],
    title: 'Backsplash',
    icon: '🏺',
    options: 'backsplash'
  },
  {
    key: 'tarja' as keyof CustomizationState['cocina'],
    title: 'Tarja',
    icon: '🚰',
    options: 'tarja'
  },
];

function getOptionsForSection(catalog: CustomizationCatalog | null, optionsPath: string): CustomizationOption[] {
  if (!catalog) return [];

  const paths = optionsPath.split('.');
  let current: any = catalog.options.cocina;

  for (const path of paths) {
    current = current[path];
    if (!current) return [];
  }

  return (current as CustomizationOption[]) || [];
}

export function KitchenPage({ onNext }: KitchenPageProps) {
  const { state, setKitchenOption, catalog } = useCustomization();
  const { scrollToNextSection, scrollToTop } = useAutoScroll();

  const handleOptionSelect = (section: keyof CustomizationState['cocina'], option: CustomizationOption, sectionIndex: number) => {
    setKitchenOption(section, option);
    scrollToNextSection(sectionIndex);
  };

  const completedSections = kitchenSections.filter(section => 
    state.cocina[section.key] !== null
  ).length;

  const totalSections = kitchenSections.length;
  const isComplete = completedSections === totalSections;

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
          Personalización de Cocina
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-4"
        >
          Selecciona los acabados y materiales para tu cocina. Cada elemento puede ser personalizado individualmente.
        </motion.p>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <span>Progreso:</span>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-corporate-600">{completedSections}</span>
            <span>/</span>
            <span>{totalSections}</span>
          </div>
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-corporate-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSections / totalSections) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {kitchenSections.map((section, sectionIndex) => {
          const options = getOptionsForSection(catalog, section.options);

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
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                {state.cocina[section.key] && (
                  <span className="ml-auto text-corporate-600 font-medium">
                    ✓ {state.cocina[section.key]?.name}
                  </span>
                )}
              </div>
              
              <HorizontalOptionGrid
                options={options}
                selectedOption={state.cocina[section.key]}
                onSelect={(opt) => handleOptionSelect(section.key, opt, sectionIndex)}
                sectionIndex={sectionIndex}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-8 space-y-4">
        {isComplete && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleContinue}
            className="bg-corporate-600 hover:bg-corporate-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Continuar a Baños
          </motion.button>
        )}

        {!isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-600"
          >
            <p>Completa todas las secciones para continuar</p>
            <p className="text-sm">({totalSections - completedSections} secciones restantes)</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}