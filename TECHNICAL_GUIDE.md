# Guía Técnica - Sistema de Personalización de Viviendas

## Arquitectura Técnica Detallada

### Stack Tecnológico

```typescript
Frontend Framework: React 19.1.1
Language: TypeScript 5.6.2
Build Tool: Vite 5.4.10
Styling: Tailwind CSS 3.4.17
Animations: Framer Motion 11.11.17
State Management: React Context API + useReducer
```

## Estructura de Archivos Detallada

```
customs-siicumbres/
├── public/                     # Assets estáticos
│   └── images/                # Imágenes del catálogo (esperadas)
├── src/
│   ├── components/            # Componentes React reutilizables
│   │   ├── CustomizationLayout.tsx      # Layout principal y enrutado
│   │   ├── CustomizationStepper.tsx     # Navegación entre pasos
│   │   ├── OptionCard.tsx               # Tarjeta individual de opción
│   │   ├── ImageModal.tsx               # Modal lightbox para zoom
│   │   ├── HorizontalOptionGrid.tsx     # Grid inteligente con scroll
│   │   ├── SubcategoryConfigManager.tsx # Panel admin de configuración
│   │   ├── SummaryPanel.tsx             # Panel lateral de resumen
│   │   ├── HouseModelCard.tsx           # Tarjeta de modelo de casa
│   │   ├── ModelSelectionPage.tsx       # Página selección modelo
│   │   ├── InteriorColorsPage.tsx       # Página colores interiores
│   │   ├── KitchenPage.tsx              # Página personalización cocina
│   │   ├── BathroomPage.tsx             # Página personalización baños
│   │   ├── ClosetsPage.tsx              # Página personalización closets
│   │   ├── ExtrasPage.tsx               # Página extras y accesorios
│   │   └── SummaryPage.tsx              # Página resumen final
│   ├── context/               # Estado global
│   │   └── CustomizationContext.tsx     # Context principal con reducer
│   ├── hooks/                 # Hooks personalizados
│   │   ├── useAutoScroll.ts             # Lógica de auto-scroll
│   │   └── useSubcategoryConfig.ts      # Configuración dinámica
│   ├── services/              # Servicios y lógica de negocio
│   │   └── subcategoryConfigService.ts  # Servicio de configuración
│   ├── types/                 # Definiciones TypeScript
│   │   └── index.ts                     # Todos los tipos del sistema
│   ├── data/                  # Datos mock
│   │   └── mockData.ts                  # Catálogos y datos simulados
│   ├── App.tsx               # Componente raíz
│   ├── main.tsx              # Entry point
│   └── index.css             # Estilos globales + Tailwind
├── HISTORY.md                # Historial de desarrollo
├── README.md                 # Documentación principal
├── TECHNICAL_GUIDE.md        # Esta guía técnica
└── CLAUDE.md                 # Documentación para futuras sesiones
```

## Gestión de Estado

### CustomizationContext

```typescript
// Estado principal del sistema
interface CustomizationState {
  selectedModel: HouseModel | null;
  interiores: {
    sala: CustomizationOption | null;
    comedor: CustomizationOption | null;
    recamara1: CustomizationOption | null;
    recamara2: CustomizationOption | null;
    recamara3: CustomizationOption | null;
    escaleras: CustomizationOption | null;
  };
  cocina: {
    alacenaSuperior: CustomizationOption | null;
    alacenaInferior: CustomizationOption | null;
    alacenaBarraL: CustomizationOption | null;
    alacenaExtra: CustomizationOption | null;
    cubierta: CustomizationOption | null;
    backsplash: CustomizationOption | null;
    tarja: CustomizationOption | null;
  };
  banos: {
    muebleBanoA: CustomizationOption | null;
    muebleBanoB: CustomizationOption | null;
    muebleBanoC: CustomizationOption | null;
    colorMueble: CustomizationOption | null;
    acabadoCanceles: CustomizationOption | null;
  };
  closets: {
    recamara1: CustomizationOption | null;
    recamara2: CustomizationOption | null;
    recamara3: CustomizationOption | null;
    muebleBajoEscalera: CustomizationOption | null;
    puertasMarcoEscalera: CustomizationOption | null;
  };
  extras: {
    colorFachada: CustomizationOption | null;
    minisplit: CustomizationOption | null;
    protecciones: CustomizationOption[] | null;
    paneles: CustomizationOption | null;
    patio: {
      estilo: CustomizationOption | null;
      domo: CustomizationOption | null;
    };
    reflejante: CustomizationOption[] | null;
  };
}

// Acciones disponibles
type CustomizationAction = 
  | { type: 'SET_MODEL'; payload: HouseModel }
  | { type: 'SET_INTERIOR_COLOR'; payload: { room: string; option: CustomizationOption } }
  | { type: 'SET_KITCHEN_OPTION'; payload: { element: string; option: CustomizationOption } }
  | { type: 'SET_BATHROOM_OPTION'; payload: { element: string; option: CustomizationOption } }
  | { type: 'SET_CLOSET_OPTION'; payload: { element: string; option: CustomizationOption } }
  | { type: 'SET_EXTRA_OPTION'; payload: { element: string; option: CustomizationOption } }
  | { type: 'TOGGLE_MULTI_OPTION'; payload: { category: string; option: CustomizationOption } }
  | { type: 'RESET_STATE' };
```

### Hooks Personalizados

#### useAutoScroll
```typescript
export function useAutoScroll() {
  const scrollToNextSection = useCallback((currentSectionIndex: number) => {
    setTimeout(() => {
      const sections = document.querySelectorAll('[data-section]');
      const nextSectionIndex = currentSectionIndex + 1;
      if (sections[nextSectionIndex]) {
        const nextSection = sections[nextSectionIndex] as HTMLElement;
        const headerHeight = 140;
        const offset = nextSection.offsetTop - headerHeight;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }, 300);
  }, []);
  
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  return { scrollToNextSection, scrollToTop };
}
```

#### useSubcategoryConfig
```typescript
export function useSubcategoryConfig() {
  const [config, setConfig] = useState<SubcategoryConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSubcategoryOptional = useCallback((subcategory: string): boolean => {
    if (!config) return false;
    return config[subcategory]?.isOptional ?? false;
  }, [config]);

  const getDisplayName = useCallback((subcategory: string): string => {
    if (!config) return subcategory;
    return config[subcategory]?.displayName ?? subcategory;
  }, [config]);

  return {
    config,
    loading,
    error,
    isSubcategoryOptional,
    getDisplayName,
    refreshConfig,
    lastFetched: subcategoryConfigService.getLastFetched(),
  };
}
```

## Servicios

### SubcategoryConfigService (Singleton Pattern)

```typescript
export class SubcategoryConfigService {
  private static instance: SubcategoryConfigService;
  private config: SubcategoryConfig | null = null;
  private lastFetched: string | null = null;

  private constructor() {}

  static getInstance(): SubcategoryConfigService {
    if (!SubcategoryConfigService.instance) {
      SubcategoryConfigService.instance = new SubcategoryConfigService();
    }
    return SubcategoryConfigService.instance;
  }

  // Mock API con delay simulado
  async fetchConfig(): Promise<SubcategoryConfig> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const response = this.mockApiResponse();
    this.config = response.subcategories;
    this.lastFetched = response.lastUpdated;
    return this.config;
  }

  // Cache inteligente
  async getConfig(): Promise<SubcategoryConfig> {
    if (!this.config) {
      return await this.fetchConfig();
    }
    return this.config;
  }
}
```

## Componentes Clave

### OptionCard - Componente Reutilizable

```typescript
export function OptionCard({ option, isSelected, onSelect }: OptionCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { isSubcategoryOptional } = useSubcategoryConfig();
  
  // Determinación dinámica si es opcional
  const isOptional = option.subcategory ? isSubcategoryOptional(option.subcategory) : false;

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`relative cursor-pointer rounded-lg overflow-hidden shadow-md transition-all duration-300 ${
          isSelected ? 'ring-3 ring-blue-500 shadow-lg' : 'hover:shadow-lg border border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => onSelect(option)}
      >
        <div className="aspect-square bg-gray-100 flex items-center justify-center relative group">
          {/* Imagen con fallback */}
          {option.image && (
            <img 
              src={option.image} 
              alt={option.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          
          {/* Botón de zoom en hover */}
          <button
            onClick={handleZoomClick}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-lg p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ZoomIcon />
          </button>
        </div>
        
        <div className="p-3">
          <div className="flex items-center justify-center gap-1 mb-1">
            <h4 className="font-medium text-sm text-gray-900 text-center">{option.name}</h4>
            {isOptional && (
              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                Opcional
              </span>
            )}
          </div>
          {option.price && (
            <p className="text-xs text-gray-600 text-center">
              ${option.price.toLocaleString()}
            </p>
          )}
        </div>
      </motion.div>

      <ImageModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        option={option}
      />
    </>
  );
}
```

### HorizontalOptionGrid - Grid Inteligente

```typescript
export function HorizontalOptionGrid({ 
  options, 
  selectedOption, 
  selectedOptions, 
  onSelect, 
  multiSelect = false 
}: HorizontalOptionGridProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Lógica para mostrar/ocultar flechas de navegación
  const updateArrowVisibility = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  // Decisión entre grid normal vs scroll horizontal
  const useHorizontalScroll = options.length > 6;

  if (useHorizontalScroll) {
    return (
      <div className="relative">
        {showLeftArrow && <LeftNavigationArrow />}
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth"
          onScroll={updateArrowVisibility}
        >
          {options.map((option) => (
            <div key={option.id} className="flex-shrink-0 w-48">
              <OptionCard
                option={option}
                isSelected={isSelected(option)}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>
        
        {showRightArrow && <RightNavigationArrow />}
      </div>
    );
  }

  // Grid normal para ≤6 opciones
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {options.map((option) => (
        <OptionCard
          key={option.id}
          option={option}
          isSelected={isSelected(option)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
```

## Sistema de Tipos

### Tipos Principales

```typescript
// Opción de personalización
export interface CustomizationOption {
  id: string;
  name: string;
  image: string;
  category: string;
  subcategory?: string;
  price?: number;
}

// Modelo de casa
export interface HouseModel {
  id: string;
  name: string;
  description: string;
  image: string;
  floorPlans: {
    plantaBaja: string;
    plantaAlta?: string;
  };
}

// Configuración de subcategorías
export interface SubcategoryConfig {
  [key: string]: {
    isOptional: boolean;
    displayName?: string;
    description?: string;
  };
}

// Catálogo completo
export interface CustomizationCatalog {
  houseModels: HouseModel[];
  options: {
    interiores: {
      colores: {
        sala: CustomizationOption[];
        comedor: CustomizationOption[];
        recamara1: CustomizationOption[];
        recamara2: CustomizationOption[];
        recamara3: CustomizationOption[];
        escaleras: CustomizationOption[];
      };
    };
    cocina: {
      alacenas: {
        superior: CustomizationOption[];
        inferior: CustomizationOption[];
        barraL: CustomizationOption[];
        extra: CustomizationOption[];
      };
      cubierta: CustomizationOption[];
      backsplash: CustomizationOption[];
      tarja: CustomizationOption[];
    };
    banos: {
      muebles: {
        banoA: CustomizationOption[];
        banoB: CustomizationOption[];
        banoC: CustomizationOption[];
        color: CustomizationOption[];
      };
      acabados: {
        canceles: CustomizationOption[];
      };
    };
    closets: {
      recamara1: CustomizationOption[];
      recamara2: CustomizationOption[];
      recamara3: CustomizationOption[];
      muebleBajoEscalera: CustomizationOption[];
      puertasMarcoEscalera: CustomizationOption[];
    };
    extras: {
      fachadas: CustomizationOption[];
      minisplit: CustomizationOption[];
      protecciones: CustomizationOption[];
      paneles: CustomizationOption[];
      patio: {
        estilos: CustomizationOption[];
        domos: CustomizationOption[];
      };
      reflejante: CustomizationOption[];
    };
  };
}
```

## Patrones de Diseño Implementados

### 1. Context Provider Pattern
```typescript
// Proveedor de estado global
export function CustomizationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(customizationReducer, initialState);
  
  const setModel = useCallback((model: HouseModel) => {
    dispatch({ type: 'SET_MODEL', payload: model });
  }, []);

  const value = {
    state,
    dispatch,
    setModel,
    // ... otras acciones
  };

  return (
    <CustomizationContext.Provider value={value}>
      {children}
    </CustomizationContext.Provider>
  );
}
```

### 2. Singleton Pattern
```typescript
// Servicio singleton para configuración
export class SubcategoryConfigService {
  private static instance: SubcategoryConfigService;
  
  static getInstance(): SubcategoryConfigService {
    if (!SubcategoryConfigService.instance) {
      SubcategoryConfigService.instance = new SubcategoryConfigService();
    }
    return SubcategoryConfigService.instance;
  }
}

export const subcategoryConfigService = SubcategoryConfigService.getInstance();
```

### 3. Observer Pattern (via React Context)
```typescript
// Los componentes se suscriben automáticamente a cambios de estado
const { state } = useCustomization();

// Cualquier cambio en el contexto re-renderiza componentes suscritos
```

### 4. Strategy Pattern
```typescript
// Diferentes estrategias de renderizado basadas en cantidad de opciones
const useHorizontalScroll = options.length > 6;

if (useHorizontalScroll) {
  return <HorizontalScrollLayout />;
} else {
  return <GridLayout />;
}
```

## Performance y Optimizaciones

### 1. Lazy Loading de Componentes
```typescript
// Carga diferida de páginas pesadas
const KitchenPage = lazy(() => import('./KitchenPage'));
const BathroomPage = lazy(() => import('./BathroomPage'));
```

### 2. Memoización de Componentes
```typescript
// Evitar re-renders innecesarios
const OptionCard = memo(({ option, isSelected, onSelect }: OptionCardProps) => {
  // ... implementación
});
```

### 3. useCallback para Funciones
```typescript
// Evitar recreación de funciones en cada render
const handleOptionSelect = useCallback((option: CustomizationOption) => {
  setSelectedOption(option);
}, []);
```

### 4. Cache de Configuración
```typescript
// Evitar llamadas innecesarias al servicio
async getConfig(): Promise<SubcategoryConfig> {
  if (!this.config) {
    return await this.fetchConfig();
  }
  return this.config; // Retorna cache
}
```

## Debugging y Herramientas de Desarrollo

### 1. React DevTools
- Inspección de Context state
- Tracking de re-renders
- Performance profiling

### 2. Console Logging
```typescript
// Logging estratégico en servicios
console.log('SubcategoryConfig fetched:', config);
console.log('Auto-scroll triggered for section:', sectionIndex);
```

### 3. Error Boundaries
```typescript
// Manejo de errores a nivel de componente
class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }
}
```

## Integración con Backend (Futuro)

### API Endpoints Esperados
```typescript
// Configuración de subcategorías
GET /api/subcategory-config
Response: {
  subcategories: SubcategoryConfig;
  lastUpdated: string;
  version: string;
}

// Catálogo de opciones
GET /api/catalog
Response: CustomizationCatalog

// Modelos de casa
GET /api/house-models
Response: HouseModel[]

// Guardar personalización
POST /api/customizations
Body: {
  userId: string;
  customization: CustomizationState;
}
```

### Variables de Entorno
```env
VITE_API_URL=https://api.cumbres.com
VITE_CONFIG_ENDPOINT=/api/subcategory-config
VITE_CATALOG_ENDPOINT=/api/catalog
VITE_SAVE_ENDPOINT=/api/customizations
```

## Deployment y Build

### Configuración de Vite
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          ui: ['@tailwindcss/forms']
        }
      }
    }
  }
});
```

### Comandos de Build
```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check
```

---

Esta guía técnica proporciona una visión profunda de la arquitectura, patrones y implementación del sistema. Para actualizaciones y cambios, consultar `HISTORY.md`.