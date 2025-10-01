import { motion } from 'framer-motion';
import type { CustomizationOption } from '../types';

interface OptionCardProps {
  option: CustomizationOption;
  isSelected: boolean;
  onSelect: (option: CustomizationOption) => void;
}

export function OptionCard({ option, isSelected, onSelect }: OptionCardProps) {

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`
        relative cursor-pointer rounded-lg overflow-hidden shadow-md transition-all duration-300
        ${isSelected
          ? 'ring-4 ring-blue-500 shadow-lg'
          : 'hover:shadow-lg border border-gray-200 hover:border-gray-300'
        }
      `}
      onClick={() => onSelect(option)}
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
        {/* Placeholder para imagen */}
        <div className="text-gray-400 text-center">
          <div className="text-3xl mb-2">🎨</div>
          <div className="text-xs font-medium px-2">{option.name}</div>
        </div>

        {/* Overlay para imagen real cuando esté disponible */}
        {option.image && (
          <img
            src={option.image}
            alt={option.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              // Si la imagen falla, ocultar el elemento img para mostrar el placeholder
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </div>

      <div className="p-3">
        <h4 className="font-medium text-sm text-gray-800 text-center mb-1">{option.name}</h4>
        {option.price && (
          <p className="text-xs text-gray-600 text-center">
            ${option.price.toLocaleString()}
          </p>
        )}
      </div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1.5"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}