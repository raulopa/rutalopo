import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Loader2, Map, Calendar } from 'lucide-react';
import { inscriptionService, InscriptionStatus, InscriptionPreviousData } from '../services/inscriptionService';
import { useLanguage } from '../context/LanguageContext';
import { RutaPasaporte } from '../services/passportService';
import { Mountain, Navigation, Activity } from 'lucide-react';

interface InscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: RutaPasaporte;
  onSuccess: () => void;
}

export const InscriptionModal: React.FC<InscriptionModalProps> = ({
  isOpen,
  onClose,
  route,
  onSuccess
}) => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<InscriptionStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Form State
  const [dni, setDni] = useState('');
  const [emailContacto, setEmailContacto] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');
  const [telefonoEmergencias, setTelefonoEmergencias] = useState('');
  const [solicitaFederacion, setSolicitaFederacion] = useState(false);
  const [prevData, setPrevData] = useState<InscriptionPreviousData | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state on open
      setDni('');
      setEmailContacto('');
      setTelefonoContacto('');
      setTelefonoEmergencias('');
      setSolicitaFederacion(false);
      setSubmitting(false);
      setErrorMsg('');
      setSuccess(false);
      setPrevData(null);
      loadStatus();
    }
  }, [isOpen, route?.id]);

  const loadStatus = async () => {
    setLoadingStatus(true);
    try {
      const [currentStatus, previousData] = await Promise.all([
        inscriptionService.checkEstadoRuta(route.id),
        inscriptionService.getUltimaInscripcion()
      ]);
      setStatus(currentStatus);
      setPrevData(previousData);
    } catch (err) {
      console.error(err);
      setErrorMsg('Error al cargar el estado de la ruta.');
    } finally {
      setLoadingStatus(false);
    }
  };

  const getInsuranceText = () => {
    if (!route?.fecha) return '';
    const date = new Date(route.fecha);
    const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return <span className="font-semibold text-brand-purple">{t.imInsWeekend}</span>;
    } else {
      return <span className="font-semibold text-brand-purple">{t.imInsWeek}</span>;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailContacto.trim() || !telefonoContacto.trim()) {
      setErrorMsg(t.imErrContact);
      return;
    }

    if (solicitaFederacion && !dni.trim()) {
      setErrorMsg(t.imErrDni);
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await inscriptionService.inscribirseARuta({
        ruta_id: route.id,
        dni: dni.trim(),
        email_contacto: emailContacto.trim(),
        telefono_contacto: telefonoContacto.trim(),
        telefono_emergencias: telefonoEmergencias.trim(),
        solicita_federacion: solicitaFederacion,
        fecha_ruta: route.fecha
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);

    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error al intentar inscribirse.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-brand-beige rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-brand-purple/10 bg-white/50 shrink-0">
            <h3 className="font-extrabold text-brand-purple text-lg font-poppins">
              {t.imTitle}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto font-poppins">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200 h-full">
              {/* LEFT COLUMN: Map & Stats */}
              <div className="p-6 bg-slate-50 flex flex-col">
                <div className="bg-white rounded-xl p-4 mb-6 border border-slate-200 flex items-start gap-4 text-left shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
                    <Map className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-base leading-tight">{route?.nombre}</h4>
                    <div className="flex items-center gap-1.5 mt-1.5 text-sm font-bold text-brand-ochre">
                      <Calendar className="w-4 h-4" />
                      <span>{route?.fecha}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
                    <Navigation className="w-5 h-5 text-brand-purple mx-auto mb-1" />
                    <div className="text-xs text-slate-500 font-bold mb-0.5">{t.imDistance}</div>
                    <div className="text-sm font-black text-slate-800">{route?.distancia_km ? `${route.distancia_km} km` : '--'}</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
                    <Mountain className="w-5 h-5 text-brand-purple mx-auto mb-1" />
                    <div className="text-xs text-slate-500 font-bold mb-0.5">{t.imElevation}</div>
                    <div className="text-sm font-black text-slate-800">{route?.desnivel_positivo ? `+${route.desnivel_positivo}m` : '--'}</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm">
                    <Activity className="w-5 h-5 text-brand-purple mx-auto mb-1" />
                    <div className="text-xs text-slate-500 font-bold mb-0.5">{t.imDifficulty}</div>
                    <div className="text-sm font-black text-slate-800 capitalize">{route?.tipo_ruta || '--'}</div>
                  </div>
                </div>

                <div className="flex-1 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 min-h-[250px] h-[300px] max-h-[300px] relative shadow-sm">
                  {route?.wikiloc_id ? (
                    <iframe
                      frameBorder="0"
                      scrolling="no"
                      src={`https://es.wikiloc.com/wikiloc/spatialArtifacts.do?event=view&id=${route.wikiloc_id}&measures=off&title=off&near=off&images=off&maptype=H`}
                      width="100%"
                      height="100%"
                      className="absolute inset-0"
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                      <Map className="w-12 h-12 mb-3 opacity-20" />
                      <p className="font-medium text-sm">{t.imNoMap}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Form */}
              <div className="p-6">
                {success ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800">{t.imSuccessTitle}</h4>
                      <p className="text-sm text-slate-500 mt-2">{t.imSuccessDesc}</p>
                    </div>
                  </div>
                ) : loadingStatus ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
                  </div>
                ) : status?.usuarioApuntado ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800">{t.imAlreadyEnrolledTitle}</h4>
                      <p className="text-sm text-slate-500 mt-2">{t.imAlreadyEnrolledDesc}{route?.nombre}.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Micro-copy Legal */}
                    <div className="bg-brand-ochre/10 border border-brand-ochre/30 rounded-lg p-3 flex gap-3 items-start">
                      <ShieldAlert className="w-5 h-5 text-brand-ochre shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-700 leading-relaxed">
                        <strong>{t.imLegalWarningTitle}</strong> {t.imLegalWarningBody}
                      </p>
                    </div>

                    {/* Aforo */}
                    <div className="bg-white rounded-lg p-4 border border-slate-100 text-center">
                      {status?.aforoCompleto ? (
                        <div className="flex items-center justify-center gap-2 text-red-500 font-bold">
                          <AlertTriangle className="w-5 h-5" />
                          <span>{t.imFullCapacity}</span>
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-slate-600">
                          {t.imFreeSpots} <span className="text-brand-purple font-bold text-lg">{status?.aforoRestante}</span> {t.imOf15}
                        </div>
                      )}
                    </div>

                    {/* Autocompletar */}
                    {prevData && (
                      <div className="bg-brand-purple/5 border border-brand-purple/20 rounded-lg p-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className="relative flex items-center justify-center mt-0.5">
                            <input
                              type="checkbox"
                              disabled={submitting || status?.aforoCompleto}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setDni(prevData.dni);
                                  setEmailContacto(prevData.email_contacto);
                                  setTelefonoContacto(prevData.telefono_contacto);
                                  setTelefonoEmergencias(prevData.telefono_emergencias);
                                }
                              }}
                              className="peer sr-only"
                            />
                            <div className="w-5 h-5 rounded border-2 border-slate-300 peer-checked:bg-brand-purple peer-checked:border-brand-purple transition-colors"></div>
                            <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-bold text-brand-purple">
                              {t.imUsePrevData}
                            </span>
                            <p className="text-xs text-slate-600 mt-1">
                              {t.imUsePrevDataDesc}
                            </p>
                          </div>
                        </label>
                      </div>
                    )}

                    {/* Form Inputs */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          {t.imContactData}
                        </label>
                        <input
                          type="email"
                          required
                          disabled={submitting || status?.aforoCompleto}
                          value={emailContacto}
                          onChange={(e) => setEmailContacto(e.target.value)}
                          placeholder={t.imEmail}
                          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all disabled:opacity-50 mb-3"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="tel"
                            required
                            disabled={submitting || status?.aforoCompleto}
                            value={telefonoContacto}
                            onChange={(e) => setTelefonoContacto(e.target.value)}
                            placeholder={t.imPhone}
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                          />
                          <input
                            type="tel"
                            disabled={submitting || status?.aforoCompleto}
                            value={telefonoEmergencias}
                            onChange={(e) => setTelefonoEmergencias(e.target.value)}
                            placeholder={t.imEmergencyPhone}
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Seguro */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <label className="flex items-start gap-3 cursor-pointer group mb-3">
                        <div className="relative flex items-center justify-center mt-0.5">
                          <input
                            type="checkbox"
                            disabled={submitting || status?.aforoCompleto}
                            checked={solicitaFederacion}
                            onChange={(e) => setSolicitaFederacion(e.target.checked)}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 rounded border-2 border-slate-300 peer-checked:bg-brand-purple peer-checked:border-brand-purple transition-colors"></div>
                          <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-bold text-slate-700 group-hover:text-brand-purple transition-colors">
                            {t.imInsuranceReq}
                          </span>
                          <p className="text-xs text-slate-500 mt-1">
                            {t.imInsuranceDesc}
                          </p>
                          {getInsuranceText() && (
                            <div className="mt-2 text-xs font-semibold text-brand-purple bg-brand-purple/5 inline-block px-2 py-1 rounded">
                              {getInsuranceText()}
                            </div>
                          )}
                        </div>
                      </label>

                      <AnimatePresence>
                        {solicitaFederacion && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 border-t border-slate-200/60 mt-2">
                              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                                {t.imDniForInsurance}
                              </label>
                              <input
                                type="text"
                                required
                                disabled={submitting || status?.aforoCompleto}
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                                placeholder={t.imDniPlaceholder}
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all disabled:opacity-50"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Error */}
                    {errorMsg && (
                      <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-start gap-2 border border-red-100">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="font-medium">{errorMsg}</p>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting || status?.aforoCompleto}
                      className="w-full bg-brand-purple hover:bg-[#3d1942] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <span>{t.imSubmitBtn}</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
