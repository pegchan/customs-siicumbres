import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from './ImageWithFallback';
import type { HouseModel } from '../types';

interface ModelImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: HouseModel;
}

export function ModelImageModal({ isOpen, onClose, model }: ModelImageModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Construir array de imágenes disponibles
  const images: Array<{ url: string; label: string }> = [];

  if (model.image) {
    images.push({ url: model.image, label: 'Modelo' });
  }

  if (model.floorPlans.plantaBaja) {
    images.push({ url: model.floorPlans.plantaBaja, label: 'Planta Baja' });
  }

  if (model.floorPlans.plantaAlta) {
    images.push({ url: model.floorPlans.plantaAlta, label: 'Planta Alta' });
  }

  const currentImage = images[currentImageIndex];
  const hasMultipleImages = images.length > 1;

  // Reset zoom y posición al cambiar de imagen
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentImageIndex]);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Zoom In/Out
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Zoom con scroll del mouse
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Drag para mover imagen cuando está en zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Cerrar con tecla Escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && hasMultipleImages) {
      handlePrevious();
    } else if (e.key === 'ArrowRight' && hasMultipleImages) {
      handleNext();
    }
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-20"
          aria-label="Cerrar"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Controles de zoom */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          <button
            onClick={handleZoomIn}
            disabled={scale >= 3}
            className="bg-white/90 hover:bg-white text-gray-900 rounded-lg p-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom in"
            title="Zoom in"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            disabled={scale <= 1}
            className="bg-white/90 hover:bg-white text-gray-900 rounded-lg p-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom out"
            title="Zoom out"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          {scale > 1 && (
            <button
              onClick={handleResetZoom}
              className="bg-white/90 hover:bg-white text-gray-900 rounded-lg p-2 shadow-lg transition-all"
              aria-label="Reset zoom"
              title="Resetear zoom"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>

        {/* Indicador de zoom */}
        {scale > 1 && (
          <div className="absolute top-4 right-20 bg-white/90 text-gray-900 rounded-lg px-3 py-2 shadow-lg z-20">
            <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
          </div>
        )}

        {/* Contenedor de imagen */}
        <div className="relative w-full max-w-6xl">
          {/* Título y contador */}
          <div className="text-center mb-4">
            <h3 className="text-white text-2xl font-bold mb-2">{model.name}</h3>
            <p className="text-gray-300 text-lg">{currentImage.label}</p>
            {hasMultipleImages && (
              <p className="text-gray-400 text-sm mt-2">
                {currentImageIndex + 1} de {images.length}
              </p>
            )}
          </div>

          {/* Imagen principal */}
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            ref={imageContainerRef}
            className="relative bg-white rounded-lg overflow-hidden"
            style={{
              maxHeight: '70vh',
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                transformOrigin: 'center center',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ImageWithFallback
                src={currentImage.url}
                alt={`${model.name} - ${currentImage.label}`}
                fallbackType="text"
                fallbackText={currentImage.label}
                className="w-full h-full object-contain"
                style={{
                  maxHeight: '70vh',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </motion.div>

          {/* Controles de navegación */}
          {hasMultipleImages && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all"
                aria-label="Imagen anterior"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 shadow-lg transition-all"
                aria-label="Imagen siguiente"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Thumbnails */}
          {hasMultipleImages && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${index === currentImageIndex
                      ? 'bg-corporate-600 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                    }
                  `}
                >
                  {img.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
