/**
 * Transformador de datos del backend al formato del frontend
 * Convierte la estructura plana del backend a la estructura anidada del frontend
 */

import type { BackendFullCatalog, BackendCatalogOption } from '../services/catalogAPI';
import type { CustomizationCatalog, CustomizationOption, HouseModel } from '../types';

/**
 * Transforma el catálogo completo del backend al formato del frontend
 */
export function transformBackendCatalog(
  backendData: BackendFullCatalog
): CustomizationCatalog {
  console.log('[catalogTransformer] Transformando catálogo del backend...');

  // Transformar modelos de casa (el backend ya devuelve la estructura correcta)
  const houseModels: HouseModel[] = backendData.houseModels.map(model => ({
    id: model.id,
    name: model.name,
    description: model.description || 'Modelo disponible',
    image: model.image || undefined,
    floorPlans: {
      plantaBaja: model.floorPlans.plantaBaja || '',
      plantaAlta: model.floorPlans.plantaAlta || undefined,
    },
  }));

  console.log(`[catalogTransformer] Transformados ${houseModels.length} modelos`);

  // Acceder directamente a las opciones del backend (sin transformar primero)
  const allOptions = backendData.options || {};

  console.log('[catalogTransformer] Estructura de interiores:', {
    tieneInteriores: !!allOptions.interiores,
    tieneColores: !!(allOptions.interiores as any)?.colores,
    tieneSala: !!(allOptions.interiores as any)?.colores?.sala,
    cantidadSala: (allOptions.interiores as any)?.colores?.sala?.length || 0,
  });

  // Construir el catálogo completo (acceso directo a estructura del backend)
  const catalog: CustomizationCatalog = {
    houseModels,
    options: {
      interiores: {
        // Combinar colores y maderas en un solo array por área
        sala: [
          ...transformArray((allOptions.interiores as any)?.colores?.sala),
          ...transformArray((allOptions.interiores as any)?.maderas?.sala)
        ],
        comedor: [
          ...transformArray((allOptions.interiores as any)?.colores?.comedor),
          ...transformArray((allOptions.interiores as any)?.maderas?.comedor)
        ],
        recamara1: transformArray((allOptions.interiores as any)?.colores?.recamara1),
        recamara2: transformArray((allOptions.interiores as any)?.colores?.recamara2),
        recamara3: transformArray((allOptions.interiores as any)?.colores?.recamara3),
        escaleras: [
          ...transformArray((allOptions.interiores as any)?.colores?.estudio), // Backend usa "estudio"
          ...transformArray((allOptions.interiores as any)?.maderas?.escalera)
        ],
      },
      cocina: {
        alacenas: {
          // Backend: cocina.gabinetes.cocina
          superior: transformArray((allOptions.cocina as any)?.gabinetes?.cocina),
          inferior: transformArray((allOptions.cocina as any)?.gabinetes?.cocina),
          barraL: transformArray((allOptions.cocina as any)?.gabinetes?.cocina),
          extra: transformArray((allOptions.cocina as any)?.gabinetes?.cocina),
        },
        // Backend: cocina.cubiertas.cocina
        cubierta: transformArray((allOptions.cocina as any)?.cubiertas?.cocina),
        // Backend: cocina.salpicaderas.cocina
        backsplash: transformArray((allOptions.cocina as any)?.salpicaderas?.cocina),
        // Backend: cocina.fregaderos.cocina
        tarja: transformArray((allOptions.cocina as any)?.fregaderos?.cocina),
      },
      banos: {
        muebles: {
          // Backend: banos.muebles.{bano1,bano2,bano3}
          banoA: transformArray((allOptions.banos as any)?.muebles?.bano1),
          banoB: transformArray((allOptions.banos as any)?.muebles?.bano2),
          banoC: transformArray((allOptions.banos as any)?.muebles?.bano3),
          color: transformArray((allOptions.banos as any)?.muebles?.bano1),
        },
        acabados: {
          // Backend: banos.vidrios.bano1
          canceles: transformArray((allOptions.banos as any)?.vidrios?.bano1),
        },
      },
      closets: {
        // Backend: closets.recamaras.{recamara1,recamara2,recamara3}
        recamara1: transformArray((allOptions.closets as any)?.recamaras?.recamara1),
        recamara2: transformArray((allOptions.closets as any)?.recamaras?.recamara2),
        recamara3: transformArray((allOptions.closets as any)?.recamaras?.recamara3),
        muebleBajoEscalera: transformArray((allOptions.closets as any)?.recamaras?.recamara1),
        puertasMarcoEscalera: transformArray((allOptions.closets as any)?.recamaras?.recamara1),
      },
      extras: {
        // Backend: extras.fachadas.exterior
        fachadas: transformArray((allOptions.extras as any)?.fachadas?.exterior),
        // Backend: extras.clima.{sala,comedor,recamara1,etc}
        minisplit: [
          ...transformArray((allOptions.extras as any)?.clima?.sala),
          ...transformArray((allOptions.extras as any)?.clima?.recamara1),
        ],
        // Backend: extras.protecciones.{ventanas,puertas}
        protecciones: [
          ...transformArray((allOptions.extras as any)?.protecciones?.ventanas),
          ...transformArray((allOptions.extras as any)?.protecciones?.puertas),
        ],
        // Backend: extras.paneles.techo
        paneles: transformArray((allOptions.extras as any)?.paneles?.techo),
        patio: {
          estilos: [],
          domos: [],
        },
        reflejante: [],
      },
    },
  };

  console.log('[catalogTransformer] Transformación completa:', {
    modelos: catalog.houseModels.length,
    interioresSala: catalog.options.interiores.sala.length,
    opcionesCocina: catalog.options.cocina.cubierta.length,
  });

  return catalog;
}

/**
 * Transforma un array de opciones del backend, manejando casos null/undefined
 */
function transformArray(backendArray: any[] | undefined | null): CustomizationOption[] {
  if (!backendArray || !Array.isArray(backendArray)) {
    return [];
  }
  return backendArray.map(transformOption);
}

/**
 * Transforma una opción individual del backend al formato del frontend
 */
function transformOption(backendOption: BackendCatalogOption): CustomizationOption {
  return {
    id: backendOption.id.toString(),
    name: backendOption.name,
    image: backendOption.image || undefined,
    category: backendOption.category || 'general',
    subcategory: backendOption.subcategory,
    price: backendOption.price,
  };
}


/**
 * Función auxiliar para debugging - muestra la estructura del catálogo transformado
 */
export function debugCatalogStructure(catalog: CustomizationCatalog): void {
  console.group('[catalogTransformer] Estructura del catálogo');

  console.log('Modelos:', catalog.houseModels.map(m => m.name));

  console.log('Interiores:', {
    sala: catalog.options.interiores.sala.length,
    comedor: catalog.options.interiores.comedor.length,
    recamara1: catalog.options.interiores.recamara1.length,
    recamara2: catalog.options.interiores.recamara2.length,
    recamara3: catalog.options.interiores.recamara3.length,
    escaleras: catalog.options.interiores.escaleras.length,
  });

  console.log('Cocina:', {
    alacenas: Object.keys(catalog.options.cocina.alacenas).reduce((acc, key) => {
      acc[key] = catalog.options.cocina.alacenas[key as keyof typeof catalog.options.cocina.alacenas].length;
      return acc;
    }, {} as Record<string, number>),
    cubierta: catalog.options.cocina.cubierta.length,
    backsplash: catalog.options.cocina.backsplash.length,
    tarja: catalog.options.cocina.tarja.length,
  });

  console.log('Baños:', {
    muebles: Object.keys(catalog.options.banos.muebles).reduce((acc, key) => {
      acc[key] = catalog.options.banos.muebles[key as keyof typeof catalog.options.banos.muebles].length;
      return acc;
    }, {} as Record<string, number>),
    canceles: catalog.options.banos.acabados.canceles.length,
  });

  console.log('Closets:', Object.keys(catalog.options.closets).reduce((acc, key) => {
    acc[key] = catalog.options.closets[key as keyof typeof catalog.options.closets].length;
    return acc;
  }, {} as Record<string, number>));

  console.log('Extras:', {
    fachadas: catalog.options.extras.fachadas.length,
    minisplit: catalog.options.extras.minisplit.length,
    protecciones: catalog.options.extras.protecciones.length,
    paneles: catalog.options.extras.paneles.length,
    patio: {
      estilos: catalog.options.extras.patio.estilos.length,
      domos: catalog.options.extras.patio.domos.length,
    },
    reflejante: catalog.options.extras.reflejante.length,
  });

  console.groupEnd();
}
