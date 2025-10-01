import { useCustomization } from '../context/CustomizationContext';
import { ModelSelectionPage } from './ModelSelectionPage';

export function CustomizationLayout() {
  const { state } = useCustomization();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-blue-600">🏠</div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Personalizaciones Cumbres León</h1>
                <p className="text-sm text-gray-600">Personaliza tu hogar ideal</p>
              </div>
            </div>

            {state.selectedModel && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Modelo seleccionado:</div>
                <div className="font-semibold text-gray-800">{state.selectedModel.name}</div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <ModelSelectionPage />
      </main>
    </div>
  );
}