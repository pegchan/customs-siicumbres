/**
 * Utilidades para manejar categorías dinámicas del catálogo
 */

import type { BackendFullCatalog } from '../services/catalogAPI';

export interface CategoryInfo {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Mapeo de categorías conocidas a metadata
const CATEGORY_METADATA: Record<string, Omit<CategoryInfo, 'id'>> = {
  interiores: {
    title: 'Interiores',
    description: 'Colores y acabados',
    icon: '🎨',
  },
  cocina: {
    title: 'Cocina',
    description: 'Personaliza tu cocina',
    icon: '🍳',
  },
  banos: {
    title: 'Baños',
    description: 'Acabados de baños',
    icon: '🚿',
  },
  closets: {
    title: 'Closets',
    description: 'Acabados de closets',
    icon: '💼',
  },
  extras: {
    title: 'Extras',
    description: 'Mejoras adicionales',
    icon: '✨',
  },
};

// Icono y título por defecto para categorías desconocidas
const DEFAULT_CATEGORY_METADATA = {
  title: 'Personalización',
  description: 'Opciones adicionales',
  icon: '📦',
};

/**
 * Extrae categorías dinámicamente del backend catalog
 * Excluye categorías vacías
 * Respeta el orden definido en categoryOrder del CRM si está disponible
 */
export function extractCategories(backendCatalog: BackendFullCatalog | null): CategoryInfo[] {
  if (!backendCatalog || !backendCatalog.options) {
    return [];
  }

  const categories: CategoryInfo[] = [];

  // Usar categoryOrder del CRM si está disponible, sino usar Object.keys()
  // categoryOrder viene del backend y respeta el orden configurado en el CRM
  const orderedKeys = backendCatalog.categoryOrder && backendCatalog.categoryOrder.length > 0
    ? backendCatalog.categoryOrder
    : Object.keys(backendCatalog.options);

  // Iterar sobre las keys en el orden correcto
  orderedKeys.forEach((categoryKey) => {
    const categoryData = backendCatalog.options[categoryKey];

    // Verificar que la categoría exista y tenga contenido
    if (!categoryData || Object.keys(categoryData).length === 0) {
      return; // Skip categorías vacías o no existentes
    }

    // Obtener metadata (conocida o default)
    const metadata = CATEGORY_METADATA[categoryKey] || {
      ...DEFAULT_CATEGORY_METADATA,
      title: formatCategoryName(categoryKey),
      description: `Personaliza ${formatCategoryName(categoryKey).toLowerCase()}`,
    };

    categories.push({
      id: categoryKey,
      ...metadata,
    });
  });

  return categories;
}

/**
 * Formatea el nombre de categoría para display
 * Ej: "recamara-3" -> "Recamara 3"
 */
function formatCategoryName(key: string): string {
  return key
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
