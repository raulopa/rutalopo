import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { TopBanner } from "../components/TopBanner";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Check, ShoppingBag, Droplets, Wind, Zap, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { authService } from "../services/authService";
import { adminService } from "../services/adminService";
import { useToast } from "../context/ToastContext";

import bannerImg from "../../assets/camiseta_banner.webp";
import camisetaFrontImg from "../../assets/camiseta_delante.webp";
import camisetaBackImg from "../../assets/camiseta_detras.webp";
import cami1Img from "../../assets/cami1.jpeg";
import cami2Img from "../../assets/cami2.jpeg";
import cami3Img from "../../assets/cami3.jpeg";

export default function CamisetaPage() {
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    document.title = "La Rutalopó - " + (t.navShirt || "Samarreta");
  }, [t]);

  // Modal and Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [size, setSize] = useState("L");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    authService.getCurrentUser().then(u => {
      setUser(u);
      if (u && u.email) setEmail(u.email);
    });
  }, []);

  const images = [camisetaBackImg, camisetaFrontImg, cami1Img, cami2Img, cami3Img];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || (!user && !email)) {
      addToast(t.shirtModalErrorFields, "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await adminService.createPedidoCamiseta({
        usuario_id: user ? user.id : null,
        email_contacto: user ? user.email : email,
        telefono_contacto: phone,
        talla: size
      });
      addToast(t.shirtModalSuccess, "success");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      addToast(t.shirtModalErrorSubmit, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-purple/20 selection:text-brand-purple">
      <TopBanner />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand-beige/95 backdrop-blur-md border-b border-brand-purple/10 px-4 py-3 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-brand-purple hover:text-brand-ochre transition-colors font-bold text-sm">
            <ChevronLeft className="w-5 h-5" />
            {t.shirtBack}
          </Link>
          <div className="font-black text-lg tracking-tight text-brand-purple flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-ochre" />
            {t.shirtTitle}
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative w-full h-[40vh] sm:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-brand-purple/20 mix-blend-multiply z-10"></div>
        <img
          src={bannerImg}
          alt="Camiseta Banner"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-20"></div>

        <div className="absolute bottom-0 left-0 w-full z-30 p-8 sm:p-16 flex flex-col items-center justify-end h-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-7xl font-black text-white drop-shadow-2xl tracking-tighter uppercase mb-4">
              {t.shirtTitle}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Carousel */}
          <div className="relative group perspective-[2000px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8 }}
              className="relative bg-white rounded-3xl p-8 border border-brand-purple/5 shadow-2xl aspect-[4/5] flex items-center justify-center overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-beige/50 via-transparent to-transparent"></div>

              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt="Camiseta"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-contain relative z-10 drop-shadow-2xl mix-blend-multiply"
                />
              </AnimatePresence>

              {/* Carousel Controls */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-brand-purple hover:bg-brand-purple hover:text-white transition-colors z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg text-brand-purple hover:bg-brand-purple hover:text-white transition-colors z-20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${idx === currentImageIndex ? "bg-brand-purple scale-125" : "bg-brand-purple/20 hover:bg-brand-purple/50"
                      }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-10"
          >
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-brand-ochre/10 text-brand-ochre font-mono text-xs font-bold uppercase tracking-widest mb-6">
                {t.merchLimited}
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                {t.shirtTitle}
              </h2>
              <p className="text-xl text-slate-500 font-medium">
                {t.shirtSubtitle}
              </p>
            </div>

            <div className="flex items-end gap-4">
              <span className="text-5xl font-black text-brand-purple">{t.shirtPrice}</span>
              <span className="text-sm text-slate-400 font-medium mb-2 uppercase tracking-wide">/ Unidad</span>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
                {t.shirtFeaturesTitle}
              </h3>
              <ul className="space-y-4">
                {[
                  { icon: <Wind className="w-5 h-5 text-sky-500" />, text: t.shirtFeature1 },
                  { icon: <Check className="w-5 h-5 text-emerald-500" />, text: t.shirtFeature2 },
                  { icon: <Zap className="w-5 h-5 text-amber-500" />, text: t.shirtFeature3 }
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-slate-700">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <span className="font-medium text-lg">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-brand-purple hover:bg-brand-purple-hover text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_10px_50px_-10px_rgba(79,70,229,0.7)] hover:-translate-y-1 flex items-center justify-center gap-3 group"
              >
                <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {t.shirtBuy}
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Order Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="bg-brand-purple p-6 text-white flex justify-between items-center">
                <h3 className="text-xl font-bold">{t.shirtModalTitle}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleOrder} className="p-6 space-y-4">
                {!user && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">{t.shirtModalEmail} *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-slate-300 rounded-lg focus:ring-brand-purple focus:border-brand-purple"
                      placeholder="tu@email.com"
                    />
                  </div>
                )}

                {user && (
                  <div className="bg-emerald-50 text-emerald-800 text-sm p-3 rounded-lg flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span>{t.shirtModalEmailRegistered} ({user.email}).</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t.shirtModalPhone} *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border-slate-300 rounded-lg focus:ring-brand-purple focus:border-brand-purple"
                    placeholder="600 00 00 00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t.shirtModalSize}</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full border-slate-300 rounded-lg focus:ring-brand-purple focus:border-brand-purple"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                  >
                    {t.shirtModalCancel}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? t.shirtModalSubmitting : t.shirtModalSubmit}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
