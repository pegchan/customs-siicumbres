/**
 * Utilidades para navegar la estructura dinámica del backend catalog
 * Sin hardcodear NADA - todo se lee dinámicamente
 */

import type { BackendFullCatalog, BackendCatalogOption } from '../services/catalogAPI';
import type { CustomizationOption } from '../types';

/**
 * Estructura de una categoría
 */
export interface CategoryStructure {
  categoryId: string;
  subcategories: SubcategoryStructure[];
}

/**
 * Estructura de una subcategoría
 */
export interface SubcategoryStructure {
  subcategoryId: string;
  areas: AreaStructure[];
  hasAreas: boolean; // true si tiene áreas, false si es array directo
}

/**
 * Estructura de un área
 */
export interface AreaStructure {
  areaId: string;
  options: CustomizationOption[];
}

/**
 * Obtiene todas las categorías del catálogo
 */
export function getCategories(catalog: BackendFullCatalog | null): string[] {
  if (!catalog || !catalog.options) return [];
  return Object.keys(catalog.options);
}

/**
 * Obtiene la estructura completa de una categoría
 */
export function getCategoryStructure(
  catalog: BackendFullCatalog | null,
  categoryId: string
): CategoryStructure | null {
  if (!catalog || !catalog.options || !catalog.options[categoryId]) {
    return null;
  }

  const categoryData = catalog.options[categoryId];
  const subcategories: SubcategoryStructure[] = [];

  // Iterar sobre todas las subcategorías
  Object.keys(categoryData).forEach((subcategoryId) => {
    const subcategoryData = categoryData[subcategoryId];

    // Verificar si la subcategoría tiene áreas o es un array directo
    if (Array.isArray(subcategoryData)) {
      // Es un array directo de opciones
      subcategories.push({
        subcategoryId,
        areas: [{
          areaId: subcategoryId, // Usar el mismo ID como área
          options: transformOptions(subcategoryData),
        }],
        hasAreas: false,
      });
    } else if (typeof subcategoryData === 'object' && subcategoryData !== null) {
      // Es un objeto con áreas
      const areas: AreaStructure[] = [];

      Object.keys(subcategoryData).forEach((areaId) => {
        const areaData = subcategoryData[areaId];

        if (Array.isArray(areaData)) {
          areas.push({
            areaId,
            options: transformOptions(areaData),
          });
        }
      });

      if (areas.length > 0) {
        subcategories.push({
          subcategoryId,
          areas,
          hasAreas: true,
        });
      }
    }
  });

  return {
    categoryId,
    subcategories,
  };
}

/**
 * Obtiene todas las subcategorías de una categoría
 */
export function getSubcategories(
  catalog: BackendFullCatalog | null,
  categoryId: string
): string[] {
  if (!catalog || !catalog.options || !catalog.options[categoryId]) {
    return [];
  }

  return Object.keys(catalog.options[categoryId]);
}

/**
 * Obtiene todas las áreas de una subcategoría
 * Si la subcategoría es un array directo, devuelve un array con el nombre de la subcategoría
 */
export function getAreas(
  catalog: BackendFullCatalog | null,
  categoryId: string,
  subcategoryId: string
): string[] {
  if (!catalog || !catalog.options || !catalog.options[categoryId]) {
    return [];
  }

  const subcategoryData = catalog.options[categoryId][subcategoryId];

  if (!subcategoryData) {
    return [];
  }

  // Si es un array directo, devolver el nombre de la subcategoría como área
  if (Array.isArray(subcategoryData)) {
    return [subcategoryId];
  }

  // Si es un objeto, devolver todas las keys (áreas)
  if (typeof subcategoryData === 'object') {
    return Object.keys(subcategoryData);
  }

  return [];
}

/**
 * Obtiene las opciones de un área específica
 */
export function getAreaOptions(
  catalog: BackendFullCatalog | null,
  categoryId: string,
  subcategoryId: string,
  areaId: string
): CustomizationOption[] {
  if (!catalog || !catalog.options || !catalog.options[categoryId]) {
    return [];
  }

  const subcategoryData = catalog.options[categoryId][subcategoryId];

  if (!subcategoryData) {
    return [];
  }

  // Si la subcategoría es un array directo
  if (Array.isArray(subcategoryData)) {
    return transformOptions(subcategoryData);
  }

  // Si la subcategoría tiene áreas
  if (typeof subcategoryData === 'object' && subcategoryData[areaId]) {
    const areaData = subcategoryData[areaId];
    if (Array.isArray(areaData)) {
      return transformOptions(areaData);
    }
  }

  return [];
}

/**
 * Obtiene todas las opciones de una subcategoría (combinando todas las áreas)
 */
export function getSubcategoryOptions(
  catalog: BackendFullCatalog | null,
  categoryId: string,
  subcategoryId: string
): CustomizationOption[] {
  if (!catalog || !catalog.options || !catalog.options[categoryId]) {
    return [];
  }

  const subcategoryData = catalog.options[categoryId][subcategoryId];

  if (!subcategoryData) {
    return [];
  }

  // Si es un array directo
  if (Array.isArray(subcategoryData)) {
    return transformOptions(subcategoryData);
  }

  // Si tiene áreas, combinar todas las opciones
  const allOptions: CustomizationOption[] = [];

  if (typeof subcategoryData === 'object') {
    Object.keys(subcategoryData).forEach((areaId) => {
      const areaData = subcategoryData[areaId];
      if (Array.isArray(areaData)) {
        allOptions.push(...transformOptions(areaData));
      }
    });
  }

  return allOptions;
}

/**
 * Transforma un array de opciones del backend al formato del frontend
 */
function transformOptions(backendOptions: BackendCatalogOption[]): CustomizationOption[] {
  if (!Array.isArray(backendOptions)) {
    return [];
  }

  return backendOptions.map((option) => ({
    id: option.id.toString(),
    name: option.name,
    image: option.image || undefined,
    category: option.category || 'general',
    subcategory: option.subcategory,
    price: option.price,
  }));
}

/**
 * Formatea el nombre de una categoría/subcategoría/área para display
 */
export function formatDisplayName(key: string): string {
  return key
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
