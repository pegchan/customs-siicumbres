import { motion } from 'framer-motion';
import { useCustomization } from '../context/CustomizationContext';
import { mockCatalog } from '../data/mockData';
import { HorizontalOptionGrid } from './HorizontalOptionGrid';
import { useAutoScroll } from '../hooks/useAutoScroll';
import type { CustomizationOption, CustomizationState } from '../types';

interface ClosetsPageProps {
  onNext: () => void;
}

const closetSections = [
  {
    key: 'recamara1' as keyof CustomizationState['closets'],
    title: 'Closet Recámara Principal',
    icon: '💼',
    options: 'recamara1'
  },
  {
    key: 'recamara2' as keyof CustomizationState['closets'],
    title: 'Closet Recámara 2',
    icon: '💼',
    options: 'recamara2'
  },
  {
    key: 'recamara3' as keyof CustomizationState['closets'],
    title: 'Closet Recámara 3',
    icon: '💼',
    options: 'recamara3'
  },
  {
    key: 'muebleBajoEscalera' as keyof CustomizationState['closets'],
    title: 'Mueble Bajo Escalera',
    icon: '🪜',
    options: 'muebleBajoEscalera'
  },
  {
    key: 'puertasMarcoEscalera' as keyof CustomizationState['closets'],
    title: 'Puertas con Marco Bajo Escalera',
    icon: '🚪',
    options: 'puertasMarcoEscalera'
  },
];

function getOptionsForSection(optionsPath: string): CustomizationOption[] {
  const current = (mockCatalog.options.closets as Record<string, CustomizationOption[]>)[optionsPath];
  return current || [];
}

export function ClosetsPage({ onNext }: ClosetsPageProps) {
  const { state, setClosetOption } = useCustomization();
  const { scrollToNextSection, scrollToTop } = useAutoScroll();

  const handleOptionSelect = (section: keyof CustomizationState['closets'], option: CustomizationOption, sectionIndex: number) => {
    setClosetOption(section, option);
    scrollToNextSection(sectionIndex);
  };

  const completedSections = closetSections.filter(section => 
    state.closets[section.key] !== null
  ).length;

  const totalSections = closetSections.length;
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
          Acabados de Closets
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-4"
        >
          Selecciona los acabados de madera para todos los closets y muebles de almacenamiento de tu hogar.
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
        {closetSections.map((section, sectionIndex) => {
          const options = getOptionsForSection(section.options);
          
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
                {state.closets[section.key] && (
                  <span className="ml-auto text-corporate-600 font-medium">
                    ✓ {state.closets[section.key]?.name}
                  </span>
                )}
              </div>
              
              <HorizontalOptionGrid
                options={options}
                selectedOption={state.closets[section.key]}
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
            Continuar a Extras
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