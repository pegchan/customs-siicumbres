import { motion } from 'framer-motion';
import type { CustomizationStep } from '../types';

interface Step {
  id: CustomizationStep;
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    id: 'model',
    title: 'Modelo',
    description: 'Selecciona tu casa',
    icon: '🏠',
  },
  {
    id: 'interiores',
    title: 'Interiores',
    description: 'Colores de habitaciones',
    icon: '🎨',
  },
  {
    id: 'cocina',
    title: 'Cocina',
    description: 'Alacenas y cubiertas',
    icon: '🍳',
  },
  {
    id: 'banos',
    title: 'Baños',
    description: 'Muebles y acabados',
    icon: '🚿',
  },
  {
    id: 'closets',
    title: 'Closets',
    description: 'Acabados de madera',
    icon: '💼',
  },
  {
    id: 'extras',
    title: 'Extras',
    description: 'Fachada y accesorios',
    icon: '✨',
  },
  {
    id: 'resumen',
    title: 'Resumen',
    description: 'Revisa tu selección',
    icon: '📝',
  },
];

interface CustomizationStepperProps {
  currentStep: CustomizationStep;
  completedSteps: CustomizationStep[];
  onStepClick: (step: CustomizationStep) => void;
}

export function CustomizationStepper({ currentStep, completedSteps, onStepClick }: CustomizationStepperProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between overflow-x-auto">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStep;
            const isAccessible = index <= currentStepIndex || isCompleted;

            return (
              <div key={step.id} className="flex items-center">
                <motion.button
                  whileHover={isAccessible ? { scale: 1.05 } : undefined}
                  whileTap={isAccessible ? { scale: 0.95 } : undefined}
                  onClick={() => isAccessible && onStepClick(step.id)}
                  disabled={!isAccessible}
                  className={`
                    flex flex-col items-center p-3 rounded-lg transition-all duration-200 min-w-[100px]
                    ${isCurrent 
                      ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-500' 
                      : isCompleted 
                      ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                      : isAccessible
                      ? 'text-gray-600 hover:bg-gray-50'
                      : 'text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <div className={`
                    text-2xl mb-1
                    ${isCurrent ? 'scale-110' : ''}
                  `}>
                    {isCompleted ? '✓' : step.icon}
                  </div>
                  <div className="text-xs font-medium text-center">
                    <div>{step.title}</div>
                    <div className="text-xs opacity-75">{step.description}</div>
                  </div>
                </motion.button>

                {index < steps.length - 1 && (
                  <div className={`
                    w-8 h-0.5 mx-2
                    ${index < currentStepIndex || isCompleted ? 'bg-green-400' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}