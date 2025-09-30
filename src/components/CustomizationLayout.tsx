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
import { DocumentPreviewPage } from './DocumentPreviewPage';
import { SummaryPanel } from './SummaryPanel';
import { SubcategoryConfigManager } from './SubcategoryConfigManager';
import { pdfGeneratorService } from '../services/pdfGeneratorService';
import type { SignatureData } from './DigitalSignature';

export function CustomizationLayout() {
  const [currentStep, setCurrentStep] = useState<CustomizationStep>('model');
  const [completedSteps, setCompletedSteps] = useState<CustomizationStep[]>([]);
  const [showConfigManager, setShowConfigManager] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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
    setShowPreview(false); // Salir del preview al cambiar de paso
  };

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  const handleBackFromPreview = () => {
    setShowPreview(false);
  };

  const handleGeneratePDF = async (signatureData?: SignatureData) => {
    try {
      await pdfGeneratorService.generatePDF(state, signatureData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor intenta de nuevo.');
    }
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
        return <SummaryPage onNext={handleBackToStart} onShowPreview={handleShowPreview} />;
      default:
        return <ModelSelectionPage onNext={handleNext} />;
    }
  };

  // Si estamos en modo preview, mostrar la página de preview
  if (showPreview) {
    return (
      <DocumentPreviewPage
        onBack={handleBackFromPreview}
        onGeneratePDF={handleGeneratePDF}
      />
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-corporate-500">🏠</div>
              <div>
                <h1 className="text-xl font-bold text-corporate-800">Personalizaciones  Cumbres Leon</h1>
                <p className="text-sm text-corporate-600">Personaliza tu hogar ideal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Config Manager Button */}
              <button
                onClick={() => setShowConfigManager(true)}
                className="p-2 text-corporate-600 hover:text-corporate-800 hover:bg-corporate-50 rounded-lg transition-colors"
                title="Configuración de Subcategorías"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              {state.selectedModel && (
                <div className="text-right">
                  <div className="text-sm text-corporate-600">Modelo seleccionado:</div>
                  <div className="font-semibold text-corporate-800">{state.selectedModel.name}</div>
                </div>
              )}
            </div>
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

      {/* Subcategory Configuration Manager */}
      <SubcategoryConfigManager
        isOpen={showConfigManager}
        onClose={() => setShowConfigManager(false)}
      />
    </div>
  );
}