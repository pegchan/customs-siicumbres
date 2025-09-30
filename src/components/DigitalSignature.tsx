import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DigitalSignatureProps {
  onSign: (signatureData: SignatureData) => void;
  isSigned: boolean;
}

export interface SignatureData {
  name: string;
  email: string;
  signature: string;
  timestamp: string;
  type: 'canvas' | 'text';
}

export function DigitalSignature({ onSign, isSigned }: DigitalSignatureProps) {
  const [signatureType, setSignatureType] = useState<'canvas' | 'text'>('text');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [textSignature, setTextSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSignature, setCanvasSignature] = useState('');

  // Verificar si el formulario es válido
  useEffect(() => {
    const hasRequiredFields = name.trim() && email.trim();
    const hasSignature = signatureType === 'text' 
      ? textSignature.trim() 
      : canvasSignature;
    
    setIsValid(hasRequiredFields && !!hasSignature);
  }, [name, email, textSignature, canvasSignature, signatureType]);

  // Funciones para dibujar en canvas
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (canvas && rect) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (canvas && rect) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#012D58';
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        const dataURL = canvas.toDataURL();
        setCanvasSignature(dataURL);
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setCanvasSignature('');
      }
    }
  };

  const handleSign = () => {
    if (!isValid) return;

    const signatureData: SignatureData = {
      name: name.trim(),
      email: email.trim(),
      signature: signatureType === 'text' ? textSignature.trim() : canvasSignature,
      timestamp: new Date().toISOString(),
      type: signatureType
    };

    onSign(signatureData);
  };

  if (isSigned) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border-2 border-green-200 rounded-xl p-6"
      >
        <div className="flex items-center justify-center space-x-3 text-green-700">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Documento Firmado</h3>
            <p className="text-sm">Tu personalización ha sido firmada y está lista para generar el PDF</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-corporate-200 rounded-xl p-6 shadow-lg"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-corporate-800 mb-2">
          ✍️ Firma de Conformidad
        </h3>
        <p className="text-corporate-600 text-sm">
          Para generar el PDF final, necesitamos tu firma de conformidad con las especificaciones seleccionadas.
        </p>
      </div>

      {/* Información del Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-corporate-700 mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingresa tu nombre completo"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-corporate-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-corporate-700 mb-2">
            Correo electrónico *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo electrónico"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-corporate-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tipo de Firma */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-corporate-700 mb-3">
          Tipo de firma *
        </label>
        <div className="flex space-x-4">
          <button
            onClick={() => setSignatureType('text')}
            className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
              signatureType === 'text'
                ? 'border-corporate-500 bg-corporate-50 text-corporate-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-1">✏️</div>
              <div className="font-medium">Firma de Texto</div>
              <div className="text-xs text-gray-600">Escribe tu nombre como firma</div>
            </div>
          </button>
          <button
            onClick={() => setSignatureType('canvas')}
            className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
              signatureType === 'canvas'
                ? 'border-corporate-500 bg-corporate-50 text-corporate-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-1">🖊️</div>
              <div className="font-medium">Firma Digital</div>
              <div className="text-xs text-gray-600">Dibuja tu firma con el mouse</div>
            </div>
          </button>
        </div>
      </div>

      {/* Área de Firma */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-corporate-700 mb-3">
          Tu firma *
        </label>
        
        <AnimatePresence mode="wait">
          {signatureType === 'text' ? (
            <motion.div
              key="text-signature"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <input
                type="text"
                value={textSignature}
                onChange={(e) => setTextSignature(e.target.value)}
                placeholder="Escribe tu nombre como aparece en tu identificación"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-corporate-500 focus:border-transparent text-lg font-cursive"
                style={{ fontFamily: 'cursive' }}
              />
              {textSignature && (
                <div className="mt-2 p-3 bg-gray-50 rounded border">
                  <p className="text-sm text-gray-600 mb-1">Vista previa de tu firma:</p>
                  <div 
                    className="text-2xl text-corporate-800"
                    style={{ fontFamily: 'cursive' }}
                  >
                    {textSignature}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="canvas-signature"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full border border-gray-200 rounded bg-white cursor-crosshair"
                  style={{ height: '150px' }}
                />
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Dibuja tu firma en el área de arriba
                  </p>
                  <button
                    onClick={clearCanvas}
                    className="text-sm text-corporate-600 hover:text-corporate-700 underline"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Declaración de Conformidad */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-corporate-800 mb-2">
          Declaración de Conformidad
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          Al firmar este documento, confirmo que he revisado todas las especificaciones de personalización 
          de mi vivienda y estoy conforme con las selecciones realizadas. Entiendo que estos elementos 
          serán la base para la construcción y/o personalización de mi hogar.
        </p>
      </div>

      {/* Botón de Firmar */}
      <div className="flex justify-end">
        <button
          onClick={handleSign}
          disabled={!isValid}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
            isValid
              ? 'bg-corporate-600 hover:bg-corporate-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isValid ? '✍️ Firmar Documento' : '⚠️ Completa todos los campos'}
        </button>
      </div>
    </motion.div>
  );
}