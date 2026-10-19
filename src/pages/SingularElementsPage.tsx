import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Folder,
  ChevronRight,
  Flame,
  LayoutGrid,
  List,
} from 'lucide-react';
import { motion } from 'motion/react';
import { TopBanner } from '../components/TopBanner';
import { useLanguage } from '../context/LanguageContext';
import {
  SingularElement,
  MunicipalityFolder,
  MUNICIPALITIES_MOCK,
  getElementsByMunicipality,
  getSingularElementMedia,
} from '../services/singularElementsService';

export default function SingularElementsPage() {
  const { t } = useLanguage();
  const { municipio } = useParams<{ municipio?: string }>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentMunicipality = municipio
    ? MUNICIPALITIES_MOCK.find((m) => m.slug.toLowerCase() === municipio.toLowerCase())
    : undefined;

  const municipalityElements = currentMunicipality
    ? getElementsByMunicipality(currentMunicipality.slug)
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (currentMunicipality) {
      document.title = `La Rutalopó - ${currentMunicipality.nombre}`;
    } else {
      document.title = 'La Rutalopó - Elements singulars';
    }
  }, [currentMunicipality]);

  return (
    <div className="min-h-screen bg-brand-beige text-stone-800 font-sans selection:bg-brand-purple selection:text-white flex flex-col">
      <TopBanner />

      {/* CABECERA */}
      <header className="sticky top-0 z-40 bg-brand-beige/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {currentMunicipality ? (
            <Link
              to="/patrimoni"
              className="inline-flex items-center gap-1.5 text-brand-purple hover:text-brand-ochre transition-colors font-semibold text-sm"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Municipis</span>
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-brand-purple hover:text-brand-ochre transition-colors font-semibold text-sm"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>{t.backBtn || 'Inici'}</span>
            </Link>
          )}

          <span className="font-bold text-base text-brand-purple">
            {currentMunicipality ? currentMunicipality.nombre : 'Elements singulars'}
          </span>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
        {!currentMunicipality ? (
          /* VISTA 1: CARPETAS VISUALES POR MUNICIPIO CON COLLAGE */
          <>
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                Elements singulars del territori
              </h1>
              <p className="text-stone-600 text-sm sm:text-base max-w-2xl">
                Selecciona un municipi per explorar el seu catàleg d&apos;elements patrimonials.
              </p>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {MUNICIPALITIES_MOCK.map((folder, index) => (
                <MunicipalityFolderCard key={folder.slug} folder={folder} index={index} />
              ))}
            </section>
          </>
        ) : (
          /* VISTA 2: ELEMENTOS DENTRO DEL MUNICIPIO (Con Switch Quadrícula / Llista) */
          <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <Link to="/patrimoni" className="hover:text-brand-purple transition-colors">
                    Municipis
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-stone-800 font-medium">{currentMunicipality.nombre}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                  {currentMunicipality.nombre}
                </h1>
                <p className="text-stone-600 text-sm sm:text-base">
                  {currentMunicipality.descripcion}
                </p>
              </div>

              {/* Switch de vista: Quadrícula / Llista */}
              <div className="inline-flex items-center bg-stone-200/80 p-1 rounded-xl self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-brand-purple shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Quadrícula</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-brand-purple shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span>Llista</span>
                </button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {municipalityElements.map((element, index) => {
                  const { mainImageUrl } = getSingularElementMedia(element);
                  return (
                    <ElementCard
                      key={element.id}
                      element={element}
                      mainImageUrl={mainImageUrl}
                      index={index}
                    />
                  );
                })}
              </section>
            ) : (
              <section className="flex flex-col gap-3">
                {municipalityElements.map((element, index) => {
                  const { mainImageUrl } = getSingularElementMedia(element);
                  return (
                    <ElementListItem
                      key={element.id}
                      element={element}
                      mainImageUrl={mainImageUrl}
                      index={index}
                    />
                  );
                })}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* ============================================================================
 * SUBCOMPONENTE: CARPETA VISUAL DE MUNICIPIO CON COLLAGE (MÁX 3/4 IMÁGENES)
 * ============================================================================ */
interface MunicipalityFolderCardProps {
  folder: MunicipalityFolder;
  index: number;
}

const MunicipalityFolderCard: React.FC<MunicipalityFolderCardProps> = ({ folder, index }) => {
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const allElements = getElementsByMunicipality(folder.slug);
  const count = allElements.length;

  // Tomamos hasta 4 imágenes para hacer el collage
  const collageUrls = allElements
    .slice(0, 4)
    .map((el) => getSingularElementMedia(el).mainImageUrl)
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`/patrimoni/${folder.slug}`}
        className="group block bg-white rounded-xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-brand-ochre transition-all overflow-hidden"
      >
        {/* Pestaña superior de carpeta */}
        <div className="bg-stone-100 px-4 py-2.5 border-b border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm">
            <Folder className="w-4 h-4 text-brand-ochre fill-brand-ochre/30" />
            <span>{folder.nombre}</span>
          </div>
          <span className="text-xs text-stone-500">
            {count} {count === 1 ? 'element' : 'elements'}
          </span>
        </div>

        {/* Collage de previsualización (máx 3 o 4 imágenes) */}
        <div className="relative aspect-[16/10] bg-stone-200 overflow-hidden p-1">
          {collageUrls.length >= 4 ? (
            <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-full rounded-lg overflow-hidden">
              {collageUrls.slice(0, 4).map((url, idx) => (
                <div key={idx} className="relative w-full h-full bg-stone-200 overflow-hidden">
                  {!failedUrls[url] ? (
                    <img
                      src={url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      onError={() => setFailedUrls((prev) => ({ ...prev, [url]: true }))}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-200">
                      <Flame className="w-5 h-5 text-brand-ochre/60" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : collageUrls.length === 3 ? (
            <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-full rounded-lg overflow-hidden">
              {collageUrls.map((url, idx) => (
                <div
                  key={idx}
                  className={`relative w-full h-full bg-stone-200 overflow-hidden ${
                    idx === 0 ? 'row-span-2' : ''
                  }`}
                >
                  {!failedUrls[url] ? (
                    <img
                      src={url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      onError={() => setFailedUrls((prev) => ({ ...prev, [url]: true }))}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-200">
                      <Flame className="w-5 h-5 text-brand-ochre/60" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : collageUrls.length === 2 ? (
            <div className="grid grid-cols-2 gap-1 w-full h-full rounded-lg overflow-hidden">
              {collageUrls.map((url, idx) => (
                <div key={idx} className="relative w-full h-full bg-stone-200 overflow-hidden">
                  {!failedUrls[url] ? (
                    <img
                      src={url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      onError={() => setFailedUrls((prev) => ({ ...prev, [url]: true }))}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-200">
                      <Flame className="w-5 h-5 text-brand-ochre/60" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : collageUrls.length === 1 ? (
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              {!failedUrls[collageUrls[0]] ? (
                <img
                  src={collageUrls[0]}
                  alt={folder.nombre}
                  loading="lazy"
                  decoding="async"
                  onError={() => setFailedUrls((prev) => ({ ...prev, [collageUrls[0]]: true }))}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-200">
                  <Folder className="w-12 h-12 text-brand-ochre/60" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400">
              <Folder className="w-12 h-12 text-brand-ochre/60" />
            </div>
          )}
        </div>

        <div className="p-4 flex items-center justify-between">
          <p className="text-xs text-stone-600 line-clamp-1">{folder.descripcion}</p>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-brand-purple group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
};

/* ============================================================================
 * SUBCOMPONENTE: TARJETA EN QUADRÍCULA (Con enlace a su URL fija)
 * ============================================================================ */
interface ElementCardProps {
  element: SingularElement;
  mainImageUrl: string;
  index: number;
}

const ElementCard: React.FC<ElementCardProps> = ({ element, mainImageUrl, index }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Link
        to={`/patrimoni/${element.municipioSlug}/${element.id}`}
        className="group block bg-white rounded-xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-brand-ochre transition-all overflow-hidden h-full"
      >
        {/* Imagen principal recortada con object-cover */}
        <div className="relative aspect-[4/3] w-full bg-stone-200 overflow-hidden">
          {!imgError && mainImageUrl ? (
            <img
              src={mainImageUrl}
              alt={element.nombre}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400">
              <Flame className="w-10 h-10 text-brand-ochre/70" />
            </div>
          )}
        </div>

        {/* Contenido limpio de la tarjeta */}
        <div className="p-5 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-stone-100 text-stone-700">
              {element.poblacio}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-brand-ochre/20 text-stone-800">
              {element.fichaTecnica.tipusProduccio}
            </span>
          </div>

          <h2 className="text-lg font-bold text-stone-900 group-hover:text-brand-purple transition-colors leading-snug">
            {element.nombre}
          </h2>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {element.caracteristiques}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

/* ============================================================================
 * SUBCOMPONENTE: FILA EN VISTA DE LISTA
 * ============================================================================ */
const ElementListItem: React.FC<ElementCardProps> = ({ element, mainImageUrl, index }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
    >
      <Link
        to={`/patrimoni/${element.municipioSlug}/${element.id}`}
        className="group flex items-center gap-4 sm:gap-5 bg-white rounded-xl border border-stone-200/90 p-3 sm:p-4 shadow-xs hover:shadow-md hover:border-brand-ochre transition-all"
      >
        {/* Miniatura */}
        <div className="relative w-20 h-20 sm:w-28 sm:h-24 rounded-lg bg-stone-200 overflow-hidden flex-shrink-0">
          {!imgError && mainImageUrl ? (
            <img
              src={mainImageUrl}
              alt={element.nombre}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400">
              <Flame className="w-6 h-6 text-brand-ochre/70" />
            </div>
          )}
        </div>

        {/* Info central */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-stone-100 text-stone-700">
              {element.poblacio}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-brand-ochre/20 text-stone-800">
              {element.fichaTecnica.tipusProduccio}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-brand-purple transition-colors truncate">
            {element.nombre}
          </h2>

          <p className="text-xs text-stone-500 line-clamp-1 sm:line-clamp-2 leading-relaxed">
            {element.caracteristiques}
          </p>
        </div>

        {/* Flecha derecha */}
        <div className="pr-1 text-stone-400 group-hover:text-brand-purple group-hover:translate-x-0.5 transition-all flex-shrink-0">
          <ChevronRight className="w-5 h-5" />
        </div>
      </Link>
    </motion.div>
  );
};
