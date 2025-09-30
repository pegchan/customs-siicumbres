import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCustomization } from '../context/CustomizationContext';
import type { CustomizationOption } from '../types/index';
import { DigitalSignature } from './DigitalSignature';
import type { SignatureData } from './DigitalSignature';

interface DocumentPreviewPageProps {
  onBack: () => void;
  onGeneratePDF: (signatureData?: SignatureData) => void;
}

export function DocumentPreviewPage({ onBack, onGeneratePDF }: DocumentPreviewPageProps) {
  const { state } = useCustomization();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null);

  const handleSign = (signature: SignatureData) => {
    setSignatureData(signature);
    setIsSigned(true);
  };

  const handleGeneratePDF = async () => {
    if (!isSigned || !signatureData) {
      alert('Debes firmar el documento antes de generar el PDF');
      return;
    }

    setIsGenerating(true);
    try {
      await onGeneratePDF(signatureData);
      // Simulamos un delay para mostrar el estado de carga
      setTimeout(() => {
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
    }
  };

  const getSummaryData = () => {
    let totalSelections = 0;
    if (state.selectedModel) totalSelections++;
    
    // Contar todas las selecciones
    totalSelections += Object.values(state.interiores).filter(Boolean).length;
    totalSelections += Object.values(state.cocina).filter(Boolean).length;
    totalSelections += Object.values(state.banos).filter(Boolean).length;
    totalSelections += Object.values(state.closets).filter(Boolean).length;
    
    // Contar extras
    if (state.extras.colorFachada) totalSelections++;
    if (state.extras.minisplit) totalSelections++;
    if (state.extras.paneles) totalSelections++;
    if (state.extras.patio.estilo) totalSelections++;
    if (state.extras.patio.domo) totalSelections++;

    return { totalSelections };
  };

  const generateSectionItems = (section: Record<string, CustomizationOption | null>, labels: Record<string, string>) => {
    return Object.entries(section)
      .filter(([, value]) => value !== null)
      .map(([key, value]) => ({
        label: labels[key] || key,
        option: value as CustomizationOption
      }));
  };

  const summaryData = getSummaryData();
  const timestamp = new Date().toLocaleString('es-MX');

  // Definir etiquetas para cada sección
  const interiorLabels = {
    sala: 'Sala',
    comedor: 'Comedor',
    recamara1: 'Recámara Principal',
    recamara2: 'Recámara 2',
    recamara3: 'Recámara 3',
    escaleras: 'Escaleras'
  };

  const kitchenLabels = {
    alacenaSuperior: 'Alacena Superior',
    alacenaInferior: 'Alacena Inferior',
    alacenaBarraL: 'Alacena Barra L',
    alacenaExtra: 'Alacena Extra',
    cubierta: 'Cubierta',
    backsplash: 'Backsplash',
    tarja: 'Tarja'
  };

  const bathroomLabels = {
    muebleBanoA: 'Mueble Baño A',
    muebleBanoB: 'Mueble Baño B',
    muebleBanoC: 'Mueble Baño C',
    colorMueble: 'Color de Mueble',
    acabadoCanceles: 'Acabado Canceles'
  };

  const closetLabels = {
    recamara1: 'Closet Recámara 1',
    recamara2: 'Closet Recámara 2',
    recamara3: 'Closet Recámara 3',
    muebleBajoEscalera: 'Mueble Bajo Escalera',
    puertasMarcoEscalera: 'Puertas Marco Escalera'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-corporate-600 hover:text-corporate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Volver al Resumen</span>
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating || !isSigned}
                className={`font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 ${
                  isSigned 
                    ? 'bg-corporate-600 hover:bg-corporate-700 disabled:bg-corporate-400 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generando PDF...</span>
                  </>
                ) : isSigned ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Descargar PDF</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L13 12.586V9a1 1 0 10-2 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    </svg>
                    <span>Firmar para Descargar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-corporate-800 mb-2">
              Previsualización del Documento
            </h1>
            <p className="text-corporate-600">
              Revisa tu personalización antes de generar el PDF final
            </p>
          </div>
        </motion.div>

        {/* Document Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Document Header */}
          <div className="bg-gradient-to-r from-corporate-800 to-corporate-600 text-white p-8 text-center">
            <div className="text-4xl mb-4">🏠</div>
            <h1 className="text-2xl font-bold mb-2">Personalización de Vivienda</h1>
            <p className="text-corporate-100">Cumbres León - Proyecto Personalizado</p>
          </div>

          {/* Document Content */}
          <div className="p-8">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-corporate-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-corporate-600 mb-1">
                  {summaryData.totalSelections}
                </div>
                <div className="text-corporate-700 font-medium">Selecciones Realizadas</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-gray-600 mb-1">
                  {timestamp.split(' ')[0]}
                </div>
                <div className="text-gray-700 font-medium">Fecha de Personalización</div>
              </div>
            </div>

            {/* Model Section */}
            {state.selectedModel && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <div className="bg-gradient-to-r from-corporate-50 to-corporate-100 rounded-lg p-6 border-l-4 border-corporate-500">
                  <h2 className="text-xl font-bold text-corporate-800 mb-4 flex items-center">
                    <span className="mr-3">🏡</span>
                    Modelo de Casa
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-semibold text-corporate-700 mb-1">Modelo:</div>
                      <div className="text-corporate-800">{state.selectedModel.name}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-corporate-700 mb-1">Descripción:</div>
                      <div className="text-corporate-800">{state.selectedModel.description}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sections */}
            {generateSectionItems(state.interiores, interiorLabels).length > 0 && (
              <DocumentSection
                title="🎨 Interiores"
                items={generateSectionItems(state.interiores, interiorLabels)}
                delay={0.4}
              />
            )}

            {generateSectionItems(state.cocina, kitchenLabels).length > 0 && (
              <DocumentSection
                title="🍳 Cocina"
                items={generateSectionItems(state.cocina, kitchenLabels)}
                delay={0.5}
              />
            )}

            {generateSectionItems(state.banos, bathroomLabels).length > 0 && (
              <DocumentSection
                title="🚿 Baños"
                items={generateSectionItems(state.banos, bathroomLabels)}
                delay={0.6}
              />
            )}

            {generateSectionItems(state.closets, closetLabels).length > 0 && (
              <DocumentSection
                title="👔 Closets"
                items={generateSectionItems(state.closets, closetLabels)}
                delay={0.7}
              />
            )}

            {/* Extras Section */}
            {(state.extras.colorFachada || state.extras.minisplit || state.extras.paneles || state.extras.patio.estilo || state.extras.patio.domo) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-8"
              >
                <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-gray-400">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-3">✨</span>
                    Extras y Accesorios
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {state.extras.colorFachada && (
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Color de Fachada:</span>
                        <span className="text-gray-800">{state.extras.colorFachada.name}</span>
                      </div>
                    )}
                    {state.extras.minisplit && (
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Minisplit:</span>
                        <span className="text-gray-800">{state.extras.minisplit.name}</span>
                      </div>
                    )}
                    {state.extras.paneles && (
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Paneles:</span>
                        <span className="text-gray-800">{state.extras.paneles.name}</span>
                      </div>
                    )}
                    {state.extras.patio.estilo && (
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Estilo de Patio:</span>
                        <span className="text-gray-800">{state.extras.patio.estilo.name}</span>
                      </div>
                    )}
                    {state.extras.patio.domo && (
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Domo:</span>
                        <span className="text-gray-800">{state.extras.patio.domo.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Footer */}
            <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t border-gray-200">
              <p>Documento generado el {timestamp}</p>
              <p>Sistema de Personalización Cumbres León © 2024</p>
            </div>
          </div>
        </motion.div>

        {/* Componente de Firma Digital */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <DigitalSignature
            onSign={handleSign}
            isSigned={isSigned}
          />
        </motion.div>
      </div>
    </div>
  );
}

interface DocumentSectionProps {
  title: string;
  items: Array<{ label: string; option: CustomizationOption }>;
  delay: number;
}

function DocumentSection({ title, items, delay }: DocumentSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="mb-8"
    >
      <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-gray-400">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">{item.label}:</span>
              <span className="text-gray-800">{item.option.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}