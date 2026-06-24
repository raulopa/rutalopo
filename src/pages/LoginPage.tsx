import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { MountainSnow, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { authService } from "../services/authService";
import { useLanguage } from "../context/LanguageContext";
import { TopBanner } from "../components/TopBanner";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { addToast } = useToast();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || -1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authMode === 'login') {
        await authService.loginUser(email, password);
      } else {
        await authService.registerUser(email, password);
        addToast(t.ppAuthSuccessRegister || "Registro completado con éxito", 'success');
      }
      
      // Determine where to navigate
      if (typeof from === 'string' && from === '/passaloport/app') {
        navigate('/passaloport/app', { replace: true });
      } else if (typeof from === 'string' && from !== '/login') {
        navigate(from, { replace: true });
      } else {
        // If there's no specific state, navigate back, or to home if back is not possible
        navigate(-1);
      }
    } catch (err: any) {
      addToast(err.message || t.ppAuthError || "Error de autenticación", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige text-slate-800 font-sans flex flex-col selection:bg-brand-purple selection:text-white">
      <TopBanner />
      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand-beige/95 backdrop-blur-md border-b border-brand-purple/10 px-4 py-3 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-brand-purple hover:text-brand-ochre transition-colors font-bold text-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            {t.backBtn}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden font-poppins"
        >
          <div className="bg-brand-purple p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-ochre/10 blur-xl rounded-full translate-y-8"></div>
            <MountainSnow className="w-16 h-16 text-brand-ochre mx-auto mb-4 relative z-10" />
            <h2 className="text-3xl font-extrabold text-white relative z-10 tracking-tight">
              {authMode === 'login' ? (t.ppAuthWelcome || "Bienvenido") : (t.ppAuthJoin || "Únete a la Aventura")}
            </h2>
            <p className="text-brand-beige/80 text-sm mt-2 relative z-10">
              {t.ppAuthSubtitle || "Inicia sesión para gestionar tu pasaporte digital"}
            </p>
          </div>

          <div className="p-8">

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {t.ppAuthEmail || "Email"}
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple/50 transition-all font-medium"
                  placeholder="tu@email.com"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {t.ppAuthPassword || "Contraseña"}
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple/50 transition-all font-medium"
                  placeholder="••••••••"
                  required 
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-brand-purple text-white px-6 py-4 rounded-xl font-bold hover:bg-brand-purple-hover transition-colors mt-2 shadow-lg hover:shadow-brand-purple/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  authMode === 'login' ? (t.ppAuthLoginBtn || "Entrar") : (t.ppAuthRegisterBtn || "Registrarse")
                )}
              </button>
            </form>

            <div className="text-center mt-8 pt-6 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                }}
                className="text-sm text-slate-500 hover:text-brand-purple font-semibold transition-colors"
              >
                {authMode === 'login' ? (t.ppAuthNoAccount || "¿No tienes cuenta? Regístrate") : (t.ppAuthHasAccount || "¿Ya tienes cuenta? Inicia sesión")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
