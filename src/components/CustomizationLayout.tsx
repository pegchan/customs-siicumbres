import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomization } from '../context/CustomizationContext';
import { ModelSelectionPage } from './ModelSelectionPage';
import { InteriorColorsPage } from './InteriorColorsPage';

type Step = 'model' | 'interiores';

export function CustomizationLayout() {
  const [currentStep, setCurrentStep] = useState<Step>('model');
  const { state } = useCustomization();

  const handleNext = () => {
    if (currentStep === 'model') {
      setCurrentStep('interiores');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'model':
        return <ModelSelectionPage onNext={handleNext} />;
      case 'interiores':
        return <InteriorColorsPage />;
      default:
        return <ModelSelectionPage onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-blue-600">🏠</div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Personalizaciones Cumbres León</h1>
                <p className="text-sm text-gray-600">Personaliza tu hogar ideal</p>
              </div>
            </div>

            {state.selectedModel && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Modelo seleccionado:</div>
                <div className="font-semibold text-gray-800">{state.selectedModel.name}</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Simple Stepper */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep === 'model' ? 'text-blue-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'model' ? 'bg-blue-600' : 'bg-green-600'} text-white font-bold`}>
                {currentStep === 'model' ? '1' : '✓'}
              </div>
              <span className="ml-2 font-semibold">Modelo</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300"></div>
            <div className={`flex items-center ${currentStep === 'interiores' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'interiores' ? 'bg-blue-600' : 'bg-gray-300'} text-white font-bold`}>
                2
              </div>
              <span className="ml-2 font-semibold">Interiores</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}