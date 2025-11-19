import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CustomizationOption, OptionImage } from '../types';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  option: CustomizationOption | null;
}

export function ImageModal({ isOpen, onClose, option }: ImageModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Construir array de imágenes (con fallback a imagen antigua)
  const images: OptionImage[] = option?.images && option.images.length > 0
    ? option.images
    : option?.image
    ? [{
        url: option.image,
        thumbnail: option.image,
        is_primary: true,
        display_order: 0
      }]
    : [];

  const hasMultipleImages = images.length > 1;

  // Resetear índice cuando cambie la opción
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [option?.id]);

  // Close modal on escape key and handle arrow navigation
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasMultipleImages) {
        setCurrentImageIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight' && hasMultipleImages) {
        setCurrentImageIndex(prev => Math.min(images.length - 1, prev + 1));
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyboard);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyboard);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, hasMultipleImages, images.length]);

  const previousImage = () => {
    setCurrentImageIndex(prev => Math.max(0, prev - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => Math.min(images.length - 1, prev + 1));
  };

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
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-zinc-900 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="bg-zinc-800 px-6 py-4 border-b border-zinc-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-corporate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-white">{option.name}</h3>
                  {hasMultipleImages && (
                    <span className="bg-corporate-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      {images.length} imágenes
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                  aria-label="Cerrar"
                >
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Image Container with Carousel */}
              <div className="relative bg-black flex items-center justify-center" style={{ minHeight: '500px', maxHeight: '65vh' }}>
                {images.length > 0 ? (
                  <>
                    {/* Main Image */}
                    <motion.img
                      key={currentImageIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      src={images[currentImageIndex].url}
                      alt={`${option.name} - Imagen ${currentImageIndex + 1}`}
                      className="max-w-full max-h-[65vh] object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />

                    {/* Primary Badge */}
                    {images[currentImageIndex].is_primary && (
                      <div className="absolute top-4 left-4 bg-corporate-600 text-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium">Principal</span>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    {hasMultipleImages && (
                      <>
                        {/* Previous Button */}
                        <button
                          onClick={previousImage}
                          disabled={currentImageIndex === 0}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                          aria-label="Imagen anterior"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {/* Next Button */}
                        <button
                          onClick={nextImage}
                          disabled={currentImageIndex === images.length - 1}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                          aria-label="Imagen siguiente"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        {/* Position Indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  /* Placeholder */
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-lg font-medium">Vista previa de {option.name}</p>
                    <p className="text-sm mt-2">Imagen no disponible</p>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {hasMultipleImages && (
                <div className="bg-zinc-800 border-t border-zinc-700 px-6 py-4 overflow-x-auto">
                  <div className="flex gap-3 justify-start">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                          currentImageIndex === index
                            ? 'ring-3 ring-corporate-500 opacity-100'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={image.thumbnail}
                          alt={`Miniatura ${index + 1}`}
                          className="w-20 h-20 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = image.url; // Fallback to full URL
                          }}
                        />
                        {image.is_primary && (
                          <div className="absolute top-1 right-1 bg-corporate-600 rounded-full p-1">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer with details */}
              <div className="bg-zinc-800 px-6 py-4 border-t border-zinc-700">
                <div className="flex items-center justify-between">
                  <div>
                    {option.category && (
                      <span className="text-sm text-gray-400 capitalize">
                        {option.category} {option.subcategory && `- ${option.subcategory}`}
                      </span>
                    )}
                    {option.price && (
                      <p className="text-xl font-semibold text-white mt-1">
                        ${option.price.toLocaleString()} MXN
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
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