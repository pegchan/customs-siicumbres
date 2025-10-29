/**
 * Componente de imagen con fallback automático
 * Muestra un placeholder cuando la imagen no está disponible o falla al cargar
 */

import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

interface ImageWithFallbackProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError' | 'src'> {
  src?: string | null;
  alt: string;
  fallbackType?: 'placeholder' | 'text' | 'icon';
  fallbackText?: string;
  fallbackClassName?: string;
}

export const ImageWithFallback = ({
  src,
  alt,
  fallbackType = 'placeholder',
  fallbackText,
  fallbackClassName = '',
  className = '',
  ...props
}: ImageWithFallbackProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Si no hay src o hubo error, mostrar fallback
  const shouldShowFallback = !src || imageError;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`[ImageWithFallback] ❌ Error cargando imagen:`, {
      src,
      alt,
      error: e,
      naturalWidth: e.currentTarget.naturalWidth,
      naturalHeight: e.currentTarget.naturalHeight,
    });
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log(`[ImageWithFallback] ✅ Imagen cargada exitosamente:`, {
      alt,
      src: src?.substring(0, 60) + '...',
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight,
    });
    setIsLoading(false);
  };

  if (shouldShowFallback) {
    // Renderizar diferentes tipos de fallback
    switch (fallbackType) {
      case 'text':
        return (
          <div
            className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${fallbackClassName} ${className}`}
            role="img"
            aria-label={alt}
          >
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🏠</div>
              <p className="text-sm text-gray-600 font-medium">
                {fallbackText || alt}
              </p>
              <p className="text-xs text-gray-400 mt-1">Imagen no disponible</p>
            </div>
          </div>
        );

      case 'icon':
        return (
          <div
            className={`flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 ${fallbackClassName} ${className}`}
            role="img"
            aria-label={alt}
          >
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs text-gray-500 mt-2">{fallbackText || 'Sin imagen'}</p>
            </div>
          </div>
        );

      case 'placeholder':
      default:
        // Usar servicio de placeholders con el nombre de la opción
        const encodedText = encodeURIComponent(fallbackText || alt || 'Imagen');
        const placeholderUrl = `https://via.placeholder.com/400x300/e5e7eb/6b7280?text=${encodedText}`;

        return (
          <img
            src={placeholderUrl}
            alt={alt}
            className={className}
            {...props}
          />
        );
    }
  }

  return (
    <>
      {/* Skeleton loader mientras carga - se oculta cuando termina */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          aria-label="Cargando imagen..."
          style={{ zIndex: 5 }}
        />
      )}

      {/* Imagen real - visible cuando carga */}
      <img
        src={src}
        alt={alt}
        onError={handleImageError}
        onLoad={handleImageLoad}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        {...props}
      />
    </>
  );
};

export default ImageWithFallback;
