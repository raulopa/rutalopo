import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  Lock,
  CheckCircle,
  LogOut,
  Award,
  Sparkles,
  Ticket,
  Home
} from "lucide-react";
import { motion } from "motion/react";
import { routesList } from "../translations";
import { authService } from "../services/authService";
import { passportService, RutaPasaporte } from "../services/passportService";
import { useLanguage } from "../context/LanguageContext";
import { TopBanner } from "../components/TopBanner";

// --- COMPONENTE B: PANEL DE USUARIO ---
const DashboardView = ({ user, routesData, onLogout, onReload }: any) => {
  const { lang, t } = useLanguage();
  const [passcode, setPasscode] = useState("");
  const [validating, setValidating] = useState(false);
  const [successAnim, setSuccessAnim] = useState<number | null>(null);

  const completedCount = routesData.filter((r: any) => r.completada).length;
  const totalRoutes = routesData.length;
  const isParticipating = completedCount > 0;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setValidating(true);
    try {
      await passportService.canjearCodigoPegatina(passcode.toUpperCase());
      await onReload(); // Reload routes to show the newly unlocked one

      // Find which route was unlocked to trigger animation (mock simulation for visual flash)
      const unlockedNow = routesData.find((r: any) => !r.completada);
      if (unlockedNow) {
        setSuccessAnim(unlockedNow.id);
        setTimeout(() => setSuccessAnim(null), 3000);
      }
      setPasscode("");
    } catch (err: any) {
      alert(err.message || t.ppDashValidateError);
    } finally {
      setValidating(false);
    }
  };

  const getRouteName = (routeId: number, dbName: string) => {
    const staticRoute = routesList[routeId - 1];
    if (staticRoute && staticRoute.langs[lang]) {
      return staticRoute.langs[lang].name;
    }
    return dbName;
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 font-poppins">
      {/* Cabecera de Usuario */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="w-12 h-12 bg-brand-purple/10 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-brand-purple" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.ppDashRole}</p>
            <h2 className="text-lg font-bold text-slate-800">{user.email}</h2>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t.ppDashLogout}
        </button>
      </div>

      {/* Resumen de Progreso */}
      <div className="bg-brand-purple rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-12 relative overflow-hidden border-b-8 border-brand-ochre">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

        <div className="relative z-10">
          <h3 className="text-brand-beige/80 font-bold uppercase tracking-widest text-sm mb-2">{t.ppDashProgress}</h3>
          <div className="flex items-end gap-4 mb-6">
            <span className="text-6xl sm:text-7xl font-black leading-none">{completedCount}</span>
            <span className="text-2xl text-brand-beige/60 font-medium mb-1">/ {totalRoutes} {t.ppDashRoutes}</span>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${isParticipating ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-brand-beige'}`}>
            {isParticipating ? (
              <><Sparkles className="w-4 h-4" /> {t.ppDashParticipating}</>
            ) : (
              <><Ticket className="w-4 h-4" /> {t.ppDashNotParticipating}</>
            )}
          </div>
        </div>
      </div>

      {/* Módulo de Canje Flotante */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-brand-purple/5 border-2 border-brand-purple/10 -mt-20 relative z-20 mx-4 sm:mx-8 mb-16">
        <h3 className="text-lg font-extrabold text-slate-800 mb-4 text-center sm:text-left">
          {t.ppDashValidateTitle}
        </h3>
        <form onSubmit={handleUnlock} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value.toUpperCase())}
            placeholder={t.ppDashInputPlaceholder}
            className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-xl px-6 py-4 font-mono font-bold text-brand-purple focus:outline-none focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 uppercase transition-all"
          />
          <button
            type="submit"
            disabled={validating || !passcode.trim()}
            className="bg-brand-ochre hover:bg-brand-ochre-hover text-slate-900 px-8 py-4 rounded-xl font-black transition-all shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
          >
            {validating ? t.ppDashValidating : t.ppDashRedeemBtn}
          </button>
        </form>
      </div>

      {/* Grid del Pasaporte */}
      <div className="space-y-6">
        <h3 className="text-2xl font-extrabold text-brand-purple">{t.ppDashCollection}</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {(routesData.length > 0 ? routesData : routesList.map((r, i) => ({ id: i + 1, nombre: r.langs.es.name, fecha: '2026-10-08', completada: false, codigoPegatina: null }))).map((route: any) => {
            const isUnlocked = route.completada;
            const isJustUnlocked = successAnim === route.id;

            return (
              <motion.div
                key={route.id}
                animate={isJustUnlocked ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } : {}}
                transition={{ duration: 0.5 }}
                className={`aspect-[3/4] rounded-2xl border-2 flex flex-col p-5 transition-all duration-300 relative overflow-hidden group ${isUnlocked
                  ? 'border-brand-purple bg-white shadow-lg shadow-brand-purple/10'
                  : 'border-slate-100 bg-slate-50'
                  }`}
              >
                {/* Decorative background shape for unlocked */}
                {isUnlocked && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-bl-[100px] -z-0"></div>
                )}

                <div className="text-xs font-bold text-slate-400 mb-2 relative z-10 text-center">
                  {route.fecha || t.ppDashComingSoon}
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
                  {isUnlocked ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 text-emerald-500 flex items-center justify-center mb-4 shadow-inner">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <h4 className="font-extrabold text-brand-purple text-sm leading-tight mb-3">
                        {getRouteName(route.id, route.nombre)}
                      </h4>
                      <div className="bg-brand-purple/10 px-3 py-1.5 rounded-lg border border-brand-purple/20">
                        <span className="text-[11px] font-mono font-bold text-brand-purple">
                          {route.codigoPegatina || t.ppDashValidated}
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center opacity-50 grayscale group-hover:opacity-70 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-slate-100 border-4 border-white text-slate-300 flex items-center justify-center mb-4 shadow-inner">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-500 text-sm leading-tight">
                        {getRouteName(route.id, route.nombre)}
                      </h4>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- CONTROLADOR PRINCIPAL ---
export default function PassaloportAppPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [routesData, setRoutesData] = useState<RutaPasaporte[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const data = await passportService.getPasaporteUsuario();
        setRoutesData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [loading, user, navigate, location]);

  return (
    <div className="min-h-screen bg-brand-beige font-poppins selection:bg-brand-purple selection:text-white flex flex-col">
      <TopBanner />
      {/* NAVBAR MINIMALISTA GLOBAL */}
      <header className="sticky top-0 z-50 bg-brand-beige/90 backdrop-blur-xl border-b border-slate-200/50 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-brand-purple hover:text-brand-ochre transition-colors font-bold text-sm">
            <Home className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-4">
            <div className="font-black text-lg tracking-tight text-brand-purple hidden sm:block">
              Passaloport
            </div>
          </div>
        </div>
      </header>

      {/* ESTADO DE CARGA GLOBAL */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin"></div>
        </div>
      ) : (
        user && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
            <DashboardView
              user={user}
              routesData={routesData}
              onLogout={async () => {
                await authService.logoutUser();
                setUser(null);
              }}
              onReload={loadData}
            />
          </motion.div>
        )
      )}
    </div>
  );
}
