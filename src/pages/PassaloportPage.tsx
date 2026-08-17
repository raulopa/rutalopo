import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Map,
  Award,
  Ticket,
  Gift,
  ArrowRight
} from "lucide-react";
import { appTranslations } from "../translations";
import { useLanguage } from "../context/LanguageContext";
import { TopBanner } from "../components/TopBanner";

export default function PassaloportPage() {
  const { t } = useLanguage();

  React.useEffect(() => {
    document.title = "La Rutalopó - Passaloport";
  }, [t]);

  return (
    <div className="min-h-screen bg-brand-beige text-slate-800 font-sans selection:bg-brand-purple selection:text-white flex flex-col">
      <TopBanner />
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-brand-beige/95 backdrop-blur-md border-b border-brand-purple/10 px-4 py-3 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-brand-purple hover:text-brand-ochre transition-colors font-bold text-sm">
            <ChevronLeft className="w-5 h-5" />
            {t.ppBackToHome}
          </Link>
          <div className="flex items-center gap-4">
            <div className="font-black text-lg tracking-tight text-brand-purple">
              Passaloport
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-brand-purple text-brand-beige py-16 md:py-24 border-b-8 border-brand-ochre">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-brand-ochre/20 text-brand-ochre border border-brand-ochre/30">
              <Award className="w-4 h-4" />
              {t.ppHeroBadge}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-white">
              {t.ppHeroTitle1}<span className="text-brand-ochre">{t.ppHeroTitle2}</span>
            </h1>

            <p className="text-base sm:text-lg text-brand-beige/80 max-w-xl leading-relaxed">
              {t.ppHeroSubtitle}
            </p>

            <Link
              to="/passaloport/app"
              className="inline-flex bg-brand-ochre hover:bg-brand-ochre-hover text-slate-950 font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg hover:shadow-xl items-center justify-center gap-2 text-center"
            >
              {t.enterPassaloport} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Hero Visual Mockup */}
          <div className="relative mx-auto w-full max-w-md hidden lg:block">
            <div className="absolute inset-0 bg-brand-ochre blur-3xl opacity-20 rounded-full"></div>
            <img src="https://s1.wklcdn.com/image_457/13732533/231203621/138272572Master.jpg" alt="Senderismo Passaloport" className="rounded-3xl border-4 border-brand-ochre shadow-2xl relative transform rotate-2 hover:rotate-0 transition-transform duration-500 object-cover aspect-[3/4]" />
          </div>
        </div>
      </section>

      {/* INFOGRAFÍA / FUNCIONAMIENTO */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto bg-brand-beige border-b border-brand-purple/10 w-full" id="como-funciona">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-purple tracking-tight">
            {t.ppHowItWorksTitle}
          </h2>
          <p className="text-slate-600">{t.ppHowItWorksSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-brand-purple/10 -z-10 -translate-y-12"></div>

          <div className="bg-white border border-brand-purple/20 rounded-2xl p-8 text-center space-y-4 relative shadow-sm">
            <div className="w-16 h-16 mx-auto bg-brand-purple text-brand-beige rounded-2xl flex items-center justify-center shadow-md -mt-12 mb-4 border-4 border-white">
              <Map className="w-8 h-8 text-brand-ochre" />
            </div>
            <h3 className="text-xl font-bold text-brand-purple">{t.ppStep1Title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.ppStep1Desc}
            </p>
          </div>

          <div className="bg-white border border-brand-purple/20 rounded-2xl p-8 text-center space-y-4 relative shadow-sm">
            <div className="w-16 h-16 mx-auto bg-brand-purple text-brand-beige rounded-2xl flex items-center justify-center shadow-md -mt-12 mb-4 border-4 border-white">
              <Ticket className="w-8 h-8 text-brand-ochre" />
            </div>
            <h3 className="text-xl font-bold text-brand-purple">{t.ppStep2Title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.ppStep2Desc}
            </p>
          </div>

          <div className="bg-white border border-brand-purple/20 rounded-2xl p-8 text-center space-y-4 relative shadow-sm">
            <div className="w-16 h-16 mx-auto bg-brand-purple text-brand-beige rounded-2xl flex items-center justify-center shadow-md -mt-12 mb-4 border-4 border-white">
              <Gift className="w-8 h-8 text-brand-ochre" />
            </div>
            <h3 className="text-xl font-bold text-brand-purple">{t.ppStep3Title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.ppStep3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE PREMIOS (EL GANCHO) */}
      <section className="py-20 bg-brand-purple text-brand-beige border-t border-brand-purple/20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.ppPrizesTitle}
            </h2>
            <p className="text-brand-beige/80 text-lg">
              {t.ppPrizesSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">🍷</div>
              <h4 className="font-bold text-white text-lg">{t.ppPrize1Title}</h4>
              <p className="text-xs text-brand-beige/70 mt-2">{t.ppPrize1Desc}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">🧺</div>
              <h4 className="font-bold text-white text-lg">{t.ppPrize2Title}</h4>
              <p className="text-xs text-brand-beige/70 mt-2">{t.ppPrize2Desc}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">🚵</div>
              <h4 className="font-bold text-white text-lg">{t.ppPrize3Title}</h4>
              <p className="text-xs text-brand-beige/70 mt-2">{t.ppPrize3Desc}</p>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-extrabold text-brand-ochre mb-6">{t.ppFooterTitle}</h3>
            <Link
              to="/passaloport/app"
              className="inline-flex bg-brand-ochre hover:bg-brand-ochre-hover text-slate-950 font-black px-10 py-5 rounded-xl text-lg transition-all shadow-xl hover:shadow-2xl gap-2 items-center"
            >
              {t.startCollection} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
