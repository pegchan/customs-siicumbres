import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CustomizationStep } from '../types';
import { useCustomization } from '../context/CustomizationContext';
import { CustomizationStepper } from './CustomizationStepper';
import { ModelSelectionPage } from './ModelSelectionPage';
import { InteriorColorsPage } from './InteriorColorsPage';
import { KitchenPage } from './KitchenPage';
import { BathroomPage } from './BathroomPage';
import { ClosetsPage } from './ClosetsPage';
import { ExtrasPage } from './ExtrasPage';
import { SummaryPage } from './SummaryPage';
import { SummaryPanel } from './SummaryPanel';

export function CustomizationLayout() {
  const [currentStep, setCurrentStep] = useState<CustomizationStep>('model');
  const [completedSteps, setCompletedSteps] = useState<CustomizationStep[]>([]);
  const { state } = useCustomization();

  const handleStepComplete = (step: CustomizationStep) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  const handleNext = () => {
    handleStepComplete(currentStep);
    
    const steps: CustomizationStep[] = ['model', 'interiores', 'cocina', 'banos', 'closets', 'extras', 'resumen'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleStepClick = (step: CustomizationStep) => {
    setCurrentStep(step);
  };

  const handleBackToStart = () => {
    setCurrentStep('model');
    setCompletedSteps([]);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'model':
        return <ModelSelectionPage onNext={handleNext} />;
      case 'interiores':
        return <InteriorColorsPage onNext={handleNext} />;
      case 'cocina':
        return <KitchenPage onNext={handleNext} />;
      case 'banos':
        return <BathroomPage onNext={handleNext} />;
      case 'closets':
        return <ClosetsPage onNext={handleNext} />;
      case 'extras':
        return <ExtrasPage onNext={handleNext} />;
      case 'resumen':
        return <SummaryPage onNext={handleBackToStart} />;
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
                <h1 className="text-xl font-bold text-gray-900">Customs Siicumbres</h1>
                <p className="text-sm text-gray-600">Personaliza tu hogar ideal</p>
              </div>
            </div>
            {state.selectedModel && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Modelo seleccionado:</div>
                <div className="font-semibold text-gray-900">{state.selectedModel.name}</div>
              </div>
            )}
          </div>
        </div>
      </header>

      <CustomizationStepper
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      <div className="flex">
        <main className="flex-1 min-h-screen">
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

        <aside className="w-80 bg-white border-l border-gray-200 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
          <SummaryPanel />
        </aside>
      </div>
    </div>
  );
}