import type { HouseModel, CustomizationCatalog } from '../types';

export const houseModels: HouseModel[] = [
  {
    id: 'nicte',
    name: 'Nicté',
    description: 'Casa de 2 plantas con diseño moderno y funcional',
    image: '/images/models/nicte.jpg',
    floorPlans: {
      plantaBaja: '/images/plans/NICTÉ PLANTA BAJA.jpg',
      plantaAlta: '/images/plans/NICTÉ PLANTA ALTA.jpg',
    },
  },
  {
    id: 'ameyali',
    name: 'Ameyali',
    description: 'Casa elegante con espacios amplios y luminosos',
    image: '/images/models/ameyali.jpg',
    floorPlans: {
      plantaBaja: '/images/plans/AMEYALI PLANTA BAJA.jpg',
      plantaAlta: '/images/plans/AMEYALI PLANTA ALTA.jpg',
    },
  },
  {
    id: 'aruma',
    name: 'Aruma',
    description: 'Diseño contemporáneo con excelente distribución',
    image: '/images/models/aruma.jpg',
    floorPlans: {
      plantaBaja: '/images/plans/ARUMA PLANTA BAJA.jpg',
      plantaAlta: '/images/plans/ARUMA PLANTA ALTA.jpg',
    },
  },
  {
    id: 'malli',
    name: 'Malli',
    description: 'Casa familiar con espacios cómodos y versátiles',
    image: '/images/models/malli.jpg',
    floorPlans: {
      plantaBaja: '/images/plans/MALLI PLANTA BAJA.jpg',
      plantaAlta: '/images/plans/MALLI PLANTA ALTA.jpg',
    },
  },
  {
    id: 'sisa',
    name: 'Sisa',
    description: 'Arquitectura innovadora con toques tradicionales',
    image: '/images/models/sisa.jpg',
    floorPlans: {
      plantaBaja: '/images/plans/SISA PLANTA BAJA.jpg',
      plantaAlta: '/images/plans/SISA PLANTA ALTA.jpg',
    },
  },
  {
    id: 'lia',
    name: 'Lía',
    description: 'Casa compacta con máximo aprovechamiento del espacio',
    image: '/images/models/lia.jpg',
    floorPlans: {
      plantaBaja: '/images/plans/LÍA.jpg',
    },
  },
];

const interiorColors = [
  { id: 'balboa', name: 'Balboa', image: '/images/colors/Balboa.jpg', category: 'interior', subcategory: 'color' },
  { id: 'escarola', name: 'Escarola', image: '/images/colors/Escarola.jpg', category: 'interior', subcategory: 'color' },
  { id: 'jarron', name: 'Jarrón', image: '/images/colors/Jarrón.jpg', category: 'interior', subcategory: 'color' },
  { id: 'kiosco', name: 'Kiosco', image: '/images/colors/Kiosco.jpg', category: 'interior', subcategory: 'color' },
  { id: 'marcuan', name: 'Marcuán', image: '/images/colors/Marcuán.jpg', category: 'interior', subcategory: 'color' },
  { id: 'natuzzi', name: 'Natuzzi', image: '/images/colors/Natuzzi.jpg', category: 'interior', subcategory: 'color' },
  { id: 'peon', name: 'Peón', image: '/images/colors/Peón.jpg', category: 'interior', subcategory: 'color' },
  { id: 'salchicha', name: 'Salchicha', image: '/images/colors/Salchicha.jpg', category: 'interior', subcategory: 'color' },
  { id: 'titanio', name: 'Titanio', image: '/images/colors/Titanio.jpg', category: 'interior', subcategory: 'color' },
  { id: 'tofu', name: 'Tofu', image: '/images/colors/Tofu.jpg', category: 'interior', subcategory: 'color' },
  { id: 'toledano', name: 'Toledano', image: '/images/colors/Toledano.jpg', category: 'interior', subcategory: 'color' },
  { id: 'zenon', name: 'Zenón', image: '/images/colors/Zenón.jpg', category: 'interior', subcategory: 'color' },
];

const woodFinishes = [
  { id: 'aserrado-nordico', name: 'Aserrado Nórdico', image: '/images/wood/ASERRADO NORDICO.jpg', category: 'wood', subcategory: 'finish' },
  { id: 'blanco-absoluto', name: 'Blanco Absoluto', image: '/images/wood/BLANCO ABSOLUTO.jpg', category: 'wood', subcategory: 'finish' },
  { id: 'cairo', name: 'Cairo', image: '/images/wood/CAIRO.jpg', category: 'wood', subcategory: 'finish' },
  { id: 'cendra', name: 'Cendra', image: '/images/wood/CENDRA.jpg', category: 'wood', subcategory: 'finish' },
  { id: 'chardonnay', name: 'Chardonnay', image: '/images/wood/CHARDONNAY.jpg', category: 'wood', subcategory: 'finish' },
  { id: 'dakota', name: 'Dakota', image: '/images/wood/DAKOTA.jpg', category: 'wood', subcategory: 'finish' },
  { id: 'linosa-ceniza', name: 'Linosa Ceniza', image: '/images/wood/LINOSA CENIZA.jpg', category: 'wood', subcategory: 'finish' },
  { id: 'nogal-terracota', name: 'Nogal Terracota', image: '/images/wood/NOGAL TERRACOTA.jpg', category: 'wood', subcategory: 'finish' },
  { id: 'nougat', name: 'Nougat', image: '/images/wood/NOUGAT.jpg', category: 'wood', subcategory: 'finish' },
  { id: 'oxford', name: 'Oxford', image: '/images/wood/OXFORD.jpg', category: 'wood', subcategory: 'finish' },
  { id: 'riviera', name: 'Riviera', image: '/images/wood/RIVIERA.jpg', category: 'wood', subcategory: 'finish' },
  { id: 'toscana', name: 'Toscana', image: '/images/wood/TOSCANA.jpg', category: 'wood', subcategory: 'finish' },
  { id: 'turmalina', name: 'Turmalina', image: '/images/wood/TURMALINA.jpg', category: 'wood', subcategory: 'finish' },
];

export const mockCatalog: CustomizationCatalog = {
  houseModels,
  options: {
    interiores: {
      // Combinar colores y maderas en un solo array por área
      sala: [...interiorColors, ...woodFinishes],
      comedor: [...interiorColors, ...woodFinishes],
      recamara1: interiorColors,
      recamara2: interiorColors,
      recamara3: interiorColors,
      escaleras: [...interiorColors, ...woodFinishes],
    },
    cocina: {
      alacenas: {
        superior: woodFinishes,
        inferior: woodFinishes,
        barraL: woodFinishes,
        extra: woodFinishes,
      },
      cubierta: [
        { id: 'cuarzo', name: 'Cuarzo', image: '/images/kitchen/Cuarzo.jpg', category: 'kitchen', subcategory: 'countertop' },
        { id: 'granito-negro', name: 'Granito Negro', image: '/images/kitchen/GRANITO NEGRO.jpg', category: 'kitchen', subcategory: 'countertop' },
        { id: 'formica-ebony', name: 'Formica Ebony Oxide', image: '/images/kitchen/FORMICA EBONY OXIDE.jpg', category: 'kitchen', subcategory: 'countertop' },
      ],
      backsplash: [
        { id: 'ceramico', name: 'Backsplash Cerámico', image: '/images/kitchen/Backsplash cerámico.jpg', category: 'kitchen', subcategory: 'backsplash' },
        { id: 'granito', name: 'Backsplash Granito', image: '/images/kitchen/Backsplash granito.jpg', category: 'kitchen', subcategory: 'backsplash' },
      ],
      tarja: [
        { id: 'tina-simple', name: '1 Tina', image: '/images/kitchen/1 tina.jpg', category: 'kitchen', subcategory: 'sink' },
        { id: 'tarja-doble-1', name: 'Tarja Doble 1', image: '/images/kitchen/Tarja doble 1.jpg', category: 'kitchen', subcategory: 'sink' },
        { id: 'tarja-doble-2', name: 'Tarja Doble 2', image: '/images/kitchen/Tarja doble 2.jpg', category: 'kitchen', subcategory: 'sink' },
      ],
    },
    banos: {
      muebles: {
        banoA: woodFinishes,
        banoB: woodFinishes,
        banoC: woodFinishes,
        color: woodFinishes,
      },
      acabados: {
        canceles: [
          { id: 'esmerilado', name: 'Esmerilado', image: '/images/bathroom/ESMERILADO.jpg', category: 'bathroom', subcategory: 'glass' },
          { id: 'transparente', name: 'Transparente', image: '/images/bathroom/TRASPARENTE.jpg', category: 'bathroom', subcategory: 'glass' },
        ],
      },
    },
    closets: {
      recamara1: woodFinishes,
      recamara2: woodFinishes,
      recamara3: woodFinishes,
      muebleBajoEscalera: woodFinishes,
      puertasMarcoEscalera: woodFinishes,
    },
    extras: {
      fachadas: [
        { id: 'balboa-fachada', name: 'Balboa', image: '/images/facade/Balboa.jpg', category: 'facade', subcategory: 'color' },
        { id: 'empanada', name: 'Empanada', image: '/images/facade/Empanada.jpg', category: 'facade', subcategory: 'color' },
        { id: 'ladrillo', name: 'Ladrillo', image: '/images/facade/Ladrillo.jpg', category: 'facade', subcategory: 'color' },
        { id: 'naranja-rustick', name: 'Naranja Rustick', image: '/images/facade/Naranja Rustick.jpg', category: 'facade', subcategory: 'color' },
        { id: 'peon-fachada', name: 'Peón', image: '/images/facade/Peón.jpg', category: 'facade', subcategory: 'color' },
      ],
      minisplit: [
        { id: 'minisplit-standard', name: 'Minisplit', image: '/images/extras/Minisplit.jpg', category: 'extras', subcategory: 'climate' },
      ],
      protecciones: [
        { id: 'ventana-inferior', name: 'Ventana Inferior', image: '/images/security/VENTANA INFERIOR.jpg', category: 'security', subcategory: 'protection' },
        { id: 'ventana-posterior', name: 'Ventana Posterior', image: '/images/security/VENTANA POSTERIOR.jpg', category: 'security', subcategory: 'protection' },
        { id: 'ventana-superior', name: 'Ventana Superior', image: '/images/security/VENTANA SUPERIOR.jpg', category: 'security', subcategory: 'protection' },
      ],
      paneles: [
        { id: 'paneles-fotovoltaicos', name: 'Paneles Fotovoltaicos', image: '/images/extras/Paneles fotovoltaicos.jpg', category: 'extras', subcategory: 'energy' },
      ],
      patio: {
        estilos: [
          { id: 'adoquin-gris', name: 'Adoquín Gris', image: '/images/patio/Adoquin gris.jpg', category: 'patio', subcategory: 'floor' },
          { id: 'adoquin-mezclado', name: 'Adoquín Mezclado', image: '/images/patio/Adoquin mezclado.jpg', category: 'patio', subcategory: 'floor' },
          { id: 'pasto-natural', name: 'Pasto Natural', image: '/images/patio/Pasto natural.jpg', category: 'patio', subcategory: 'floor' },
          { id: 'piso-ceramico', name: 'Piso Cerámico', image: '/images/patio/Piso cerámico.jpg', category: 'patio', subcategory: 'floor' },
          { id: 'piso-sintetico', name: 'Piso Sintético', image: '/images/patio/Piso sintético.jpg', category: 'patio', subcategory: 'floor' },
        ],
        domos: [
          { id: 'domo-aruma', name: 'Domo Aruma', image: '/images/patio/Aruma-51.jpg', category: 'patio', subcategory: 'dome' },
        ],
      },
      reflejante: [
        { id: 'ventana-posterior-ref', name: 'Ventana Posterior', image: '/images/reflective/Ventana posterior.jpg', category: 'reflective', subcategory: 'window' },
        { id: 'ventana-superior-ref', name: 'Ventana Superior', image: '/images/reflective/Ventana superior.jpg', category: 'reflective', subcategory: 'window' },
      ],
    },
  },
};