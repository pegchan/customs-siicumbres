# Guía de Integración del Catálogo - customs-siicumbres

**Fecha:** 28 de Octubre de 2025
**Estado:** ✅ Código base implementado - Listo para pruebas

---

## 🎉 LO QUE YA ESTÁ HECHO

### ✅ Componentes Creados

| Archivo | Descripción | Ubicación |
|---------|-------------|-----------|
| `catalogAPI.ts` | Servicio para fetch del backend | `src/services/catalogAPI.ts` |
| `useCatalogLoader.ts` | Hook para loading states | `src/hooks/useCatalogLoader.ts` |
| `ImageWithFallback.tsx` | Componente para placeholders | `src/components/ImageWithFallback.tsx` |
| ✏️ `OptionCard.tsx` | **Actualizado** con ImageWithFallback | `src/components/OptionCard.tsx` |
| ✏️ `HouseModelCard.tsx` | **Actualizado** con ImageWithFallback | `src/components/HouseModelCard.tsx` |

### ✅ Features Implementadas

1. **Servicio de API Completo**
   - Singleton con cache automático (5 min)
   - Timeout configurado (10 seg)
   - 4 endpoints disponibles
   - Manejo de errores robusto

2. **Hook de Carga**
   - Loading states
   - Error handling
   - Retry logic
   - Cache clearing

3. **Placeholders Automáticos**
   - 3 tipos: placeholder URL, texto, ícono
   - Skeleton loader mientras carga
   - Fallback automático en errores
   - Transiciones suaves

---

## 🔧 LO QUE FALTA POR HACER

### Paso 1: Configurar Variable de Entorno

**Archivo:** `.env` (crear en la raíz del proyecto)

```bash
# Backend API URL
VITE_API_URL=http://localhost:8000/api/catalog
```

**Verificación:**
```bash
# Verificar que el backend esté corriendo
curl http://localhost:8000/api/catalog/full | jq '.success'
# Debe devolver: true
```

---

### Paso 2: Actualizar mockData.ts

**Opción A: Reemplazar completamente (Recomendado)**

Crear un nuevo archivo `src/data/catalogTransformer.ts`:

```typescript
/**
 * Transformador de datos del backend al formato del frontend
 */

import type { BackendFullCatalog } from '../services/catalogAPI';
import type { CustomizationCatalog } from '../types';

export function transformBackendCatalog(
  backendData: BackendFullCatalog
): CustomizationCatalog {
  // Transformar modelos de casa
  const houseModels = backendData.houseModels.map(model => ({
    id: model.model_id,
    name: model.name,
    description: model.description,
    image: model.main_image,
    floorPlans: {
      plantaBaja: model.floorPlans.lower,
      plantaAlta: model.floorPlans.upper || undefined,
    },
  }));

  // Transformar opciones de interiores
  const interiorColors = transformOptions(
    backendData.options?.interiores?.colores_pintura
  );

  const woodFinishes = transformOptions(
    backendData.options?.interiores?.acabados_madera
  );

  // Transformar opciones de cocina
  const kitchenCountertops = transformOptions(
    backendData.options?.interiores?.cubiertas_cocina
  );

  const kitchenBacksplash = transformOptions(
    backendData.options?.interiores?.backsplash_cocina
  );

  // ... continuar con el resto de opciones

  return {
    houseModels,
    interiorColors,
    woodFinishes,
    // ... resto de campos
  };
}

function transformOptions(
  backendOptions: any[] | { [key: string]: any[] } | undefined
): any[] {
  if (!backendOptions) return [];

  if (Array.isArray(backendOptions)) {
    return backendOptions.map(opt => ({
      id: opt.id,
      name: opt.name,
      image: opt.image,
      price: opt.price,
      category: opt.category,
      subcategory: opt.subcategory,
    }));
  }

  // Si es un objeto anidado (ej: colores por habitación)
  return Object.values(backendOptions).flat();
}
```

**Opción B: Modo híbrido (para transición gradual)**

Modificar `mockData.ts` temporalmente:

```typescript
import { catalogAPI } from '../services/catalogAPI';

// Mantener mock data como fallback
export const mockCatalog: CustomizationCatalog = {
  // ... datos actuales
};

// Función para obtener catálogo (real o mock)
export async function getCatalog(): Promise<CustomizationCatalog> {
  try {
    const backendData = await catalogAPI.getFullCatalog();
    return transformBackendCatalog(backendData);
  } catch (error) {
    console.warn('[getCatalog] Usando mock data como fallback:', error);
    return mockCatalog;
  }
}
```

---

### Paso 3: Integrar en CustomizationContext

**Archivo:** `src/context/CustomizationContext.tsx`

**Cambios necesarios:**

```typescript
import { useCatalogLoader } from '../hooks/useCatalogLoader';
import { transformBackendCatalog } from '../data/catalogTransformer';

export function CustomizationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(customizationReducer, initialState);

  // Agregar hook de catálogo
  const { catalog, loading, error, retry } = useCatalogLoader();

  // Transformar catálogo cuando esté disponible
  const transformedCatalog = React.useMemo(() => {
    if (!catalog) return null;
    return transformBackendCatalog(catalog);
  }, [catalog]);

  // Mostrar loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-corporate-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  // Mostrar error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error al cargar catálogo
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={retry}
            className="bg-corporate-500 hover:bg-corporate-600 text-white px-6 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Pasar catálogo transformado al contexto
  return (
    <CustomizationContext.Provider value={{
      state,
      dispatch,
      catalog: transformedCatalog, // ← Nuevo
      // ... resto de métodos
    }}>
      {children}
    </CustomizationContext.Provider>
  );
}
```

---

### Paso 4: Actualizar Componentes de Página

**Ejemplo:** `ModelSelectionPage.tsx`

**Antes:**
```typescript
import { mockCatalog } from '../data/mockData';

export function ModelSelectionPage() {
  const models = mockCatalog.houseModels;
  // ...
}
```

**Después:**
```typescript
import { useCustomization } from '../context/CustomizationContext';

export function ModelSelectionPage() {
  const { catalog } = useCustomization();
  const models = catalog?.houseModels || [];
  // ...
}
```

**Repetir para:**
- `InteriorColorsPage.tsx`
- `KitchenPage.tsx`
- `BathroomPage.tsx`
- `ClosetsPage.tsx`
- `ExtrasPage.tsx`

---

### Paso 5: Verificar Tipos TypeScript

**Archivo:** `src/types/index.ts`

Asegurarse de que los tipos sean compatibles:

```typescript
export interface CustomizationOption {
  id: string;
  name: string;
  image?: string; // ← Debe ser opcional
  price?: number;
  category?: string;
  subcategory?: string;
  description?: string;
}

export interface HouseModel {
  id: string;
  name: string;
  description: string;
  image?: string; // ← Debe ser opcional
  floorPlans: {
    plantaBaja: string;
    plantaAlta?: string;
  };
}
```

---

## 🧪 TESTING

### Test 1: Verificar Backend

```bash
# En terminal
curl http://localhost:8000/api/catalog/full

# Debe devolver JSON con:
# - success: true
# - data.houseModels: array
# - data.options: object
```

### Test 2: Verificar CORS

```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     http://localhost:8000/api/catalog/full \
     -v

# Debe incluir header:
# Access-Control-Allow-Origin: *
```

### Test 3: Probar en React

```bash
cd /mnt/c/xampp/htdocs/customs-siicumbres
npm run dev
```

**En consola del navegador:**
```javascript
// Test básico del servicio
import { catalogAPI } from './src/services/catalogAPI';

catalogAPI.getFullCatalog()
  .then(data => console.log('Modelos:', data.houseModels.length))
  .catch(err => console.error('Error:', err));
```

---

## 🐛 TROUBLESHOOTING

### Error: "Failed to fetch"

**Causa:** Backend no está corriendo o CORS bloqueado

**Solución:**
```bash
# Verificar backend
cd /mnt/c/xampp/htdocs/cumbres_leon_v2
php artisan serve

# Verificar CORS en app/Http/Middleware/Cors.php
```

### Error: "Cannot read property 'houseModels' of null"

**Causa:** Catálogo aún no cargado

**Solución:** Agregar optional chaining
```typescript
const models = catalog?.houseModels || [];
```

### Imágenes no cargan

**Causa:** URLs de Cloudinary incorrectas o bloqueador de ads

**Solución:**
- Verificar URLs en Network tab
- Desactivar bloqueador de anuncios
- ImageWithFallback maneja automáticamente

---

## 📋 CHECKLIST DE INTEGRACIÓN

### Backend
- [ ] Backend Laravel corriendo en `localhost:8000`
- [ ] Endpoint `/api/catalog/full` responde correctamente
- [ ] CORS configurado para `localhost:5173`
- [ ] Al menos 1 modelo con imagen en DB
- [ ] Al menos 1 opción con imagen en DB

### Frontend
- [ ] `.env` creado con `VITE_API_URL`
- [ ] `catalogTransformer.ts` creado
- [ ] `CustomizationContext.tsx` actualizado con loading/error states
- [ ] Todas las páginas usan `catalog` del contexto
- [ ] Tipos TypeScript actualizados
- [ ] Componentes compilados sin errores

### Testing
- [ ] `npm run dev` inicia sin errores
- [ ] Loading spinner aparece al iniciar
- [ ] Modelo Aruma se visualiza con imagen
- [ ] Opciones sin imagen muestran placeholder
- [ ] No hay errores de CORS en consola
- [ ] Cache funciona (reload rápido)

---

## 🚀 DEPLOY A PRODUCCIÓN

### Cambios Necesarios

**1. Variable de entorno**
```bash
VITE_API_URL=https://api.cumbres-leon.com/api/catalog
```

**2. CORS en backend**

Actualizar `app/Http/Middleware/Cors.php`:
```php
$allowedOrigins = [
    'https://customs-siicumbres.com',
    'https://www.customs-siicumbres.com',
];

// Comentar wildcard:
// $response->headers->set('Access-Control-Allow-Origin', '*');
```

**3. Build**
```bash
npm run build
```

---

## 📝 NOTAS IMPORTANTES

### Cache del Servicio
- **Duración:** 5 minutos
- **Limpiar manualmente:** `catalogAPI.clearCache()`
- **Auto-limpia** cuando se detectan errores

### Placeholders
- **Tipo 'icon':** Usado en OptionCard (ícono de imagen)
- **Tipo 'text':** Usado en HouseModelCard (emoji + texto)
- **Tipo 'placeholder':** Genera URL con via.placeholder.com

### Performance
- Solo 1 request al backend por sesión (cache)
- Imágenes lazy-load automático con skeleton
- Transiciones CSS optimizadas

---

## 🔗 ARCHIVOS RELACIONADOS

```
customs-siicumbres/
├── src/
│   ├── services/
│   │   └── catalogAPI.ts                    ← Servicio principal
│   ├── hooks/
│   │   └── useCatalogLoader.ts             ← Hook de carga
│   ├── components/
│   │   ├── ImageWithFallback.tsx           ← Componente de imagen
│   │   ├── OptionCard.tsx                  ← Actualizado
│   │   └── HouseModelCard.tsx              ← Actualizado
│   ├── context/
│   │   └── CustomizationContext.tsx        ← Necesita actualización
│   ├── data/
│   │   ├── mockData.ts                     ← Legacy
│   │   └── catalogTransformer.ts           ← Por crear
│   └── types/
│       └── index.ts                         ← Verificar tipos
└── .env                                     ← Por crear
```

---

## ✅ RESULTADO ESPERADO

**Después de completar la integración:**

1. ✅ App carga datos reales desde Laravel
2. ✅ Modelo "Aruma" se visualiza con su imagen
3. ✅ Opciones sin imagen muestran placeholders bonitos
4. ✅ Loading spinner durante fetch inicial
5. ✅ Error screen si backend no responde
6. ✅ Cache funciona (reloads instantáneos)
7. ✅ Placeholders con nombres de opciones
8. ✅ Skeleton loaders en imágenes

---

## 📞 SOPORTE

**Backend API:**
- Documentación: `/docs/INTEGRACION_REACT_CATALOG.md` en cumbres_leon_v2
- Endpoints: `/docs/CATALOGO_MAESTRO_IMPLEMENTATION.md`

**Frontend React:**
- Este documento
- CLAUDE.md en el proyecto
- TECHNICAL_GUIDE.md

---

**✅ TODO EL CÓDIGO BASE ESTÁ IMPLEMENTADO Y LISTO PARA INTEGRACIÓN**

**Próximo paso:** Crear `.env` y seguir Paso 1-5 de esta guía.
