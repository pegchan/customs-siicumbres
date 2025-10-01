import { motion } from 'framer-motion';
import { useCustomization } from '../context/CustomizationContext';
import { houseModels } from '../data/mockData';
import { HouseModelCard } from './HouseModelCard';
import type { HouseModel } from '../types';

export function ModelSelectionPage() {
  const { state, setModel } = useCustomization();

  const handleModelSelect = (model: HouseModel) => {
    setModel(model);
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
          className="text-center mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-lg"
        >
          <p className="text-lg font-semibold text-green-800">
            ✓ Modelo seleccionado: {state.selectedModel.name}
          </p>
          <p className="text-sm text-green-600 mt-2">
            En construccion ...
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}