/**
 * Componente genérico para renderizar cualquier categoría dinámicamente
 * Lee la estructura completa del backend sin hardcodear nada
 */

import { useCustomization } from '../context/CustomizationContext';
import { getCategoryStructure, formatDisplayName } from '../utils/backendNavigator';
import { HorizontalOptionGrid } from './HorizontalOptionGrid';
import { useAutoScroll } from '../hooks/useAutoScroll';

interface GenericCategoryPageProps {
  categoryId: string;
  onNext: () => void;
}

export function GenericCategoryPage({ categoryId, onNext }: GenericCategoryPageProps) {
  const { backendCatalog, setDynamicOption, getDynamicOption } = useCustomization();
  const { scrollToNextSection, scrollToTop } = useAutoScroll();

  // Obtener estructura completa de la categoría
  const categoryStructure = getCategoryStructure(backendCatalog, categoryId);

  if (!categoryStructure || categoryStructure.subcategories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            No hay opciones disponibles para esta categoría.
          </p>
          <button
            onClick={onNext}
            className="bg-corporate-600 hover:bg-corporate-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {formatDisplayName(categoryId)}
        </h2>
        <p className="text-lg text-gray-600">
          Selecciona las opciones para personalizar
        </p>
      </div>

      {/* Renderizar todas las subcategorías */}
      {categoryStructure.subcategories.map((subcategory, subcatIndex) => {
        // Calcular índice global para auto-scroll
        const subcatAreasBeforeThis = categoryStructure.subcategories
          .slice(0, subcatIndex)
          .reduce((acc, sub) => acc + sub.areas.length, 0);

        return (
          <div key={subcategory.subcategoryId} className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {formatDisplayName(subcategory.subcategoryId)}
            </h3>

            {/* Renderizar todas las áreas de la subcategoría */}
            {subcategory.areas.map((area, areaIndex) => {
              // Calcular índice global de la sección para auto-scroll
              const globalSectionIndex = subcatAreasBeforeThis + areaIndex;

              return (
                <div key={area.areaId} className="mb-8">
                  {/* Mostrar título del área solo si hay múltiples áreas */}
                  {subcategory.hasAreas && subcategory.areas.length > 1 && (
                    <h4 className="text-xl font-semibold text-gray-700 mb-4">
                      {formatDisplayName(area.areaId)}
                    </h4>
                  )}

                  {/* Renderizar opciones */}
                  {area.options.length > 0 ? (
                    <HorizontalOptionGrid
                      options={area.options}
                      selectedOption={getDynamicOption(categoryId, subcategory.subcategoryId, area.areaId)}
                      sectionIndex={globalSectionIndex}
                      onSelect={(option) => {
                        console.log(`[GenericCategoryPage] Seleccionado:`, {
                          category: categoryId,
                          subcategory: subcategory.subcategoryId,
                          area: area.areaId,
                          option: option.name,
                        });
                        // Guardar selección en el estado global
                        setDynamicOption(categoryId, subcategory.subcategoryId, area.areaId, option);
                        // Auto-scroll a la siguiente sección
                        scrollToNextSection(globalSectionIndex);
                      }}
                    />
                  ) : (
                    <p className="text-gray-500 italic">
                      No hay opciones disponibles para {formatDisplayName(area.areaId)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Botón de continuar */}
      <div className="mt-12 text-center">
        <button
          onClick={() => {
            scrollToTop();
            setTimeout(() => {
              onNext();
            }, 300); // Pequeño delay para transición suave
          }}
          className="bg-corporate-600 hover:bg-corporate-700 text-white font-semibold py-4 px-12 rounded-lg transition-colors text-lg"
        >
          Continuar al siguiente paso
        </button>
      </div>
    </div>
  );
}
