import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageModal } from './ImageModal';
import { ImageWithFallback } from './ImageWithFallback';
import type { CustomizationOption } from '../types';
import { useSubcategoryConfig } from '../hooks/useSubcategoryConfig';

interface OptionCardProps {
  option: CustomizationOption;
  isSelected: boolean;
  onSelect: (option: CustomizationOption) => void;
}

export function OptionCard({ option, isSelected, onSelect }: OptionCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { isSubcategoryOptional } = useSubcategoryConfig();

  // Check if this subcategory is optional using dynamic configuration
  const isOptional = option.subcategory ? isSubcategoryOptional(option.subcategory) : false;

  const handleZoomClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection
    setShowModal(true);
  };

  return (
    <>
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`
        relative cursor-pointer rounded-lg overflow-hidden shadow-md transition-all duration-300
        ${isSelected
          ? 'ring-3 ring-corporate-500 shadow-lg'
          : 'hover:shadow-lg border border-gray-200 hover:border-gray-300'
        }
      `}
      onClick={() => onSelect(option)}
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center relative group overflow-hidden">
        {/* Imagen con fallback automático */}
        <ImageWithFallback
          src={option.image}
          alt={option.name}
          fallbackType="icon"
          fallbackText={option.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Badge de tipo de acabado (Color o Madera) */}
        {(option.category === 'interior' || option.category === 'wood') && (
          <div className="absolute top-2 left-2">
            <span className={`
              text-xs font-semibold px-2 py-1 rounded-md shadow-sm
              ${option.category === 'wood'
                ? 'bg-amber-600 text-white'
                : 'bg-blue-600 text-white'
              }
            `}>
              {option.category === 'wood' ? '🪵 Madera' : '🎨 Color'}
            </span>
          </div>
        )}

        {/* Botón de zoom */}
        <button
          onClick={handleZoomClick}
          className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-lg p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label="Ampliar imagen"
        >
          <svg
            className="w-4 h-4 text-corporate-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
            />
          </svg>
        </button>
      </div>
      
      <div className="p-3">
        <div className="flex flex-col items-center justify-center gap-1 mb-1">
          <h4 className="font-medium text-sm text-corporate-800 text-center">{option.name}</h4>

          {/* Mostrar tipo de acabado para interiores */}
          {(option.category === 'interior' || option.category === 'wood') && (
            <span className={`
              text-xs font-medium px-2 py-0.5 rounded-full
              ${option.category === 'wood'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-blue-100 text-blue-700'
              }
            `}>
              {option.category === 'wood' ? 'Acabado en Madera' : 'Color'}
            </span>
          )}

          {isOptional && (
            <span className="text-xs bg-corporate-100 text-corporate-700 px-1.5 py-0.5 rounded-full font-medium">
              Opcional
            </span>
          )}
        </div>
        {option.price && (
          <p className="text-xs text-corporate-600 text-center">
            ${option.price.toLocaleString()}
          </p>
        )}
      </div>
      
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 left-2 bg-corporate-500 text-white rounded-full p-1.5"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </motion.div>

    <ImageModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      option={option}
    />
    </>
  );
}