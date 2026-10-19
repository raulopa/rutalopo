import React, { useState, useEffect } from "react"; import {
  Languages,
  BookOpen,
  Award,
  Download,
  AlertTriangle,
  CheckCircle,
  Map,
  Heart,
  UserCheck,
  Compass,
  Send,
  ExternalLink,
  FileText,
  ChevronRight,
  Calendar,
  ChevronDown,
  Info,
  MapPin,
  X,
  Share2,
  Shirt
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { routesList, appTranslations } from "./translations";
import { downloadGPXFileMultilingual, generatePassaloportDocument } from "./routesData";
import { authService } from "./services/authService";
import { useLanguage } from "./context/LanguageContext";
import { LanguageSelector } from "./components/LanguageSelector";
import { TopBanner } from "./components/TopBanner";
import { WikilocRoutes } from "./components/WikilocRoutes";
import { BlurText } from "./components/animations/BlurText";
import { ShinyButton } from "./components/animations/ShinyButton";
import { Card3D } from "./components/animations/Card3D";
import { ScrollPath } from "./components/animations/ScrollPath";
import cidBg from "../assets/cid.png";
import camisetaDetrasImg from "../assets/camiseta_detras.webp";

export default function App() {
  // Lang & Auth state
  const { lang, t } = useLanguage();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);
  }, []);

  useEffect(() => {
    document.title = "La Rutalopó - " + (t.navConcept || "Inici");
  }, [t]);

  // T-Shirt Promo Modal & Widget
  const [showShirtModal, setShowShirtModal] = useState(false);
  const [showShirtWidget, setShowShirtWidget] = useState(true);

  const handleCloseShirtModal = () => {
    setShowShirtModal(false);
    setShowShirtWidget(true);
  };

  // Route filter states
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Safety Pledge modal for GPX downloads
  const [activeRouteForDownload, setActiveRouteForDownload] = useState<typeof routesList[0] | null>(null);
  const [pledge1, setPledge1] = useState(false);
  const [pledge2, setPledge2] = useState(false);
  const [pledge3, setPledge3] = useState(false);
  const [isProcessingDownload, setIsProcessingDownload] = useState(false);
  const [downloadCompletedStatus, setDownloadCompletedStatus] = useState(false);

  // Digital Passaloport checklist interactive simulator (Raffle gamification)
  const [hikerName, setHikerName] = useState("");
  const [completedHikes, setCompletedHikes] = useState<Record<string, boolean>>({
    "ruta-castells": true,
    "ombria-cid": false,
  });
  const [isGeneratingPassaloport, setIsGeneratingPassaloport] = useState(false);

  // Interactive Brand Scaler Sandbox State
  const [logoScale, setLogoScale] = useState(100); // % from 20 to 200
  const [badgeBgColor, setBadgeBgColor] = useState("var(--color-brand-dark-purple)");
  const [badgeName, setBadgeName] = useState("RAÜL");

  // Suggestion Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formComments, setFormComments] = useState("");
  const [showFormSuccess, setShowFormSuccess] = useState(false);

  // Calculate completed count
  const completedCount = Object.values(completedHikes).filter(Boolean).length;
  // Calculate raffle tickets multiplier
  const raffleTicketsCount = completedCount === 0 ? 0 : completedCount * 2;

  // Toggle hike completion
  const handleToggleHike = (routeId: string) => {
    setCompletedHikes(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }));
  };

  // Filter routes based on state
  const filteredRoutes = routesList.filter(route => {
    const rLabel = route.langs[lang];
    const diffMatch = difficultyFilter === "All" || route.difficultyKey === difficultyFilter;
    const searchMatch = searchQuery.trim() === "" ||
      rLabel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rLabel.patrimony.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rLabel.description.toLowerCase().includes(searchQuery.toLowerCase());
    return diffMatch && searchMatch;
  });

  // Handle download submit
  const handleDownloadConfirm = () => {
    if (pledge1 && pledge2 && pledge3 && activeRouteForDownload) {
      setIsProcessingDownload(true);
      setTimeout(() => {
        downloadGPXFileMultilingual(activeRouteForDownload, lang);
        setIsProcessingDownload(false);
        setDownloadCompletedStatus(true);
        setTimeout(() => {
          setActiveRouteForDownload(null);
          setDownloadCompletedStatus(false);
          // Auto add to checklist as simulated gamification completion!
          setCompletedHikes(prev => ({
            ...prev,
            [activeRouteForDownload.id]: true
          }));
        }, 1500);
      }, 900);
    }
  };

  // Trigger printable passaloport HTML document stream
  const triggerPassaloportDownload = () => {
    setIsGeneratingPassaloport(true);
    setTimeout(() => {
      generatePassaloportDocument(hikerName, lang);
      setIsGeneratingPassaloport(false);
    }, 800);
  };

  // Handle contact form submit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("https://formsubmit.co/ajax/rutalopo@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          nombre: formName,
          email: formEmail,
          url: formUrl,
          comentarios: formComments,
          _subject: "Nuevo mensaje desde el formulario de La Rutalopó"
        })
      });
      setShowFormSuccess(true);
      setTimeout(() => {
        setFormName("");
        setFormEmail("");
        setFormUrl("");
        setFormComments("");
        setShowFormSuccess(false);
      }, 4000);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div id="root-container" className="min-h-screen bg-brand-beige text-slate-800 antialiased selection:bg-brand-purple selection:text-white">
      <TopBanner />

      <header className="sticky top-0 z-40 bg-brand-beige/95 backdrop-blur-md border-b border-brand-purple/10 px-4 py-3 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RutalopoLogo className="w-10 h-10 text-brand-purple transition-transform duration-200 hover:scale-105" />
            <div>
              <span className="font-black text-lg tracking-tight text-brand-purple block">La Rutalopó</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <a href="#concepto" className="hover:text-brand-purple transition-colors">{t.navConcept}</a>
            <Link to="/passaloport" className="hover:text-brand-purple transition-colors">Passaloport</Link>
            <Link to="/cronograma" className="hover:text-brand-purple transition-colors">{t.navSchedule}</Link>
            <Link to="/patrimoni" className="hover:text-brand-purple transition-colors">Patrimoni</Link>
            <a href="#rutas" className="hover:text-brand-purple transition-colors">{t.navRoutes}</a>
            <Link to="/camiseta" className="hover:text-brand-purple transition-colors">{t.navShirt}</Link>
            <a href="#manual" className="hover:text-brand-purple transition-colors">{t.navGuide}</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
            </div>

            <Link
              to="/passaloport"
              className="bg-brand-purple text-brand-beige hover:bg-brand-purple-hover-light transition-all px-4 py-2 rounded-xl text-xs font-semibold shadow-xs"
            >
              {t.navDigitalPassport}
            </Link>
            {user ? (
              <Link to="/passaloport/app" className="bg-brand-ochre text-slate-900 hover:bg-brand-ochre-hover transition-all p-2 rounded-xl flex items-center justify-center shadow-xs">
                <UserCheck className="w-4 h-4" />
              </Link>
            ) : (
              <Link to="/login" state={{ from: location }} className="bg-brand-beige text-brand-purple border border-brand-purple/20 hover:bg-brand-purple/5 transition-all px-4 py-2 rounded-xl text-xs font-semibold shadow-xs">
                {t.navLogin}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        className="relative overflow-hidden border-b border-brand-purple/10 py-16 md:py-28 min-h-[90vh] flex items-center"
        id="hero-section"
      >
        {/* Semi-transparent background image layer */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50 pointer-events-none"
          style={{ backgroundImage: `url(${cidBg})` }}
        />

        {/* Scroll-driven interactive SVG track */}
        <ScrollPath />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-3xl bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-start space-y-8">

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-brand-ochre text-slate-950 shadow-xs border border-brand-purple/10"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              {t.heroBadge}
            </motion.div>

            <BlurText
              as="h1"
              text={`${t.heroTitle.split(', ')[0]}, ${t.heroTitle.split(', ')[1]}`}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-brand-purple leading-[1.12]"
              delay={0.1}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-base sm:text-lg text-slate-700 max-w-xl leading-relaxed font-medium"
            >
              {t.heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-4"
            >
              <ShinyButton href="/passaloport" className="bg-brand-ochre text-slate-950 text-sm shadow-xl">
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{t.heroCTA}</span>
                </div>
              </ShinyButton>

              <a
                href="#rutas"
                className="border-2 border-brand-purple text-brand-purple bg-white/50 hover:bg-white font-bold px-8 py-4 rounded-xl text-sm transition-all text-center shadow-sm"
              >
                {t.heroSecondaryCTA}
              </a>
            </motion.div>

            {/* Disclaimer subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex items-center gap-3 text-xs text-slate-600 pt-4 border-t border-slate-300 w-full max-w-md"
            >
              <AlertTriangle className="w-5 h-5 text-brand-ochre flex-shrink-0" />
              <span className="font-mono leading-tight text-[11px] font-bold uppercase">{t.heroDisclaimer}</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* THREE PILLARS SECTOR: EL CONCEPTO */}
      <section className="bg-white border-y border-brand-purple/10 py-24 px-4 sm:px-6" id="concepto">
        <div className="max-w-7xl mx-auto space-y-16">

          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-ochre bg-brand-beige px-4 py-1.5 rounded-full inline-block border border-brand-purple/10">
              {t.conceptSub}
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-purple tracking-tight">
              {t.conceptTitle}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
              {t.conceptDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
            <Card3D className="bg-brand-beige border border-brand-purple/20 p-8 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-purple text-brand-beige flex items-center justify-center font-bold text-xl shadow-lg">
                  <Compass className="w-7 h-7 text-brand-ochre" />
                </div>
                <h3 className="text-2xl font-bold text-brand-purple">{t.pilar1Title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {t.pilar1Body}
                </p>
              </div>
              <div className="pt-6 mt-8 border-t border-brand-purple/10 flex items-center justify-between text-xs font-mono font-bold text-slate-500">
                <span>{t.conceptTag1a}</span>
                <span className="text-brand-ochre">{t.conceptTag1b}</span>
              </div>
            </Card3D>

            <Card3D className="bg-brand-beige border border-brand-purple/20 p-8 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-purple text-brand-beige flex items-center justify-center font-bold text-xl shadow-lg">
                  <BookOpen className="w-7 h-7 text-brand-ochre" />
                </div>
                <h3 className="text-2xl font-bold text-brand-purple">{t.pilar2Title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {t.pilar2Body}
                </p>
                <Link
                  to="/patrimoni"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-purple hover:text-brand-purple-hover underline underline-offset-4 pt-1"
                >
                  <span>Explorar catàleg d&apos;elements singulars (Forns de guix)</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="pt-6 mt-8 border-t border-brand-purple/10 flex items-center justify-between text-xs font-mono font-bold text-slate-500">
                <span>{t.conceptTag2a}</span>
                <span className="text-emerald-700">{t.conceptTag2b}</span>
              </div>
            </Card3D>

            <Card3D className="bg-brand-beige border border-brand-purple/20 p-8 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-purple text-brand-beige flex items-center justify-center font-bold text-xl shadow-lg">
                  <Languages className="w-7 h-7 text-brand-ochre" />
                </div>
                <h3 className="text-2xl font-bold text-brand-purple">{t.pilar3Title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {t.pilar3Body}
                </p>
              </div>
              <div className="pt-6 mt-8 border-t border-brand-purple/10 flex items-center justify-between text-xs font-mono font-bold text-slate-500">
                <span>{t.conceptTag3a}</span>
                <span className="text-amber-800">{t.conceptTag3b}</span>
              </div>
            </Card3D>
          </div>

          <div className="flex justify-center pt-8">
            <ShinyButton href="#rutas" className="bg-brand-purple text-white shadow-xl">
              {t.confirmAttendance}
            </ShinyButton>
          </div>
        </div>
      </section>

      <section className="bg-brand-purple text-brand-beige py-32 px-4 sm:px-6 relative overflow-hidden" id="passaloport-teaser">
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-ochre/10 rounded-full blur-[100px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
          <div className="space-y-6">
            <h2 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {t.passaloportHeroTitle1} <br />
              <span className="text-brand-ochre">{t.passaloportHeroTitle2}</span>
            </h2>
            <p className="text-xl sm:text-2xl text-brand-beige/80 leading-relaxed max-w-3xl mx-auto font-medium">
              {t.passaloportHeroSubtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-brand-ochre/80 pt-4">
              <span className="px-3 py-1 border border-brand-ochre/30 rounded-full">{t.passaloportFeature1}</span>
              <span className="px-3 py-1 border border-brand-ochre/30 rounded-full">{t.passaloportFeature2}</span>
              <span className="px-3 py-1 border border-brand-ochre/30 rounded-full">{t.passaloportFeature3}</span>
            </div>
          </div>

          {/* Animated Passport Slots */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="flex flex-wrap justify-center gap-4 sm:gap-8 pt-8"
          >
            {[8, 9, 10, 11, 12].map((day) => (
              <motion.div
                key={day}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 30 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" } }
                }}
                className="w-20 h-28 sm:w-28 sm:h-36 rounded-2xl border-2 border-dashed border-brand-ochre/40 flex flex-col items-center justify-center relative group"
              >
                <div className="absolute inset-0 bg-brand-ochre/0 group-hover:bg-brand-ochre/20 transition-colors rounded-2xl" />
                <Award className="w-8 h-8 sm:w-12 sm:h-12 text-brand-ochre/30 group-hover:text-brand-ochre transition-colors drop-shadow-[0_0_15px_rgba(212,163,115,0.5)]" />
                <span className="mt-3 text-xs sm:text-sm font-mono font-bold text-brand-beige/50 group-hover:text-brand-beige transition-colors">
                  {day} {t.octShort}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <div className="pt-12 flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/passaloport"
                className="inline-block bg-brand-ochre text-slate-950 font-bold px-10 py-5 rounded-2xl text-xl transition-all shadow-[0_0_40px_rgba(212,163,115,0.4)] hover:shadow-[0_0_60px_rgba(212,163,115,0.6)]"
              >
                {t.passaloportExploreBtn}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* COMPACT ROUTE FILTER COMPONENT & MAP GRID CATALOGUE */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-20" id="rutas">

        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-extrabold text-brand-purple tracking-tight">
              {t.routesSectionTitle}
            </h2>
            <p className="text-slate-600 text-lg">
              {t.routesSectionDesc}
            </p>
          </div>

          <WikilocRoutes />
        </div>

        <div className="w-full flex justify-center">
          <Link
            to="/cronograma"
            className="inline-flex items-center gap-3 bg-brand-purple hover:bg-brand-purple-dark text-brand-beige font-extrabold px-10 py-5 rounded-2xl text-xl transition-all shadow-[0_0_30px_rgba(212,163,115,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
          >
            <Calendar className="w-6 h-6" />
            {t.viewInteractiveSchedule}
          </Link>
        </div>

        {/* INTEGRATED SAFETY DISCLAIMER NOTICE CARD */}
        <div className="bg-brand-purple text-brand-beige rounded-2xl p-8 md:p-12 shadow-2xl border-4 border-brand-ochre relative overflow-hidden mt-12">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none transform translate-x-1/4">
            <AlertTriangle className="w-96 h-96 text-brand-ochre" />
          </div>

          <div className="space-y-6 relative z-10 max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 text-brand-ochre mb-2">
              <AlertTriangle className="w-8 h-8 flex-shrink-0 animate-pulse" />
              <span className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest">
                {t.natureNoticeTitle}
              </span>
            </div>

            <h3 className="font-extrabold text-2xl md:text-4xl text-white leading-tight">
              {t.natureNoticeSubtitle}
            </h3>

            <p className="text-sm md:text-base text-brand-beige/90 leading-relaxed font-medium">
              {t.natureNoticeBody}
            </p>

            <div className="pt-8 flex items-center justify-center gap-2 text-xs font-mono text-brand-ochre/80 hover:text-brand-ochre transition-colors cursor-pointer">
              <span className="uppercase tracking-widest">{t.civilLiabilityLabel}</span>
              <span className="underline font-bold">{t.moreInfo}</span>
            </div>
          </div>
        </div>


      </section>

      {/* T-SHIRT MERCHANDISE SECTION */}
      <section className="bg-white border-y border-brand-purple/10 py-24 px-4 sm:px-6 relative overflow-hidden" id="merchandising">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-purple/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: T-Shirt Visual */}
            <div className="relative group">
              <div className="absolute inset-0 bg-brand-ochre/20 rounded-3xl transform rotate-3 scale-105 transition-transform group-hover:rotate-6 group-hover:scale-110 duration-500"></div>
              <div className="relative bg-brand-beige rounded-3xl p-8 border-2 border-brand-purple/10 shadow-2xl aspect-[4/5] flex items-center justify-center overflow-hidden">
                <img
                  src={camisetaDetrasImg}
                  alt="Camiseta Oficial La Rutalopó"
                  className="w-full h-full object-contain mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-brand-purple text-brand-beige text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                  {t.merchLimited}
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-mono font-extrabold text-brand-ochre uppercase tracking-widest block flex items-center gap-2">
                  <span className="w-8 h-px bg-brand-ochre"></span>
                  {t.merchOfficial}
                </span>
                <h2
                  className="text-4xl sm:text-5xl font-extrabold text-brand-purple tracking-tight leading-tight"
                  dangerouslySetInnerHTML={{ __html: t.merchTitle }}
                />
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  {t.merchDesc}
                </p>
              </div>
              <div className="pt-6">
                <Link to="/camiseta" className="inline-flex w-auto bg-brand-purple hover:bg-brand-purple-hover text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-brand-purple/30 items-center gap-3">
                  {t.merchReserveBtn}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ADDITIONAL GUIDELINES / RECOMMENDATIONS + ECO FORM */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto" id="manual">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono font-extrabold text-brand-purple tracking-widest uppercase bg-brand-purple/5 px-3.5 py-1.5 rounded border border-brand-purple/10">
              {t.responsibleHikingTitle}
            </span>

            <h2 className="text-3xl font-extrabold text-brand-purple tracking-tight leading-snug">
              {t.coexistenceTitle}
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              {t.coexistenceDesc}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-ochre text-slate-955 flex items-center justify-center text-[10px] font-bold py-3 mt-1 px-3">
                  1
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {t.rule1Title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-normal">
                    {t.rule1Desc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-ochre text-slate-955 flex items-center justify-center text-[10px] font-bold py-3 mt-1 px-3">
                  2
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {t.rule2Title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-normal">
                    {t.rule2Desc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-ochre text-slate-955 flex items-center justify-center text-[10px] font-bold py-3 mt-1 px-3">
                  3
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {t.rule3Title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-normal">
                    {t.rule3Desc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-ochre text-slate-955 flex items-center justify-center text-[10px] font-bold py-3 mt-1 px-3">
                  4
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {t.rule4Title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-normal">
                    {t.rule4Desc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-ochre text-slate-955 flex items-center justify-center text-[10px] font-bold py-3 mt-1 px-3">
                  5
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {t.rule5Title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-normal">
                    {t.rule5Desc}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-ochre text-slate-955 flex items-center justify-center text-[10px] font-bold py-3 mt-1 px-3">
                  6
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {t.rule6Title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-normal">
                    {t.rule6Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* ECO FORM FOR PROPOUNDS (6 cols) */}
          <div className="lg:col-span-6 bg-brand-beige border-2 border-brand-purple/30 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-purple/15 pb-3">
              <Send className="w-5 h-5 text-brand-purple" />
              <h3 className="font-extrabold text-lg text-brand-purple">
                {t.contactTitle}
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              {t.contactText}
            </p>

            <form onSubmit={handleSubmitForm} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500 block">
                    {t.formName}
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="ÁLIAS"
                    className="w-full bg-white border border-brand-purple/20 rounded-lg p-2 text-xs focus:ring-1 focus:ring-brand-purple focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500 block">
                    {t.formEmail}
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-white border border-brand-purple/20 rounded-lg p-2 text-xs focus:ring-1 focus:ring-brand-purple focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500 block">
                  {t.formUrl}
                </label>
                <input
                  type="url"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://wikiloc.com/..."
                  className="w-full bg-white border border-brand-purple/20 rounded-lg p-2 text-xs focus:ring-1 focus:ring-brand-purple focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500 block">
                  {t.formComments}
                </label>
                <textarea
                  rows={2}
                  value={formComments}
                  onChange={(e) => setFormComments(e.target.value)}
                  placeholder="..."
                  className="w-full bg-white border border-brand-purple/20 rounded-lg p-2 text-xs focus:ring-1 focus:ring-brand-purple focus:outline-none focus:border-brand-purple"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-purple hover:bg-brand-purple-hover text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                {t.formSubmit}
              </button>

              <AnimatePresence>
                {showFormSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-800"
                  >
                    {t.formSuccess}
                  </motion.div>
                )}
              </AnimatePresence>

            </form>
          </div>

        </div>
      </section>

      {/* EXCLUSIÓN DE RESPONSABILIDAD LEGAL COMPLETA FOOTER ACCENT */}
      <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t-4 border-brand-purple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 animate-fade-in">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <RutalopoLogo className="w-8 h-8 text-white" />
                <span className="font-black text-lg text-white tracking-widest uppercase">
                  LA RUTALOPÓ
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                {t.footerDesc}
              </p>

              <div className="flex items-center gap-2 text-xs text-brand-ochre font-mono">
                <span>{t.copyright}</span>
              </div>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h5 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-100">
                {t.footerGeoInfoTitle}
              </h5>
              <p className="text-xs text-slate-400 leading-normal">
                {t.footerGeoInfoDesc}
              </p>
            </div>
          </div>

          {/* CRITICAL LIABILITY DISCLOSER COMPREHENSIVE TEXT FOR LEGAL COVERAGE */}
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-xl space-y-4" id="legal-caveat">
            <div className="flex items-center gap-2.5 text-brand-ochre border-b border-slate-800 pb-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-bounce" />
              <h4 className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-ochre">
                {t.legalTitle}
              </h4>
            </div>

            <div className="text-[11px] sm:text-xs text-slate-400 space-y-3 leading-relaxed text-justify">
              <p>
                <strong>{t.legalRule1}</strong> {t.legalP1}
              </p>
              <p>
                <strong>{t.legalRule2}</strong> {t.legalP2}
              </p>
              <p>
                <strong>{t.legalRule3}</strong> {t.legalP3}
              </p>
            </div>
          </div>

        </div>
      </footer>

      {/* SAFETY PLEDGE MODAL (Enforces reading the liability agreement before unlocking GPX formats) */}
      <AnimatePresence>
        {activeRouteForDownload && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

              <div onClick={() => setActiveRouteForDownload(null)} className="fixed inset-0 bg-slate-950/70 transition-opacity" aria-hidden="true"></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-2xl border-2 border-brand-purple text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">

                <div className="bg-brand-purple text-white p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheckIndicator />
                    <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-white">
                      {t.customPledgeTitle}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveRouteForDownload(null)}
                    className="text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">

                  <div className="bg-amber-50 rounded-xl p-3 border border-brand-ochre/30 flex items-start gap-2 text-slate-800">
                    <Info className="w-4 h-4 text-brand-ochre flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">
                      {t.customPledgeAlert}{" "}
                      <strong className="text-brand-purple">
                        {activeRouteForDownload.langs[lang].name}
                      </strong>
                    </p>
                  </div>

                  {/* Pledge Form Controls */}
                  <div className="space-y-3.5 pt-2">

                    <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={pledge1}
                        onChange={(e) => setPledge1(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-brand-purple rounded"
                      />
                      <span className={pledge1 ? "text-slate-900 font-semibold" : ""}>
                        {t.pledgeCheckbox1}
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={pledge2}
                        onChange={(e) => setPledge2(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-brand-purple rounded"
                      />
                      <span className={pledge2 ? "text-slate-900 font-semibold" : ""}>
                        {t.pledgeCheckbox2}
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={pledge3}
                        onChange={(e) => setPledge3(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-brand-purple rounded"
                      />
                      <span className={pledge3 ? "text-slate-900 font-semibold" : ""}>
                        {t.pledgeCheckbox3}
                      </span>
                    </label>

                  </div>

                </div>

                <div className="bg-brand-beige p-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveRouteForDownload(null)}
                    className="px-4 py-2 text-xs font-mono font-bold text-slate-500 hover:text-slate-800"
                  >
                    {t.cancel}
                  </button>

                  <button
                    type="button"
                    disabled={(!pledge1 || !pledge2 || !pledge3) || isProcessingDownload}
                    onClick={handleDownloadConfirm}
                    className={`px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${(pledge1 && pledge2 && pledge3)
                      ? "bg-brand-purple hover:bg-brand-purple-hover text-white shadow-sm"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                  >
                    {isProcessingDownload ? (
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                        {t.pledgeDownloading}
                      </span>
                    ) : downloadCompletedStatus ? (
                      <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                        ✓ {t.pledgeSuccess}
                      </span>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-brand-ochre" />
                        <span>{t.pledgeConfirmBtn}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* T-SHIRT PROMO MODAL */}
      <AnimatePresence>
        {showShirtModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div onClick={handleCloseShirtModal} className="fixed inset-0 bg-slate-950/70 transition-opacity" aria-hidden="true"></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="inline-block align-bottom bg-white rounded-3xl border-2 border-brand-purple text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-10"
              >
                <button
                  onClick={handleCloseShirtModal}
                  className="absolute top-4 right-4 z-20 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative overflow-hidden bg-white p-8 sm:p-12">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-purple/5 via-transparent to-transparent pointer-events-none"></div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative group hidden sm:block">
                      <div className="absolute inset-0 bg-brand-ochre/20 rounded-3xl transform rotate-3 scale-105 transition-transform group-hover:rotate-6 group-hover:scale-110 duration-500"></div>
                      <div className="relative bg-brand-beige rounded-3xl p-8 border-2 border-brand-purple/10 shadow-xl aspect-[4/5] flex items-center justify-center overflow-hidden">
                        <img
                          src={camisetaDetrasImg}
                          alt="Camiseta Oficial La Rutalopó"
                          className="w-full h-full object-contain mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 bg-brand-purple text-brand-beige text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                          {t.merchLimited}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                      <div className="space-y-4">
                        <span className="text-xs font-mono font-extrabold text-brand-ochre uppercase tracking-widest block flex items-center gap-2">
                          <span className="w-8 h-px bg-brand-ochre"></span>
                          {t.merchOfficial}
                        </span>
                        <h2
                          className="text-3xl sm:text-4xl font-extrabold text-brand-purple tracking-tight leading-tight"
                          dangerouslySetInnerHTML={{ __html: t.merchTitle }}
                        />
                        <p className="text-base text-slate-600 leading-relaxed font-medium">
                          {t.merchDesc}
                        </p>
                      </div>
                      <div className="pt-4 flex items-center gap-4">
                        <Link to="/camiseta" onClick={handleCloseShirtModal} className="inline-flex w-auto bg-brand-purple hover:bg-brand-purple-hover text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-brand-purple/30 items-center gap-3">
                          {t.merchReserveBtn}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </Link>
                        <button onClick={handleCloseShirtModal} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                          {t.cancel || "Cerrar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING WIDGET FOR QUICK ACCESS */}
      <AnimatePresence>
        {showShirtWidget && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              onClick={() => {
                setShowShirtWidget(false);
                setShowShirtModal(true);
              }}
              className="group relative flex items-center justify-center bg-brand-purple hover:bg-brand-purple-hover text-white p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(139,92,246,0.3)] transition-all transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
              <Shirt className="w-6 h-6 relative z-10" />
              <span className="hidden sm:inline-block max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-300 ease-in-out whitespace-nowrap font-bold text-sm relative z-10">
                <span className="pl-2">{t.navShirt}</span>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Compact visual helpers
function ShieldCheckIndicator() {
  return (
    <div className="w-6 h-6 rounded bg-brand-ochre text-slate-900 flex items-center justify-center font-bold text-xs">
      🛡️
    </div>
  );
}

export function RutalopoLogo({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} clipRule="evenodd" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={1.5} viewBox="0 0 2481 3508">
      <path d="M1262.2 1075.5c-13.468-.962-13.03.36-72.985 10.352-18.044 3.007-117.45 29.939-53.834 55.387 50.493 20.197 194.54 62.341 210.16 70.397 15.615 8.057 13.458 49.356-3.624 53.316-17.081 3.96-68.819 7.689-91.62 76.092-4.765 14.296-7.45 16.98-20.705 10.352-4.591-2.295-32.161-13.492-35.199-15.011-17.499-8.75-35.924-26.813-32.611-28.47 8.701-4.35 4.79-12.035 32.611-17.599 32.125-6.425 62.718-32.324 53.833-62.116-8.884-29.791-200.23-88.636-193.59-104.04 6.641-15.408 4.45-7.379 91.103-44.516 10.363-4.442 42.197-11.823 48.657-13.976 19.734-6.578 24.685 9.495 37.787 16.046.942.471.867-.457 1.553 0 .172.115 0 0 2.07 1.553" stroke={color} strokeWidth="4.37" transform="matrix(2.827 0 0 2.0709 -2160.6 -930.81)" />
      <path d="m945.022 637.774 527.348 683.398H417.705l527.348-683.398z" stroke={color} strokeWidth="12.508464" />
      <path d="m717.753 1001.725 229.38-279.037 115.872 146.613-118.236 156.074-56.266-111.145-170.75 87.495z" fill="#fff" />
      <circle cx="1000.7" cy="1355.2" r="46.4" stroke={color} strokeWidth="2.83" transform="matrix(4.4594 0 0 4.3798 -3733.1 -4060.6)" />
      <circle cx="1000.7" cy="1355.2" r="46.4" stroke={color} strokeWidth="2.83" transform="matrix(4.4594 0 0 4.3798 -3478.8 -3613.5)" />
      <circle cx="1000.7" cy="1355.2" r="46.4" stroke={color} strokeWidth="2.83" transform="matrix(4.4594 0 0 4.3798 -3219.3 -3172.5)" />
      <circle cx="1000.7" cy="1355.2" r="46.4" stroke={color} strokeWidth="2.83" transform="matrix(4.4594 0 0 4.3798 -2968.9 -3613.5)" />
      <circle cx="1000.7" cy="1355.2" r="46.4" stroke={color} strokeWidth="2.83" transform="matrix(4.4594 0 0 4.3798 -3219.3 -4060.6)" />
      <circle cx="1000.7" cy="1355.2" r="46.4" stroke={color} strokeWidth=".94" transform="matrix(4.4594 0 0 4.3798 -2705.1 -4060.6)" />
      <path d="m1235.967 871.879 193.908-253.027 534.43 702.313H1815.33l-387.823-503.68-118.24 152.524-73.306-98.137z" stroke={color} strokeWidth="10.822273999999998" />
    </svg>
  );
}
