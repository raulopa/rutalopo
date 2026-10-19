import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Flame,
  Maximize2,
  CircleDot,
  ArrowUpDown,
  Compass,
  Box,
  Layers,
  X,
  ZoomIn,
  Image as ImageIcon,
  Map as MapIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TopBanner } from '../components/TopBanner';
import {
  getSingularElementById,
  getSingularElementMedia,
} from '../services/singularElementsService';

export default function SingularElementDetailPage() {
  const { id } = useParams<{ municipio?: string; id: string }>();
  const element = id ? getSingularElementById(id) : undefined;
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [planolImgError, setPlanolImgError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setFailedImages({});
    setPlanolImgError(false);
    if (element) {
      document.title = `La Rutalopó - ${element.nombre}`;
    }
  }, [element]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxImage) {
        setLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage]);

  if (!element) {
    return (
      <div className="min-h-screen bg-brand-beige text-stone-800 flex flex-col">
        <TopBanner />
        <header className="sticky top-0 z-40 bg-brand-beige/95 backdrop-blur-md border-b border-stone-200 px-4 py-3.5 sm:px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              to="/patrimoni"
              className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-ochre transition-colors font-semibold text-sm"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Tornar al catàleg</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold text-stone-800">Element no trobat</h1>
          <p className="text-stone-600 text-sm">
            No s&apos;ha trobat la fitxa sol·licitada.
          </p>
          <Link
            to="/patrimoni"
            className="inline-block bg-brand-purple text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
          >
            Veure tots els municipis
          </Link>
        </main>
      </div>
    );
  }

  const { mainImageUrl, photoUrls, planolUrl } = getSingularElementMedia(element);
  const photos = photoUrls && photoUrls.length > 0 ? photoUrls : [mainImageUrl];
  const totalMediaCount = photos.length + (planolUrl ? 1 : 0);
  const isSingleImageLayout = totalMediaCount === 1 && !planolUrl;

  const gridColsClass =
    totalMediaCount >= 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 md:grid-cols-2';

  const { fichaTecnica } = element;
  const dimensionsForn = fichaTecnica.dimensionsForn || [];
  const isMultiForn = dimensionsForn.length > 1;
  const hasFornSection = Boolean(fichaTecnica.superficieTotal || dimensionsForn.length > 0);

  return (
    <div className="min-h-screen bg-brand-beige text-stone-800 font-sans selection:bg-brand-purple selection:text-white flex flex-col">
      <TopBanner />

      {/* CABECERA DE NAVEGACIÓN */}
      <header className="sticky top-0 z-40 bg-brand-beige/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3.5 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to={`/patrimoni/${element.municipioSlug}`}
            className="inline-flex items-center gap-1.5 text-brand-purple hover:text-brand-ochre transition-colors font-semibold text-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{element.poblacio}</span>
          </Link>

          <span className="text-sm font-semibold text-stone-600 truncate max-w-[220px] sm:max-w-none">
            {element.nombre}
          </span>
        </div>
      </header>

      {/* CONTENIDO DE LA FICHA */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* TÍTULO Y SUBTÍTULO LIMPIOS */}
        <section className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-600">
            <span className="px-3 py-1 rounded-lg bg-stone-200/80 text-stone-700">
              {element.poblacio}
            </span>
            <span className="px-3 py-1 rounded-lg bg-brand-ochre/25 text-stone-800">
              {fichaTecnica.tipusProduccio}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight pt-1">
            {element.nombre}
          </h1>
          {element.subtituloPropietari && (
            <p className="text-sm sm:text-base text-stone-500">
              {element.subtituloPropietari}
            </p>
          )}
        </section>

        {isSingleImageLayout ? (
          /* DISEÑO EN 2 COLUMNAS PARA IMAGEN VERTICAL (Característiques + KPIs a un lado y la imagen al otro) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Columna Izquierda: Característiques + KPIs */}
            <div className="lg:col-span-7 space-y-6">
              <section className="bg-white rounded-xl p-6 border border-stone-200/90 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-stone-900">Característiques</h2>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                  {element.caracteristiques}
                </p>

                {element.procesIntro && (
                  <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                    {element.procesIntro}
                  </p>
                )}

                {element.procesSteps && element.procesSteps.length > 0 && (
                  <ol className="list-decimal list-inside space-y-1.5 text-stone-700 text-sm sm:text-base pl-1">
                    {element.procesSteps.map((step, i) => (
                      <li key={i} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                )}

                {element.paragrafsAdicionals &&
                  element.paragrafsAdicionals.map((paragraf, i) => (
                    <p key={i} className="text-stone-700 text-sm sm:text-base leading-relaxed">
                      {paragraf}
                    </p>
                  ))}
              </section>

              {fichaTecnica.dadesTecniques && fichaTecnica.dadesTecniques.length > 0 && (
                <section className="bg-white rounded-xl p-6 border border-stone-200/90 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-stone-900">Dades tècniques</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {fichaTecnica.dadesTecniques.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-brand-beige/60 rounded-xl p-4 border border-stone-200/60"
                      >
                        <span className="text-xs text-stone-500 block">{item.label}</span>
                        <span className="text-lg font-bold text-stone-900 mt-0.5 block">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Columna Derecha: Imagen Vertical */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden flex flex-col">
                <div className="relative bg-stone-100 overflow-hidden group">
                  {!failedImages[photos[0]] && photos[0] ? (
                    <img
                      src={photos[0]}
                      alt={element.nombre}
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [photos[0]]: true }))
                      }
                      onClick={() =>
                        setLightboxImage({
                          url: photos[0],
                          title: element.nombre,
                        })
                      }
                      className="w-full h-auto object-contain cursor-zoom-in group-hover:scale-102 transition-transform duration-300"
                    />
                  ) : (
                    <div className="aspect-[3/4] w-full flex flex-col items-center justify-center p-6 text-stone-400">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <span className="text-xs">{element.nombre}</span>
                    </div>
                  )}

                  {!failedImages[photos[0]] && photos[0] && (
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxImage({
                          url: photos[0],
                          title: element.nombre,
                        })
                      }
                      className="absolute bottom-3 right-3 bg-stone-900/75 hover:bg-stone-900 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-xs flex items-center gap-1.5 transition-colors"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      Ampliar
                    </button>
                  )}
                </div>
                <div className="px-4 py-3 text-xs text-stone-600 font-medium border-t border-stone-100">
                  Esquema / Fotografia principal
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* DISEÑO ESTÁNDAR PARA FORNS (Múltiples fotos o Foto + Plano) */
          <>
            <div className="flex flex-col gap-8">
              {/* CARACTERÍSTIQUES (Primero en móvil, después de las imágenes en escritorio) */}
              <section className="order-1 md:order-2 bg-white rounded-xl p-6 border border-stone-200/90 shadow-xs space-y-4">
                <h2 className="text-base font-bold text-stone-900">Característiques</h2>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                  {element.caracteristiques}
                </p>

                {element.procesIntro && (
                  <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                    {element.procesIntro}
                  </p>
                )}

                {element.procesSteps && element.procesSteps.length > 0 && (
                  <ol className="list-decimal list-inside space-y-1.5 text-stone-700 text-sm sm:text-base pl-1">
                    {element.procesSteps.map((step, i) => (
                      <li key={i} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                )}

                {element.paragrafsAdicionals &&
                  element.paragrafsAdicionals.map((paragraf, i) => (
                    <p key={i} className="text-stone-700 text-sm sm:text-base leading-relaxed">
                      {paragraf}
                    </p>
                  ))}
              </section>

              {/* GALERÍA DE IMÁGENES (Y PLANO SOLO SI EXISTE) */}
              <section className={`order-2 md:order-1 grid ${gridColsClass} gap-6`}>
                {photos.map((photoUrl, idx) => {
                  const hasError = !!failedImages[photoUrl];
                  const customLabel = element.storage.galleryLabels?.[idx];
                  const photoLabel =
                    customLabel ||
                    (photos.length > 1 ? `Fotografia ${idx + 1}` : 'Fotografia principal');

                  return (
                    <div
                      key={photoUrl}
                      className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-[4/3] bg-stone-200 overflow-hidden group">
                        {!hasError && photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={`${element.nombre} - ${photoLabel}`}
                            onError={() =>
                              setFailedImages((prev) => ({ ...prev, [photoUrl]: true }))
                            }
                            onClick={() =>
                              setLightboxImage({
                                url: photoUrl,
                                title: `${element.nombre} - ${photoLabel}`,
                              })
                            }
                            className="w-full h-full object-cover cursor-zoom-in group-hover:scale-102 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-stone-400">
                            <ImageIcon className="w-10 h-10 mb-2" />
                            <span className="text-xs">{photoLabel}</span>
                          </div>
                        )}

                        {!hasError && photoUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              setLightboxImage({
                                url: photoUrl,
                                title: `${element.nombre} - ${photoLabel}`,
                              })
                            }
                            className="absolute bottom-3 right-3 bg-stone-900/75 hover:bg-stone-900 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-xs flex items-center gap-1.5 transition-colors"
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                            Ampliar
                          </button>
                        )}
                      </div>
                      <div className="px-4 py-3 text-xs text-stone-600 font-medium border-t border-stone-100">
                        {photoLabel}
                      </div>
                    </div>
                  );
                })}

                {/* Plano del elemento (solo se renderiza cuando el elemento tiene plano) */}
                {planolUrl && (
                  <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden flex flex-col">
                    <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden p-3 flex items-center justify-center group">
                      {!planolImgError ? (
                        <img
                          src={planolUrl}
                          alt={`Plànol de ${element.nombre}`}
                          onError={() => setPlanolImgError(true)}
                          onClick={() =>
                            setLightboxImage({
                              url: planolUrl,
                              title: `Plànol - ${element.nombre}`,
                            })
                          }
                          className="w-full h-full object-contain cursor-zoom-in group-hover:scale-102 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-stone-400">
                          <MapIcon className="w-10 h-10 mb-2" />
                          <span className="text-xs">Plànol de l&apos;element</span>
                        </div>
                      )}
                      {!planolImgError && (
                        <button
                          type="button"
                          onClick={() =>
                            setLightboxImage({
                              url: planolUrl,
                              title: `Plànol - ${element.nombre}`,
                            })
                          }
                          className="absolute bottom-3 right-3 bg-stone-900/75 hover:bg-stone-900 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-xs flex items-center gap-1.5 transition-colors"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                          Ampliar
                        </button>
                      )}
                    </div>
                    <div className="px-4 py-3 text-xs text-stone-600 font-medium border-t border-stone-100">
                      Plànol de l&apos;element
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* SECCIÓN TÉCNICA PARA FORNS: SUPERFÍCIE, FORN(S) Y PATI CENTRAL */}
            {(hasFornSection || fichaTecnica.patiCentral) && (
              <section
                className={`grid grid-cols-1 ${
                  hasFornSection && fichaTecnica.patiCentral ? 'md:grid-cols-2' : ''
                } gap-6`}
              >
                {hasFornSection && (
                  <div className="bg-white rounded-xl p-6 border border-stone-200/90 shadow-xs space-y-5">
                    {fichaTecnica.superficieTotal && (
                      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                            <Maximize2 className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs text-stone-500 block">Superfície total</span>
                            <span className="text-xl font-bold text-stone-900">
                              {fichaTecnica.superficieTotal}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-stone-500 block">Tipus de producció</span>
                          <span className="text-sm font-semibold text-stone-800">
                            {fichaTecnica.tipusProduccio}
                          </span>
                        </div>
                      </div>
                    )}

                    {dimensionsForn.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                          <Flame className="w-4 h-4 text-brand-purple" />
                          {fichaTecnica.fornsTitle || 'Dimensions del Forn'}
                        </h3>

                        <div className="space-y-3">
                          {dimensionsForn.map((forn, idx) => (
                            <div key={idx} className="grid grid-cols-2 gap-3">
                              <div className="bg-brand-beige/60 rounded-xl p-4 border border-stone-200/60 flex items-start gap-3">
                                <CircleDot className="w-4 h-4 text-brand-purple mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="text-xs text-stone-500 block">
                                    {isMultiForn ? `Diàmetre ${idx + 1}` : 'Diàmetre'}
                                  </span>
                                  <span className="text-lg font-bold text-stone-900">
                                    {forn.diametre}
                                  </span>
                                </div>
                              </div>

                              <div className="bg-brand-beige/60 rounded-xl p-4 border border-stone-200/60 flex items-start gap-3">
                                <ArrowUpDown className="w-4 h-4 text-brand-purple mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="text-xs text-stone-500 block">
                                    {isMultiForn ? `Alçària ${idx + 1}` : 'Alçària'}
                                  </span>
                                  <span className="text-lg font-bold text-stone-900">
                                    {forn.alcaria}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bloque 2: Pati central */}
                {fichaTecnica.patiCentral && (
                  <div className="bg-white rounded-xl p-6 border border-stone-200/90 shadow-xs space-y-4">
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-brand-ochre" />
                      Pati central
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-brand-beige/60 rounded-xl p-4 border border-stone-200/60 flex items-start gap-3">
                        <Layers className="w-4 h-4 text-stone-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs text-stone-500 block">Superfície</span>
                          <span className="text-lg font-bold text-stone-900">
                            {fichaTecnica.patiCentral.superficie}
                          </span>
                        </div>
                      </div>

                      <div className="bg-brand-beige/60 rounded-xl p-4 border border-stone-200/60 flex items-start gap-3">
                        <Compass className="w-4 h-4 text-stone-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs text-stone-500 block">
                            {fichaTecnica.patiCentral.radiGirLabel ||
                              "Radi de gir del cercle de trituració d'algeps"}
                          </span>
                          <span className="text-lg font-bold text-stone-900">
                            {fichaTecnica.patiCentral.radiGirTrituracio}
                          </span>
                        </div>
                      </div>

                      {fichaTecnica.patiCentral.pilarEixEstat ? (
                        <div className="sm:col-span-2 bg-brand-beige/60 rounded-xl p-4 border border-stone-200/60 flex items-start gap-3">
                          <Box className="w-4 h-4 text-stone-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs text-stone-500 block">Pilar / Eix</span>
                            <span className="text-lg font-bold text-stone-900">
                              {fichaTecnica.patiCentral.pilarEixEstat}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          {fichaTecnica.patiCentral.alcariaPilarEix && (
                            <div className="bg-brand-beige/60 rounded-xl p-4 border border-stone-200/60 flex items-start gap-3">
                              <ArrowUpDown className="w-4 h-4 text-stone-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-xs text-stone-500 block">
                                  Alçària del Pilar - Eix
                                </span>
                                <span className="text-lg font-bold text-stone-900">
                                  {fichaTecnica.patiCentral.alcariaPilarEix}
                                </span>
                              </div>
                            </div>
                          )}

                          {fichaTecnica.patiCentral.dimensionsPilarEix && (
                            <div className="bg-brand-beige/60 rounded-xl p-4 border border-stone-200/60 flex items-start gap-3">
                              <Box className="w-4 h-4 text-stone-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-xs text-stone-500 block">
                                  Dimensions del Pilar - Eix
                                </span>
                                <span className="text-lg font-bold text-stone-900">
                                  {fichaTecnica.patiCentral.dimensionsPilarEix}
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}

            {fichaTecnica.dadesTecniques && fichaTecnica.dadesTecniques.length > 0 && (
              <section className="bg-white rounded-xl p-6 border border-stone-200/90 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-stone-900">Dades tècniques</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {fichaTecnica.dadesTecniques.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-brand-beige/60 rounded-xl p-4 border border-stone-200/60"
                    >
                      <span className="text-xs text-stone-500 block">{item.label}</span>
                      <span className="text-lg font-bold text-stone-900 mt-0.5 block">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {element.referenciaBiografica && (
              <section className="bg-white rounded-xl p-6 border border-stone-200/90 shadow-xs space-y-3">
                <h3 className="text-base font-bold text-stone-900">Referència biogràfica</h3>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                  {element.referenciaBiografica.text}
                </p>
                {element.referenciaBiografica.font && (
                  <p className="text-xs text-stone-500 italic pt-1 border-t border-stone-100">
                    {element.referenciaBiografica.font}
                  </p>
                )}
              </section>
            )}
          </>
        )}
      </main>

      {/* VISOR A PANTALLA COMPLETA */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-8"
          >
            <div className="max-w-5xl w-full flex items-center justify-between text-white mb-4">
              <span className="font-semibold text-sm sm:text-base">{lightboxImage.title}</span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              src={lightboxImage.url}
              alt={lightboxImage.title}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[82vh] max-w-full object-contain rounded-xl shadow-2xl bg-stone-900"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
