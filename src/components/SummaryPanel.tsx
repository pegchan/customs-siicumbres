import { motion } from 'framer-motion';
import { useCustomization } from '../context/CustomizationContext';
import { formatDisplayName } from '../utils/backendNavigator';

export function SummaryPanel() {
  const { state } = useCustomization();

  const countSelections = () => {
    let count = 0;
    if (state.selectedModel) count++;

    Object.values(state.interiores).forEach(selection => {
      if (selection) count++;
    });

    Object.values(state.cocina).forEach(selection => {
      if (selection) count++;
    });

    Object.values(state.banos).forEach(selection => {
      if (selection) count++;
    });

    Object.values(state.closets).forEach(selection => {
      if (selection) count++;
    });

    // Contar selecciones dinámicas
    if (state.dynamicSelections) {
      Object.values(state.dynamicSelections).forEach(categorySelections => {
        Object.values(categorySelections).forEach(subcategorySelections => {
          Object.values(subcategorySelections).forEach(areaSelection => {
            if (areaSelection) count++;
          });
        });
      });
    }

    return count;
  };

  const totalSelections = countSelections();

  return (
    <div className="p-6 h-full">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="sticky top-0"
      >
        <h2 className="text-lg font-bold text-corporate-800 mb-4 flex items-center">
          <span className="mr-2">📝</span>
          Resumen de Personalización
        </h2>
        
        <div className="bg-corporate-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-corporate-600 font-medium mb-1">
            Selecciones realizadas
          </div>
          <div className="text-2xl font-bold text-corporate-700">
            {totalSelections}
          </div>
        </div>

        <div className="space-y-6">
          {/* Modelo de Casa */}
          {state.selectedModel && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-gray-200 pb-4"
            >
              <h3 className="font-semibold text-corporate-800 mb-2 flex items-center">
                <span className="mr-2">🏠</span>
                Modelo de Casa
              </h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-corporate-800">{state.selectedModel.name}</div>
                <div className="text-sm text-corporate-600">{state.selectedModel.description}</div>
              </div>
            </motion.div>
          )}

          {/* Interiores */}
          {Object.entries(state.interiores).some(([, selection]) => selection !== null) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-gray-200 pb-4"
            >
              <h3 className="font-semibold text-corporate-800 mb-2 flex items-center">
                <span className="mr-2">🎨</span>
                Colores de Interiores
              </h3>
              <div className="space-y-2">
                {Object.entries(state.interiores).map(([room, selection]) => {
                  if (!selection) return null;
                  
                  const roomNames: Record<string, string> = {
                    sala: 'Sala',
                    comedor: 'Comedor',
                    recamara1: 'Recámara Principal',
                    recamara2: 'Recámara 2',
                    recamara3: 'Recámara 3',
                    escaleras: 'Escaleras',
                  };
                  
                  return (
                    <div key={room} className="flex justify-between items-center text-sm">
                      <span className="text-corporate-600">{roomNames[room]}:</span>
                      <span className="font-medium text-corporate-800">{selection.name}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Cocina */}
          {Object.entries(state.cocina).some(([, selection]) => selection !== null) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-gray-200 pb-4"
            >
              <h3 className="font-semibold text-corporate-800 mb-2 flex items-center">
                <span className="mr-2">🍳</span>
                Cocina
              </h3>
              <div className="space-y-2">
                {Object.entries(state.cocina).map(([item, selection]) => {
                  if (!selection) return null;
                  
                  const itemNames: Record<string, string> = {
                    alacenaSuperior: 'Alacena Superior',
                    alacenaInferior: 'Alacena Inferior',
                    alacenaBarraL: 'Barra en L',
                    alacenaExtra: 'Alacena Extra',
                    cubierta: 'Cubierta',
                    backsplash: 'Backsplash',
                    tarja: 'Tarja',
                  };
                  
                  return (
                    <div key={item} className="flex justify-between items-center text-sm">
                      <span className="text-corporate-600">{itemNames[item]}:</span>
                      <span className="font-medium text-corporate-800">{selection.name}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Baños */}
          {Object.entries(state.banos).some(([, selection]) => selection !== null) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-gray-200 pb-4"
            >
              <h3 className="font-semibold text-corporate-800 mb-2 flex items-center">
                <span className="mr-2">🚿</span>
                Baños
              </h3>
              <div className="space-y-2">
                {Object.entries(state.banos).map(([item, selection]) => {
                  if (!selection) return null;
                  
                  const itemNames: Record<string, string> = {
                    muebleBanoA: 'Mueble Baño A',
                    muebleBanoB: 'Mueble Baño B',
                    muebleBanoC: 'Mueble Baño C',
                    colorMueble: 'Color Mueble',
                    acabadoCanceles: 'Acabado Canceles',
                  };
                  
                  return (
                    <div key={item} className="flex justify-between items-center text-sm">
                      <span className="text-corporate-600">{itemNames[item]}:</span>
                      <span className="font-medium text-corporate-800">{selection.name}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Closets */}
          {Object.entries(state.closets).some(([, selection]) => selection !== null) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-gray-200 pb-4"
            >
              <h3 className="font-semibold text-corporate-800 mb-2 flex items-center">
                <span className="mr-2">💼</span>
                Closets
              </h3>
              <div className="space-y-2">
                {Object.entries(state.closets).map(([item, selection]) => {
                  if (!selection) return null;

                  const itemNames: Record<string, string> = {
                    recamara1: 'Closet Recámara 1',
                    recamara2: 'Closet Recámara 2',
                    recamara3: 'Closet Recámara 3',
                    muebleBajoEscalera: 'Mueble Bajo Escalera',
                    puertasMarcoEscalera: 'Puertas Marco Escalera',
                  };

                  return (
                    <div key={item} className="flex justify-between items-center text-sm">
                      <span className="text-corporate-600">{itemNames[item]}:</span>
                      <span className="font-medium text-corporate-800">{selection.name}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Selecciones Dinámicas - Todas las categorías del backend */}
          {state.dynamicSelections && Object.entries(state.dynamicSelections).map(([categoryId, categorySelections]) => {
            // Verificar si hay selecciones en esta categoría
            const hasSelections = Object.values(categorySelections).some(subcategorySelections =>
              Object.values(subcategorySelections).some(selection => selection !== null)
            );

            if (!hasSelections) return null;

            // Iconos por categoría
            const categoryIcons: Record<string, string> = {
              interiores: '🎨',
              cocina: '🍳',
              banos: '🚿',
              closets: '💼',
              extras: '✨',
            };

            return (
              <motion.div
                key={categoryId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-gray-200 pb-4"
              >
                <h3 className="font-semibold text-corporate-800 mb-2 flex items-center">
                  <span className="mr-2">{categoryIcons[categoryId] || '📦'}</span>
                  {formatDisplayName(categoryId)}
                </h3>
                <div className="space-y-2">
                  {Object.entries(categorySelections).map(([subcategoryId, subcategorySelections]) => {
                    return Object.entries(subcategorySelections).map(([areaId, selection]) => {
                      if (!selection) return null;

                      return (
                        <div key={`${subcategoryId}-${areaId}`} className="flex justify-between items-start text-sm gap-2">
                          <span className="text-corporate-600 text-xs">
                            {formatDisplayName(subcategoryId)} - {formatDisplayName(areaId)}:
                          </span>
                          <span className="font-medium text-corporate-800 text-right flex-shrink-0">
                            {selection.name}
                          </span>
                        </div>
                      );
                    });
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {totalSelections > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-corporate-600 text-sm">
              <p>💡 Ve al paso de <strong>Resumen</strong> para previsualizar y generar tu PDF personalizado</p>
            </div>
          </div>
        )}

        {totalSelections === 0 && (
          <div className="text-center text-corporate-500 mt-8">
            <div className="text-4xl mb-2">🏠</div>
            <p className="text-sm">
              Comienza seleccionando un modelo de casa para ver tu resumen aquí.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}