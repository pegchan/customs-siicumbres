import { motion } from 'framer-motion';
import { ImageWithFallback } from './ImageWithFallback';
import type { HouseModel } from '../types';

interface HouseModelCardProps {
  model: HouseModel;
  isSelected: boolean;
  onSelect: (model: HouseModel) => void;
}

export function HouseModelCard({ model, isSelected, onSelect }: HouseModelCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all duration-300
        ${isSelected
          ? 'ring-4 ring-corporate-500 shadow-xl'
          : 'hover:shadow-xl border border-gray-200'
        }
      `}
      onClick={() => onSelect(model)}
    >
      <div className="aspect-video bg-gray-100 overflow-hidden">
        <ImageWithFallback
          src={model.image}
          alt={model.name}
          fallbackType="text"
          fallbackText={model.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{model.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{model.description}</p>
        
        {model.floorPlans.plantaAlta && (
          <div className="flex gap-2 text-xs text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded">2 Plantas</span>
          </div>
        )}
        
        {!model.floorPlans.plantaAlta && (
          <div className="flex gap-2 text-xs text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded">1 Planta</span>
          </div>
        )}
      </div>
      
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 right-2 bg-corporate-500 text-white rounded-full p-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}