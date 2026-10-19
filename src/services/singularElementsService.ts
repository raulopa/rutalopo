import { supabase } from './supabaseClient';

/**
 * Dimensiones específicas de cada cilindro/cámara del horno (Forn)
 */
export interface FornDimensions {
  label?: string;   // Ej: "Forn 1", "Forn 2" (opcional si solo hay uno)
  diametre: string; // Ej: "2,30 m" o "2,50 m"
  alcaria: string;  // Ej: "4,45 m" o "3,30 m"
}

/**
 * Dimensiones y métricas del patio central de molienda (Pati central)
 */
export interface PatiCentralDimensions {
  superficie: string;                 // Ej: "49 m²" o "96 m²"
  radiGirTrituracio: string;          // Ej: "2,20 m" o "3 m"
  radiGirLabel?: string;              // Ej: "Radi de gir del cercle de trituració d'algeps" o "Radi de gir del cercle de xafat d'algeps"
  alcariaPilarEix?: string;           // Ej: "4,25 m"
  dimensionsPilarEix?: string;        // Ej: "60 x 60 cm"
  pilarEixEstat?: string;             // Ej: "Desaparegut" (cuando no existen medidas porque ha desaparecido)
}

export interface CustomTechnicalItem {
  label: string;
  value: string;
}

/**
 * Especificaciones técnicas para un Elemento Singular (Horno de Aljez, Pozo de Sal, etc.)
 */
export interface FornTechnicalSpecs {
  propietariInicial?: string;
  tipusProduccio: 'Industrial' | 'Tradicional' | 'Artesanal' | string;
  superficieTotal?: string;           // Ej: "156 m²" o "120 m²"
  fornsTitle?: string;                // Ej: "Dimensions del Forn" o "Dimensions dels forns 1 i 2"
  dimensionsForn?: FornDimensions[];
  patiCentral?: PatiCentralDimensions;
  dadesTecniques?: CustomTechnicalItem[];
}

/**
 * Estructura de archivos alojados en el bucket 'images' de Supabase
 */
export interface ElementStoragePaths {
  folderPath: string;        // Ej: "forn-1", "forn-4", "pou-de-la-sal", "empedrat-cabeco"
  mainImageFile: string;     // Ej: "forn-1.jpg", "estat-posterior.jpg"
  galleryFiles?: string[];   // Ej: ["estat-previ.jpg", "estat-posterior.jpg"]
  galleryLabels?: string[];  // Ej: ["Estat previ", "Estat posterior"]
  planolFile?: string;       // Opcional: Ej: "planol.png" o "planol.jpg"
}

export interface ReferenciaBiografica {
  text: string;
  font?: string;
}

/**
 * Interfaz principal para Elementos Singulares del Territorio (FornDeGuix / SingularElement)
 */
export interface SingularElement {
  id: string;
  nombre: string;
  subtituloPropietari?: string;
  municipioSlug: string;
  poblacio: string;
  categoria: string;
  caracteristiques: string;
  procesIntro?: string;
  procesSteps?: string[];
  paragrafsAdicionals?: string[];
  referenciaBiografica?: ReferenciaBiografica;
  storage: ElementStoragePaths;
  fichaTecnica: FornTechnicalSpecs;
}

export type FornDeGuix = SingularElement;

export interface MunicipalityFolder {
  slug: string;
  nombre: string;
  descripcion: string;
  coverElementFolder: string;
  coverImageFile: string;
}

const BUCKET_NAME = 'images';

/**
 * Obtiene la URL pública de un archivo dentro del bucket 'images' de Supabase Storage.
 * Patrón esperado en Supabase: images/{folderPath}/{fileName}
 * Ejemplo: images/forn-1/forn-1.jpg y images/forn-1/planol.jpg
 */
export function getSupabaseImageUrl(folderPath: string, fileName: string): string {
  const cleanFolder = folderPath.replace(/^\/+|\/+$/g, '');
  const cleanFile = fileName.replace(/^\/+/, '');
  const fullPath = `${cleanFolder}/${cleanFile}`;

  if (supabase) {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fullPath);
    if (data?.publicUrl) {
      return data.publicUrl;
    }
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  if (envUrl) {
    return `${envUrl.replace(/\/+$/, '')}/storage/v1/object/public/${BUCKET_NAME}/${fullPath}`;
  }

  return '';
}

/**
 * Devuelve todas las URLs públicas resueltas para un elemento singular
 */
export function getSingularElementMedia(element: SingularElement) {
  const { folderPath, mainImageFile, galleryFiles, planolFile } = element.storage;
  const files = galleryFiles && galleryFiles.length > 0 ? galleryFiles : [mainImageFile];
  return {
    mainImageUrl: getSupabaseImageUrl(folderPath, mainImageFile),
    photoUrls: files.map((file) => getSupabaseImageUrl(folderPath, file)),
    planolUrl: planolFile ? getSupabaseImageUrl(folderPath, planolFile) : null,
  };
}

/**
 * Carpetas visuales por municipio (de momento El Pinós)
 */
export const MUNICIPALITIES_MOCK: MunicipalityFolder[] = [
  {
    slug: 'el-pinos',
    nombre: 'El Pinós',
    descripcion: 'Forns de guix, pous de sal i patrimoni tradicional del terme municipal',
    coverElementFolder: 'forn-1',
    coverImageFile: 'forn-1.jpg',
  },
];

/**
 * Catálogo de Elementos Singulares (El Pinós)
 */
export const SINGULAR_ELEMENTS_MOCK: SingularElement[] = [
  {
    id: 'forn-1',
    nombre: 'Forn d’Algeps núm. 1',
    subtituloPropietari: 'Desconegut el propietari inicial',
    municipioSlug: 'el-pinos',
    poblacio: 'El Pinós',
    categoria: 'Forns de guix',
    caracteristiques:
      'Originalment cobert amb teulada. Destaca l’espai central tot enllosat per a mòlta d’Algeps, el Pilar–Eix de gir de l’animal amb el rul·lo per a triturar la pedra, el magatzem i el Forn.',
    storage: {
      folderPath: 'forn-1',
      mainImageFile: 'forn-1.jpg',
      planolFile: 'planol.jpg',
    },
    fichaTecnica: {
      propietariInicial: 'Desconegut el propietari inicial',
      tipusProduccio: 'Industrial',
      superficieTotal: '156 m²',
      fornsTitle: 'Dimensions del Forn',
      dimensionsForn: [
        {
          diametre: '2,30 m',
          alcaria: '4,45 m',
        },
      ],
      patiCentral: {
        superficie: '49 m²',
        radiGirTrituracio: '2,20 m',
        radiGirLabel: "Radi de gir del cercle de trituració d'algeps",
        alcariaPilarEix: '4,25 m',
        dimensionsPilarEix: '60 x 60 cm',
      },
    },
  },
  {
    id: 'forn-2',
    nombre: 'Forn d’Algeps núm. 2',
    subtituloPropietari: 'Desconegut el propietari inicial',
    municipioSlug: 'el-pinos',
    poblacio: 'El Pinós',
    categoria: 'Forns de guix',
    caracteristiques:
      'Forn de doble cilindre de cocció. Originalment cobert amb teulada, en el qual destaca l’espai central, tot enllosat, per a mòlta d’Algeps. Han desaparegut el pilar–eix central i rul·lo, per al triturat de la pedra. Adossat el magatzem del material.',
    storage: {
      folderPath: 'forn-2',
      mainImageFile: 'forn-2.jpg',
      planolFile: 'planol.png',
    },
    fichaTecnica: {
      propietariInicial: 'Desconegut el propietari inicial',
      tipusProduccio: 'Industrial',
      superficieTotal: '120 m²',
      fornsTitle: 'Dimensions dels forns 1 i 2',
      dimensionsForn: [
        {
          label: 'Forn 1',
          diametre: '2,50 m',
          alcaria: '3,30 m',
        },
        {
          label: 'Forn 2',
          diametre: '2,50 m',
          alcaria: '3,30 m',
        },
      ],
      patiCentral: {
        superficie: '96 m²',
        radiGirTrituracio: '3 m',
        radiGirLabel: "Radi de gir del cercle de xafat d'algeps",
        pilarEixEstat: 'Desaparegut',
      },
    },
  },
  {
    id: 'forn-3',
    nombre: 'Forn d’Algeps núm. 3',
    subtituloPropietari: 'Desconeguts els propietaris inicials',
    municipioSlug: 'el-pinos',
    poblacio: 'El Pinós',
    categoria: 'Forns de guix',
    caracteristiques:
      'Originàriament cobert amb teulada, en el qual destaca l’espai central de mòlta d’Algeps - tot enllosat -, el Pilar–Eix, el forn i el magatzem.',
    storage: {
      folderPath: 'forn-3',
      mainImageFile: 'forn-3.jpg',
      planolFile: 'planol.png',
    },
    fichaTecnica: {
      propietariInicial: 'Desconeguts els propietaris inicials',
      tipusProduccio: 'Industrial',
      superficieTotal: '118 m²',
      fornsTitle: 'Dimensions del Forn',
      dimensionsForn: [
        {
          diametre: '2,40 m',
          alcaria: '3,25 m',
        },
      ],
      patiCentral: {
        superficie: '67 m²',
        radiGirTrituracio: '2,6 m',
        radiGirLabel: "Radi de gir del cercle de triturat d'algeps",
        alcariaPilarEix: '4,75 m',
        dimensionsPilarEix: '120 cm',
      },
    },
  },
  {
    id: 'forn-4',
    nombre: 'Forn d’Algeps núm. 4',
    subtituloPropietari: 'Desconegut el propietari inicial',
    municipioSlug: 'el-pinos',
    poblacio: 'El Pinós',
    categoria: 'Forns de guix',
    caracteristiques:
      'Forn de doble cilindre de cocció. Originalment cobert amb teulada, en el qual destaca l’espai central, tot enllosat, per a mòlta d’Algeps. Han desaparegut el pilar–eix central i rul·lo, per al triturat de la pedra. Adossat el magatzem del material.',
    storage: {
      folderPath: 'forn-4',
      mainImageFile: 'forn-4-1.jpg',
      galleryFiles: ['forn-4-1.jpg', 'forn-4-2.jpg', 'forn-4-3.jpg'],
    },
    fichaTecnica: {
      propietariInicial: 'Desconegut el propietari inicial',
      tipusProduccio: 'Industrial',
      superficieTotal: '120 m²',
      fornsTitle: 'Dimensions dels forns 1 i 2',
      dimensionsForn: [
        {
          label: 'Forn 1',
          diametre: '2,50 m',
          alcaria: '3,30 m',
        },
        {
          label: 'Forn 2',
          diametre: '2,50 m',
          alcaria: '3,30 m',
        },
      ],
      patiCentral: {
        superficie: '96 m²',
        radiGirTrituracio: '3 m',
        radiGirLabel: "Radi de gir del cercle de xafat d'algeps",
        pilarEixEstat: 'Desaparegut',
      },
    },
  },
  {
    id: 'forn-5',
    nombre: 'Forn d’Algeps núm. 5',
    subtituloPropietari: 'Forn de “Primitivo”',
    municipioSlug: 'el-pinos',
    poblacio: 'El Pinós',
    categoria: 'Forns de guix',
    caracteristiques:
      'Forn circular aïllat sense elements associats més enllà d’una estructura separada que feia funció de magatzem. L’any 1977 conservava la coberta. Aquesta estructura feia funció de magatzem del material que s’havia cuit del forn i presenta una porta per a abocar-lo.',
    storage: {
      folderPath: 'forn-5',
      mainImageFile: 'forn-5-1.jpg',
      galleryFiles: ['forn-5-1.jpg', 'forn-5-2.jpg', 'forn-5-3.jpg'],
    },
    fichaTecnica: {
      propietariInicial: 'Forn de “Primitivo”',
      tipusProduccio: 'Industrial',
      superficieTotal: '150 m²',
      fornsTitle: 'Dimensions del Forn',
      dimensionsForn: [
        {
          diametre: '2,80 m',
          alcaria: '4,25 m',
        },
      ],
    },
  },
  {
    id: 'pou-de-la-sal',
    nombre: 'Pous de Sal',
    subtituloPropietari: 'Diapiro de Pinós',
    municipioSlug: 'el-pinos',
    poblacio: 'El Pinós',
    categoria: 'Pous de sal',
    caracteristiques:
      "La Sal del Diapiro de Pinós s'explota a través d'un sistema de pous d'injecció d'aigua que produeix la seua dissolució.",
    procesIntro:
      "Els sondejos, cilíndrics, aconsegueixen una profunditat d'1 km i un diàmetre de 80m dins del Diapiro amb el següent procés:",
    procesSteps: [
      "Injecció d'aigua procedent d'aqüífers salins pròxims.",
      'Dissolució de la Sal.',
      "Extracció d'aigua concentrada en Sal (Salmorra).",
      'Esta Salmorra, és transportada per una conducció de canonades a les Salines de la Mata-Torrevella.',
    ],
    paragrafsAdicionals: [
      "En els sondejos també s'injecta GASOIL, que en ser menys dens que l'aigua, se situa en la part superior i impedeix la dissolució de la part alta del pou, el sostre de la cavitat, i amb això evita la dissolució de la part superior del pou.",
      "La capacitat màxima d'explotació és de 1,5 milions de m³ moment en el qual s'abandona el sondeig i s'extrau el gasoil del seu interior. A partir d'eixe moment la cavitat comença a tancar-se de manera natural a causa de la plasticitat de la Sal.",
      "El rendiment en Sal de cada litre d'aigua és de 300gr enfront dels 35gr que s'obté de l'aigua de la mar.",
    ],
    storage: {
      folderPath: 'pou-de-la-sal',
      mainImageFile: 'pou-de-la-sal.png',
    },
    fichaTecnica: {
      tipusProduccio: 'Industrial',
      dadesTecniques: [
        { label: 'Profunditat del sondeig', value: '1 km' },
        { label: 'Diàmetre dins del Diapiro', value: '80 m' },
        { label: "Capacitat màxima d'explotació", value: '1,5 milions de m³' },
        { label: 'Rendiment per litre d’aigua', value: '300 gr (vs 35 gr aigua de mar)' },
      ],
    },
  },
  {
    id: 'empedrat-cabeco',
    nombre: 'Empedrat del Cabeço de la Sal',
    subtituloPropietari: 'Cabeço de la Sal',
    municipioSlug: 'el-pinos',
    poblacio: 'El Pinós',
    categoria: 'Patrimoni saliner',
    caracteristiques:
      "No disposem de documentació escrita sobre la funcionalitat d’aquest empedrat, però tenim testimoni oral que es feia servir per a l’acumulació de sal i posterior venda per a animals.",
    paragrafsAdicionals: [
      'La Sal, es dividia en munts de tres tipus. Els de major grandària per a animals grans, els mitjans per a animals més menuts i la resta es feia servir per a eixugar pells.',
      'Consta d’una superfície de 700 m², 350 m² empedrat i altres 350 sense empedrar.',
      'A més, tenim dos bassetes, també de pedres rodades, per a la neteja de les impureses exteriors de les boles de Sal per a animals.',
    ],
    storage: {
      folderPath: 'empedrat-cabeco',
      mainImageFile: 'estat-posterior.jpg',
      galleryFiles: ['estat-previ.jpg', 'estat-posterior.jpg'],
      galleryLabels: ['Estat previ', 'Estat posterior'],
    },
    fichaTecnica: {
      tipusProduccio: 'Tradicional',
      dadesTecniques: [
        { label: 'Superfície total', value: '700 m²' },
        { label: 'Distribució superfície', value: '350 m² empedrat · 350 m² sense empedrar' },
        { label: 'Bassa 1', value: '42 m² · Fondària: 40 cm' },
        { label: 'Bassa 2', value: '30 m² · Fondària: 40 cm' },
      ],
    },
  },
  {
    id: 'garita-guardia-civil',
    nombre: 'Garita de la Força per a Custòdia de la Sal',
    subtituloPropietari: 'Cabeço de la Sal',
    municipioSlug: 'el-pinos',
    poblacio: 'El Pinós',
    categoria: 'Patrimoni saliner',
    caracteristiques:
      "Aquesta edificació és una de les quatre que hem trobat al Cabeço; es van construir sis, i complia la funció de vigilància de la Sal com producte estanc i, possiblement, cobrament de l’impost estatal per la compra de Sal.",
    paragrafsAdicionals: [
      'La vigilància era exercida per la Guàrdia per a la custòdia de la Sal.',
      'Contaven amb Espitlleres (Finestres) a cada una de les quatre parets. Les característiques de les Espitlleres corresponen a construcció militar, amb angles oberts interiors per a augmentar la visió.',
    ],
    referenciaBiografica: {
      text: "Pascual Mádoz descriu, en els seus escrits, la existència d’una Caserna construïdes per la Força de resguard de la Sal, en la part alta del Cabeço de la Sal, a més, conta, que es varen construir tres casetes i tres garites distribuïdes per distintes parts del Cabeço de la Sal destinades per a albergar a les 20 persones que custodiaven la Sal com producte estanc i impedir la seua extracció clandestina.",
      font: 'Text tret del llibre editat per l’Ajuntament de Pinós: Historia de la Sal y el origen de las extracciones de Roca Ornamental en Pinoso.',
    },
    storage: {
      folderPath: 'garita-guardia-civil',
      mainImageFile: 'estat_posterior.jpg',
      galleryFiles: ['estat_previ.jpg', 'estat_posterior.jpg'],
      galleryLabels: ['Estat previ', 'Estat posterior'],
    },
    fichaTecnica: {
      tipusProduccio: 'Vigilància / Militar',
      dadesTecniques: [
        { label: 'Dimensions', value: '2,5 m x 2,5 m' },
        { label: 'Elements defensius', value: 'Espitlleres a les 4 parets (angles oberts)' },
        { label: 'Edificacions al Cabeço', value: '4 conservades (de 6 construïdes)' },
      ],
    },
  },
];

export function getElementsByMunicipality(municipioSlug: string): SingularElement[] {
  return SINGULAR_ELEMENTS_MOCK.filter(
    (el) => el.municipioSlug.toLowerCase() === municipioSlug.toLowerCase()
  );
}

export function getSingularElementById(id: string): SingularElement | undefined {
  return SINGULAR_ELEMENTS_MOCK.find((el) => el.id.toLowerCase() === id.toLowerCase());
}
