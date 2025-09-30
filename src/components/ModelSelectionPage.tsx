import { motion } from 'framer-motion';
import { useCustomization } from '../context/CustomizationContext';
import { houseModels } from '../data/mockData';
import { HouseModelCard } from './HouseModelCard';
import { useAutoScroll } from '../hooks/useAutoScroll';
import type { HouseModel } from '../types';

interface ModelSelectionPageProps {
  onNext: () => void;
}

export function ModelSelectionPage({ onNext }: ModelSelectionPageProps) {
  const { state, setModel } = useCustomization();
  const { scrollToTop } = useAutoScroll();

  const handleModelSelect = (model: HouseModel) => {
    setModel(model);
  };

  const handleContinue = () => {
    if (state.selectedModel) {
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
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          Selecciona tu Modelo de Casa
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Elige el diseño que mejor se adapte a tus necesidades y comienza a personalizar tu hogar ideal.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {houseModels.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <HouseModelCard
              model={model}
              isSelected={state.selectedModel?.id === model.id}
              onSelect={handleModelSelect}
            />
          </motion.div>
        ))}
      </motion.div>

      {state.selectedModel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            onClick={handleContinue}
            className="bg-corporate-600 hover:bg-corporate-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Continuar con la Personalización
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}