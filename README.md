# Sistema de Personalización de Viviendas - Cumbres León

Un sistema web moderno e interactivo para la personalización de viviendas con catálogos dinámicos y configuración administrativa.

## 🏠 Descripción del Proyecto

Sistema desarrollado para mostrar opciones de personalización de viviendas, alimentado por catálogos donde los usuarios pueden seleccionar opciones para personalizar su hogar ideal paso a paso.

## ✨ Características Principales

- **🎨 Personalización Completa**: 7 pasos de personalización (modelo, interiores, cocina, baños, closets, extras, resumen)
- **📱 UX Optimizada**: Auto-scroll, scroll horizontal, navegación fluida
- **🔍 Zoom de Imágenes**: Modal lightbox para ver detalles de opciones
- **⚙️ Configuración Dinámica**: Sistema administrativo para gestionar subcategorías opcionales
- **📊 Resumen en Tiempo Real**: Panel lateral con progreso y selecciones
- **🎭 Animaciones Fluidas**: Transiciones suaves con Framer Motion

## 🚀 Tecnologías Utilizadas

- **React 19.1.1** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS v3** - Styling utility-first
- **Framer Motion** - Animaciones y transiciones
- **Context API** - Gestión de estado global

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── CustomizationLayout.tsx    # Layout principal
│   ├── OptionCard.tsx             # Tarjeta de opción
│   ├── ImageModal.tsx             # Modal de zoom
│   ├── HorizontalOptionGrid.tsx   # Grid con scroll horizontal
│   ├── SubcategoryConfigManager.tsx # Panel administrativo
│   └── páginas de personalización/
├── context/             # Context API y estado global
│   └── CustomizationContext.tsx
├── hooks/               # Hooks personalizados
│   ├── useAutoScroll.ts
│   └── useSubcategoryConfig.ts
├── services/            # Servicios y lógica de negocio
│   └── subcategoryConfigService.ts
├── types/               # Definiciones de tipos TypeScript
│   └── index.ts
├── data/                # Datos mock y catálogos
│   └── mockData.ts
└── App.tsx             # Componente raíz
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone [url-del-repositorio]
cd customs-siicumbres
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:5173
```

## 📖 Guía de Uso

### Para Usuarios (Personalización)

1. **Selección de Modelo**: Elige entre 6 modelos de casa disponibles
2. **Colores de Interiores**: Personaliza colores para sala, comedor, recámaras y escaleras
3. **Cocina**: Configura alacenas, cubierta, backsplash y tarja
4. **Baños**: Selecciona muebles y acabados para 3 baños
5. **Closets**: Personaliza closets de recámaras y muebles bajo escalera
6. **Extras**: Añade fachada, minisplit, protecciones, paneles solares, etc.
7. **Resumen**: Revisa todas las selecciones antes de finalizar

### Para Administradores (Configuración)

1. **Acceder al Panel**: Clic en ⚙️ en el header
2. **Ver Configuración**: Tabla con todas las subcategorías y su estado
3. **Actualizar**: Botón para refrescar configuración desde el servicio
4. **Monitorear**: Ver última actualización y estado del sistema

## 🔧 Configuración de Subcategorías

### Subcategorías Opcionales
- `climate` - Climatización (minisplit)
- `protection` - Protecciones de ventanas
- `energy` - Paneles fotovoltaicos
- `dome` - Domo de patio
- `window` - Reflejante en ventanas

### Subcategorías Obligatorias
- `color` - Colores de pintura
- `finish` - Acabados de madera
- `countertop` - Cubiertas de cocina
- `backsplash` - Revestimientos
- `sink` - Tarjas
- `glass` - Cristales de baño
- `floor` - Pisos de patio

## 🏗️ Arquitectura del Sistema

### Gestión de Estado
```typescript
// Context principal
CustomizationContext
├── Estado global con useReducer
├── Acciones para cada tipo de selección
└── Provider que envuelve la aplicación

// Hooks personalizados
useAutoScroll()        // Comportamientos de scroll
useSubcategoryConfig() // Configuración dinámica
```

### Servicios
```typescript
// Singleton para configuración
SubcategoryConfigService
├── fetchConfig()     // Obtener configuración
├── refreshConfig()   // Forzar actualización
├── isOptional()      // Verificar si es opcional
└── getDisplayName()  // Nombre para mostrar
```

## 🎨 Características de UX

### Auto-Scroll Inteligente
- Al completar una categoría, scroll automático a la siguiente sección
- Botón "Continuar" lleva al inicio de la página
- Suavizado con `setTimeout` para mejor experiencia

### Scroll Horizontal Dinámico
- Grid normal para ≤6 opciones
- Scroll horizontal automático para >6 opciones
- Indicadores de navegación que aparecen según necesidad

### Zoom de Imágenes
- Modal lightbox para todas las imágenes
- Animaciones de entrada/salida
- Soporte de teclado (ESC para cerrar)
- Manejo de errores de carga

## 🔄 Flujo de Datos

```
Usuario selecciona opción → OptionCard → CustomizationContext → 
useReducer actualiza estado → SummaryPanel refleja cambios → 
Auto-scroll a siguiente sección

Admin abre configuración → SubcategoryConfigManager → 
useSubcategoryConfig hook → SubcategoryConfigService → 
Mock API response → Actualización de UI
```

## 🛡️ Manejo de Errores

- **Imágenes**: Placeholder automático si falla la carga
- **Configuración**: Mensajes de error en panel administrativo
- **Navegación**: Validaciones antes de permitir avance
- **Estado**: Fallbacks para datos faltantes

## 📱 Responsive Design

- **Mobile**: Layout optimizado para pantallas pequeñas
- **Tablet**: Ajuste de grid y espaciado
- **Desktop**: Experiencia completa con panel lateral
- **Scroll**: Comportamiento adaptado por dispositivo

## 🔍 Testing y Debugging

### Herramientas de Desarrollo
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🚀 Deployment

### Build de Producción
```bash
npm run build
```

### Variables de Entorno
```env
# API endpoints (cuando se conecte a backend real)
VITE_API_URL=https://api.ejemplo.com
VITE_CONFIG_ENDPOINT=/api/subcategory-config
```

## 🔮 Próximas Funcionalidades

- [ ] **Integración con API Real**: Conectar con backend
- [ ] **Autenticación**: Sistema de login para administradores
- [ ] **Exportación**: PDF/Excel de configuraciones
- [ ] **Comparador**: Comparar múltiples configuraciones
- [ ] **Calculadora de Precios**: Precios dinámicos en tiempo real
- [ ] **PWA**: Capacidades de aplicación web progresiva

## 🤝 Contribuciones

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📞 Soporte

Para soporte técnico o preguntas:
- **Documentación**: Ver archivos `HISTORY.md` y `TECHNICAL_GUIDE.md`
- **Issues**: Crear issue en el repositorio

---

**Desarrollado para Cumbres León** - Sistema de Personalización de Viviendas v1.0.0