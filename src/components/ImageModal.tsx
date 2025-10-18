import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CustomizationOption } from '../types';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  option: CustomizationOption | null;
}

export function ImageModal({ isOpen, onClose, option }: ImageModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!option) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{option.name}</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Cerrar"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Image Container */}
              <div className="relative bg-gray-100 flex items-center justify-center" style={{ minHeight: '400px' }}>
                {option.image ? (
                  <img
                    src={option.image}
                    alt={option.name}
                    className="max-w-full max-h-[calc(90vh-120px)] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.nextElementSibling;
                      if (placeholder) {
                        placeholder.classList.remove('hidden');
                      }
                    }}
                  />
                ) : null}

                {/* Placeholder */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center text-gray-400 ${option.image ? 'hidden' : ''}`}>
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-lg font-medium">Vista previa de {option.name}</p>
                  <p className="text-sm mt-2">Imagen no disponible</p>
                </div>
              </div>

              {/* Footer with details */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    {option.category && (
                      <span className="text-sm text-gray-500 capitalize">
                        {option.category} {option.subcategory && `- ${option.subcategory}`}
                      </span>
                    )}
                    {option.price && (
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        ${option.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}