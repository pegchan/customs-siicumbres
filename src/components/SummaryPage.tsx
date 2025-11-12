import { motion } from 'framer-motion';
import { useCustomization } from '../context/CustomizationContext';
import { formatDisplayName } from '../utils/backendNavigator';

interface SummaryPageProps {
  onNext?: () => void;
  onShowPreview?: () => void;
}

export function SummaryPage({ onNext, onShowPreview }: SummaryPageProps) {
  const { state, resetCustomization } = useCustomization();

  const handleStartOver = () => {
    resetCustomization();
    if (onNext) onNext();
  };

  const handleGenerateFormat = () => {
    if (onShowPreview) {
      onShowPreview();
    }
  };

  const getCompletionStats = () => {
    let totalSelections = 0;
    let completedSelections = 0;

    // Count model
    totalSelections++;
    if (state.selectedModel) completedSelections++;

    // Count interiors
    const interiorKeys = Object.keys(state.interiores);
    totalSelections += interiorKeys.length;
    completedSelections += Object.values(state.interiores).filter(Boolean).length;

    // Count kitchen
    const kitchenKeys = Object.keys(state.cocina);
    totalSelections += kitchenKeys.length;
    completedSelections += Object.values(state.cocina).filter(Boolean).length;

    // Count bathrooms
    const bathroomKeys = Object.keys(state.banos);
    totalSelections += bathroomKeys.length;
    completedSelections += Object.values(state.banos).filter(Boolean).length;

    // Count closets
    const closetKeys = Object.keys(state.closets);
    totalSelections += closetKeys.length;
    completedSelections += Object.values(state.closets).filter(Boolean).length;

    // Count dynamic selections
    if (state.dynamicSelections) {
      Object.values(state.dynamicSelections).forEach(categorySelections => {
        Object.values(categorySelections).forEach(subcategorySelections => {
          Object.values(subcategorySelections).forEach(areaSelection => {
            totalSelections++;
            if (areaSelection) completedSelections++;
          });
        });
      });
    }

    return { totalSelections, completedSelections };
  };

  const { totalSelections, completedSelections } = getCompletionStats();
  const completionPercentage = Math.round((completedSelections / totalSelections) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Resumen de Personalización
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Revisa todas tus selecciones antes de generar el formato final de personalización.
        </motion.p>
      </div>

      {/* Completion Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-corporate-50 to-corporate-100 rounded-xl p-6 mb-8 border border-corporate-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Estado de Personalización</h2>
          <span className="text-2xl font-bold text-corporate-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-corporate-200 rounded-full h-3 mb-2">
          <div 
            className="bg-corporate-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-sm text-corporate-600">
          {completedSelections} de {totalSelections} elementos personalizados
        </p>
      </motion.div>

      {/* Model Summary */}
      {state.selectedModel && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🏠</span>
            Modelo de Casa Seleccionado
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-xl text-gray-900 mb-2">{state.selectedModel.name}</h4>
            <p className="text-gray-600">{state.selectedModel.description}</p>
          </div>
        </motion.div>
      )}

      {/* Selections Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interiores */}
        {Object.values(state.interiores).some(Boolean) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🎨</span>
              Colores de Interiores
            </h3>
            <div className="space-y-3">
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
                  <div key={room} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">{roomNames[room]}</span>
                    <span className="font-medium text-gray-900">{selection.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Cocina */}
        {Object.values(state.cocina).some(Boolean) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🍳</span>
              Cocina
            </h3>
            <div className="space-y-3">
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
                  <div key={item} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">{itemNames[item]}</span>
                    <span className="font-medium text-gray-900">{selection.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Baños */}
        {Object.values(state.banos).some(Boolean) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🚿</span>
              Baños
            </h3>
            <div className="space-y-3">
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
                  <div key={item} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">{itemNames[item]}</span>
                    <span className="font-medium text-gray-900">{selection.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Closets */}
        {Object.values(state.closets).some(Boolean) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">💼</span>
              Closets
            </h3>
            <div className="space-y-3">
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
                  <div key={item} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-gray-600">{itemNames[item]}</span>
                    <span className="font-medium text-gray-900">{selection.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Dynamic Selections - All backend categories */}
        {state.dynamicSelections && Object.entries(state.dynamicSelections).map(([categoryId, categorySelections], catIndex) => {
          const hasSelections = Object.values(categorySelections).some(subcategorySelections =>
            Object.values(subcategorySelections).some(selection => selection !== null)
          );

          if (!hasSelections) return null;

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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + (catIndex * 0.1) }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">{categoryIcons[categoryId] || '📦'}</span>
                {formatDisplayName(categoryId)}
              </h3>
              <div className="space-y-3">
                {Object.entries(categorySelections).map(([subcategoryId, subcategorySelections]) => {
                  return Object.entries(subcategorySelections).map(([areaId, selection]) => {
                    if (!selection) return null;
                    return (
                      <div key={`${subcategoryId}-${areaId}`} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0 gap-2">
                        <span className="text-gray-600 text-sm">
                          {formatDisplayName(subcategoryId)} - {formatDisplayName(areaId)}
                        </span>
                        <span className="font-medium text-gray-900 text-right flex-shrink-0">{selection.name}</span>
                      </div>
                    );
                  });
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
      >
        <button
          onClick={handleGenerateFormat}
          className="bg-corporate-600 hover:bg-corporate-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          📄 Previsualizar y Generar PDF
        </button>
        
        <button
          onClick={handleStartOver}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          🔄 Comenzar de Nuevo
        </button>
      </motion.div>
    </motion.div>
  );
}