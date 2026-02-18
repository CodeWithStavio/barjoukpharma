'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { content, type Locale, getDirection } from '@/lib/content';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  Mail,
  MapPin,
  Globe,
  Menu,
  MessageCircle,
  Truck,
  ShieldCheck,
  Users,
  Target,
  Sparkles,
  CheckCircle,
  Handshake,
  Rocket,
  Quote,
  ChevronLeft,
  ChevronRight,
  Pill,
  ClipboardList,
  Building2,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';

export default function Home() {
  const [locale, setLocale] = useState<Locale>('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const isNavigatingRef = useRef(false);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const parallaxSceneRef = useRef<HTMLDivElement>(null);

  const t = content[locale];
  const direction = getDirection(locale);

  // Measure the active nav button position for the sliding indicator
  const updateIndicator = useCallback(() => {
    const activeBtn = navButtonRefs.current.get(activeSection);
    const container = navContainerRef.current;
    if (activeBtn && container) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    }
  }, [activeSection]);

  useEffect(() => {
    updateIndicator();
  }, [activeSection, locale, updateIndicator]);

  useScrollAnimation();

  /* ═══════════════════════════════════════════════════════════
     PARALLAX ENGINE — Direct scroll-driven, GPU-accelerated
     ═══════════════════════════════════════════════════════════ */

  // 3D Parallax — each shape gets a Z-depth (perspective handles speed automatically)
  // + scroll-driven Y offset. Mouse tilt is applied on the parent scene via ref.
  const cl = (v: number, r: number) => Math.max(-r, Math.min(r, v));

  // z: depth (-400 = far/slow, -150 = mid, +100 = near/fast)
  const d3 = (z: number, scrollSpeed: number): React.CSSProperties => ({
    transform: `translateZ(${z}px) translateY(${cl(scrollY * scrollSpeed, 250)}px)`,
  });
  const d3r = (z: number, scrollSpeed: number, rotSpeed: number): React.CSSProperties => ({
    transform: `translateZ(${z}px) translateY(${cl(scrollY * scrollSpeed, 250)}px) rotate(${scrollY * rotSpeed}deg)`,
  });

  // Per-section depth elements (no 3D scene, just simple scroll offset)
  const pY = (speed: number): React.CSSProperties => ({
    transform: `translate3d(0, ${cl(scrollY * speed * 0.15, 200)}px, 0)`,
  });
  const pYR = (speed: number, rotSpeed: number): React.CSSProperties => ({
    transform: `translate3d(0, ${cl(scrollY * speed * 0.15, 200)}px, 0) rotate(${scrollY * rotSpeed * 0.1}deg)`,
  });
  const pYS = (speed: number, scaleRate: number): React.CSSProperties => ({
    transform: `translate3d(0, ${cl(scrollY * speed * 0.15, 200)}px, 0) scale(${1 + cl(scrollY * scaleRate * 0.0003, 0.3)})`,
  });

  // Hero content fade — dramatic separation from background
  const heroOpacity = Math.max(0, 1 - scrollY / 500);
  const heroContentStyle: React.CSSProperties = {
    transform: `translate3d(0, ${scrollY * -0.4}px, 0)`,
    opacity: heroOpacity,
    willChange: 'transform, opacity',
  };

  /* ═══════════════════════════════════════════════════════════
     DATA
     ═══════════════════════════════════════════════════════════ */

  const heroImages = [
    { url: "/images/hero-pharma-lab.webp", alt: "Modern pharmaceutical laboratory", title: t.heroImageTitles.modernExcellence },
    { url: "/images/hero-healthcare.webp", alt: "Healthcare professionals", title: t.heroImageTitles.qualityProducts },
    { url: "/images/hero-damascus.webp", alt: "Damascus cityscape", title: t.heroImageTitles.damascusHeritage },
  ];

  const productImages = [
    { url: "/images/service-registration.webp", alt: "Pharmaceutical registration", title: "Registration Department", product: t.products.items[0] },
    { url: "/images/service-marketing.webp", alt: "Medical marketing", title: "Medical Marketing", product: t.products.items[1] },
    { url: "/images/service-distribution.webp", alt: "Distribution services", title: "Distribution Services", product: t.products.items[2] },
  ];

  /* ═══════════════════════════════════════════════════════════
     EFFECTS
     ═══════════════════════════════════════════════════════════ */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % productImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [productImages.length]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          if (!isNavigatingRef.current) {
            const sections = ['home', 'about', 'products', 'services', 'advantages', 'contact'];
            for (const section of [...sections].reverse()) {
              const el = document.getElementById(section);
              if (el && window.scrollY >= el.offsetTop - 200) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Mouse-tracking 3D tilt — updates the parallax scene directly (no re-renders)
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!parallaxSceneRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      parallaxSceneRef.current.style.transform =
        `rotateY(${x * 4}deg) rotateX(${-y * 3}deg)`;
    };
    window.addEventListener('mousemove', handle, { passive: true });
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  /* ═══════════════════════════════════════════════════════════
     HANDLERS
     ═══════════════════════════════════════════════════════════ */

  const toggleLanguage = () => setLocale(locale === 'en' ? 'ar' : 'en');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    isNavigatingRef.current = true;
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    navTimeoutRef.current = setTimeout(() => { isNavigatingRef.current = false; }, 1000);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const nextProduct = () => setCurrentProductIndex((prev) => (prev + 1) % productImages.length);
  const prevProduct = () => setCurrentProductIndex((prev) => (prev - 1 + productImages.length) % productImages.length);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'products', label: t.nav.products },
    { id: 'services', label: t.nav.services },
    { id: 'contact', label: t.nav.contact },
  ];

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */

  return (
    <div
      className={['min-h-screen bg-[#0a0f0a]', direction === 'rtl' ? 'rtl' : 'ltr', locale === 'ar' ? 'font-arabic' : 'font-sans'].join(' ')}
      dir={direction}
    >
      {/* ─────────────── GLOBAL AMBIENT BACKGROUND ORBS (CSS animated) ─────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="orb orb-green w-[600px] h-[600px] top-[-10%] left-[-5%]" />
        <div className="orb orb-blue w-[500px] h-[500px] top-[30%] right-[-10%]" />
        <div className="orb orb-accent w-[400px] h-[400px] bottom-[-5%] left-[20%]" />
      </div>

      {/* ─────────────── 3D PARALLAX SCENE — perspective + mouse tilt ─────────────── */}
      <div className="parallax-layer" style={{ perspective: '1000px' }}>
        <div
          ref={parallaxSceneRef}
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d', transition: 'transform 0.4s ease-out' }}
        >
          {/* ═══ FAR LAYER (z:-400) — large shapes, slow scroll ═══ */}
          <div style={d3r(-400, -0.02, 0.003)} className="px-shape px-hex w-[140px] h-[150px] top-[18%] left-[3%]" />
          <div style={d3r(-400, -0.025, -0.002)} className="px-shape px-hex-double w-[170px] h-[95px] top-[55%] right-[2%]" />
          <div style={d3(-400, -0.018)} className="px-shape px-molecule w-[150px] h-[120px] top-[38%] left-[42%]" />
          <div style={d3(-400, -0.022)} className="px-shape px-heartbeat w-[300px] h-[58px] top-[75%] left-[4%]" />
          <div style={d3(-400, -0.015)} className="px-shape px-heartbeat w-[260px] h-[50px] top-[12%] right-[6%]" />
          <div style={d3r(-400, -0.02, 0.002)} className="px-shape px-hex w-[110px] h-[120px] top-[82%] left-[55%]" />

          {/* ═══ MID LAYER (z:-150) — medium shapes, moderate scroll ═══ */}
          <div style={d3r(-150, -0.05, 0.008)} className="px-shape px-capsule w-[70px] h-[27px] top-[10%] left-[8%]" />
          <div style={d3r(-150, -0.045, -0.006)} className="px-shape px-capsule-blue w-[65px] h-[25px] top-[45%] right-[5%]" />
          <div style={d3(-150, -0.055)} className="px-shape px-molecule w-[120px] h-[92px] top-[26%] right-[14%]" />
          <div style={d3(-150, -0.05)} className="px-shape px-tablet w-[36px] h-[36px] top-[62%] left-[24%]" />
          <div style={d3r(-150, -0.048, 0.005)} className="px-shape px-capsule w-[58px] h-[23px] top-[72%] right-[28%]" />
          <div style={d3(-150, -0.055)} className="px-shape px-molecule w-[105px] h-[82px] top-[85%] left-[32%]" />
          <div style={d3(-150, -0.045)} className="px-shape px-tablet w-[32px] h-[32px] top-[33%] left-[52%]" />
          <div style={d3r(-150, -0.05, -0.005)} className="px-shape px-capsule-blue w-[55px] h-[22px] top-[8%] left-[68%]" />

          {/* ═══ NEAR LAYER (z:+100) — small glowing shapes, fast scroll ═══ */}
          <div style={d3(100, -0.1)} className="px-shape px-med-cross w-[28px] h-[28px] top-[24%] left-[14%] px-glow" />
          <div style={d3r(100, -0.09, 0.015)} className="px-shape px-atom w-[20px] h-[20px] top-[50%] right-[10%] px-glow" />
          <div style={d3(100, -0.11)} className="px-shape px-med-cross w-[24px] h-[24px] top-[65%] left-[44%] px-glow" />
          <div style={d3r(100, -0.095, -0.012)} className="px-shape px-atom w-[18px] h-[18px] top-[16%] right-[34%] px-glow" />
          <div style={d3(100, -0.1)} className="px-shape px-atom w-[16px] h-[16px] top-[40%] left-[72%] px-glow" />
          <div style={d3(100, -0.09)} className="px-shape px-med-cross w-[22px] h-[22px] top-[80%] right-[18%] px-glow" />
        </div>
      </div>

      {/* ─────────────── FLOATING PILL NAVIGATION ─────────────── */}
      <nav
        className="fixed top-4 sm:top-6 left-0 right-0 z-50 transition-all duration-500 px-3 sm:px-4 flex justify-center"
        style={{ opacity: scrollY > 50 ? 1 : 0.95 }}
      >
        <div className="glass-strong rounded-full px-2 py-2 flex items-center gap-1 shadow-lg shadow-black/20 max-w-full">
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full hover:bg-[#4FAF3B]/10 transition-all duration-300 flex-shrink-0"
          >
            <Image src="/images/barjouk-logo.png" alt="Barjouk Pharma Logo" width={44} height={44} className="w-11 h-11 object-contain drop-shadow-[0_0_8px_rgba(79,175,59,0.4)]" />
            <span className="text-[#e8efe8] text-sm font-medium tracking-wide hidden lg:block">
              {locale === 'ar' ? 'برجوك' : 'Barjouk'}
            </span>
          </button>

          <div className="w-px h-5 bg-[#4FAF3B]/20 hidden md:block" />

          <div ref={navContainerRef} className="hidden md:flex items-center gap-0.5 relative">
            <motion.div
              className="absolute top-0 bottom-0 rounded-full bg-[#4FAF3B]/15"
              animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
              transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 0.8 }}
              style={{ pointerEvents: 'none' }}
            />
            {navItems.map((item) => (
              <button
                key={item.id}
                ref={(el) => { if (el) navButtonRefs.current.set(item.id, el); }}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-colors duration-300 relative z-10 ${
                  activeSection === item.id
                    ? 'text-[#78C850]'
                    : 'text-[#e8efe8]/60 hover:text-[#e8efe8] hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-[#4FAF3B]/20 hidden md:block" />

          <button
            onClick={toggleLanguage}
            className="px-2.5 sm:px-3 py-2 rounded-full text-xs text-[#e8efe8]/60 hover:text-[#e8efe8] hover:bg-white/5 transition-all duration-300 flex items-center gap-1.5 flex-shrink-0"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.nav.language}</span>
          </button>

          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-full text-[#e8efe8]/60 hover:text-[#e8efe8] hover:bg-white/5 transition-all">
                  <Menu className="h-4 w-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-[400px] sm:max-w-[400px] bg-[#0a0f0a]/98 backdrop-blur-2xl border-l border-[#4FAF3B]/10 p-0">
                <div className="flex flex-col h-full pt-[env(safe-area-inset-top,0px)]">
                  <SheetHeader className="px-6 pt-6 pb-2">
                    <SheetTitle className="flex items-center gap-3 text-xl font-light text-[#e8efe8] tracking-tight">
                      <Image src="/images/barjouk-logo.png" alt="Barjouk Pharma Logo" width={40} height={40} className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(79,175,59,0.4)]" />
                      {locale === 'ar' ? 'برجوك فارما' : 'Barjouk Pharma'}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-1 overflow-y-auto">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { scrollToSection(item.id); setIsMenuOpen(false); }}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 text-left group focus:outline-none ${
                          activeSection === item.id
                            ? 'bg-[#4FAF3B]/15 text-[#78C850]'
                            : 'text-[#e8efe8]/70 hover:bg-white/5 hover:text-[#e8efe8] active:bg-white/10'
                        }`}
                      >
                        <span className="text-base font-light">{item.label}</span>
                        <ArrowRight className={`h-4 w-4 transition-all duration-300 ${
                          activeSection === item.id
                            ? 'opacity-70 translate-x-0'
                            : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                        }`} />
                      </button>
                    ))}
                    <Separator className="my-3 bg-[#4FAF3B]/10" />
                    <button
                      onClick={() => { toggleLanguage(); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#e8efe8]/70 hover:bg-white/5 hover:text-[#e8efe8] active:bg-white/10 transition-all text-left focus:outline-none"
                    >
                      <Globe className="h-4.5 w-4.5" />
                      <span className="text-base font-light">{t.nav.language}</span>
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
           HERO SECTION — Deep Multi-Layer 3D Parallax
         ═══════════════════════════════════════════════════════════ */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Base mesh gradient */}
        <div className="absolute inset-0 mesh-gradient-hero" />

        {/* Grid Pattern — slow parallax (drifts down → appears far away) */}
        <div style={pY(0.1)} className="absolute inset-[-20%] z-[1]">
          <div className="grid-pattern absolute inset-0" />
        </div>

        {/* Hero Image Layer — parallax drift + scale (slower than content) */}
        <div style={pYS(0.5, 0.0002)} className="absolute inset-[-20%] z-[2]">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-[1500ms] ease-out ${
                index === currentImageIndex ? 'opacity-40 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${image.url})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#060a06]/80 via-[#060a06]/50 to-[#060a06]/90" />
            </div>
          ))}
        </div>

        {/* ── HERO DEPTH ELEMENTS (multiple layers, dramatically different speeds) ── */}
        <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
          {/* Large glowing orb — far depth */}
          <div
            style={pY(-0.15)}
            className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-[#4FAF3B]/12 rounded-full blur-[100px]"
          />

          {/* Smaller blue orb — medium depth */}
          <div
            style={pY(-0.25)}
            className="absolute bottom-[10%] left-[0%] w-[400px] h-[400px] bg-[#2F4A6D]/15 rounded-full blur-[80px]"
          />

          {/* Floating capsule — rotates on scroll */}
          <div
            style={pYR(-0.18, 0.06)}
            className="absolute top-[15%] left-[10%] px-shape px-capsule w-[60px] h-[24px] opacity-25 hidden md:block"
          />

          {/* Hexagonal molecule — opposite rotation */}
          <div
            style={pYR(-0.12, -0.04)}
            className="absolute bottom-[20%] right-[12%] px-shape px-hex w-[90px] h-[100px] opacity-20 hidden md:block"
          />

          {/* Accent dots — fast (near foreground) */}
          <div
            style={pY(-0.35)}
            className="absolute top-[30%] right-[22%] w-3 h-3 rounded-full bg-[#4FAF3B]/40 shadow-[0_0_12px_rgba(79,175,59,0.3)] hidden md:block"
          />
          <div
            style={pY(-0.45)}
            className="absolute top-[50%] left-[28%] w-2.5 h-2.5 rounded-full bg-[#78C850]/45 shadow-[0_0_10px_rgba(120,200,80,0.3)] hidden md:block"
          />
          <div
            style={pY(-0.38)}
            className="absolute top-[22%] right-[38%] w-2 h-2 rounded-full bg-[#4FAF3B]/35 shadow-[0_0_8px_rgba(79,175,59,0.25)] hidden md:block"
          />

          {/* Gradient lines */}
          <div
            style={pY(-0.2)}
            className="absolute top-[65%] left-[3%] w-[250px] h-px bg-gradient-to-r from-transparent via-[#4FAF3B]/20 to-transparent hidden md:block"
          />
          <div
            style={pY(-0.28)}
            className="absolute top-[25%] right-[3%] w-px h-[160px] bg-gradient-to-b from-transparent via-[#78C850]/15 to-transparent hidden md:block"
          />
        </div>

        {/* Hero Content — parallax (moves up faster, creating depth separation) */}
        <div
          style={heroContentStyle}
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 w-full"
        >
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-10 animate-fadeInUp" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <div className="chip">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4FAF3B] animate-pulse" />
                {heroImages[currentImageIndex].title}
              </div>
            </div>

            {/* Slide content — animated per slide */}
            <div className="relative min-h-[320px] md:min-h-[350px]">
              {t.hero.slides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ease-out ${
                    index === currentImageIndex
                      ? 'opacity-100 translate-y-0 relative'
                      : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
                  }`}
                >
                  {/* Title */}
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight text-[#e8efe8] mb-8 leading-[0.95] tracking-tighter">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-lg md:text-xl text-[#e8efe8]/70 mb-4 font-light leading-relaxed max-w-2xl">
                    {slide.subtitle}
                  </p>
                  <p className="text-base text-[#e8efe8]/50 mb-12 max-w-xl font-light leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Row */}
            <div className="flex flex-wrap items-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
              <Button
                size="lg"
                className="group bg-[#4FAF3B] hover:bg-[#2E7D32] text-white rounded-full px-8 py-3 text-sm font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-[#4FAF3B]/25 btn-glow"
                onClick={() => scrollToSection('contact')}
              >
                {t.hero.cta}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-[#e8efe8]/70 hover:text-[#e8efe8] hover:bg-white/5 rounded-full px-8 py-3 text-sm font-medium tracking-wide border border-[#4FAF3B]/20 hover:border-[#4FAF3B]/40 transition-all duration-300"
                onClick={() => scrollToSection('about')}
              >
                {t.nav.about}
              </Button>
            </div>

            {/* Slide indicators */}
            <div className="flex items-center gap-2 mt-16 animate-fadeInUp" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    index === currentImageIndex
                      ? 'bg-[#4FAF3B] w-10'
                      : 'bg-[#e8efe8]/20 w-6 hover:bg-[#e8efe8]/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
              <span className="ml-3 text-xs text-[#e8efe8]/30 font-mono">
                {String(currentImageIndex + 1).padStart(2, '0')} / {String(heroImages.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom fade — very tall for seamless transition */}
        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-[#0a0f0a] via-[#0a0f0a]/70 to-transparent z-20" />
      </section>

      {/* ═══════════════════════════════════════════════════════════
           ABOUT SECTION — Bento Grid + Depth Layers
         ═══════════════════════════════════════════════════════════ */}
      <section id="about" className="relative py-32 overflow-hidden">
        <div className="aurora-bg absolute inset-0" />
        {/* Section edge blends */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0a0f0a] to-transparent z-[1] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0f0a] to-transparent z-[1] pointer-events-none" />

        {/* Per-section depth elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            style={pY(-0.15)}
            className="absolute top-[5%] right-[3%] w-[400px] h-[400px] bg-[#4FAF3B]/10 rounded-full blur-[80px]"
          />
          <div
            style={pYR(-0.12, 0.08)}
            className="absolute bottom-[8%] left-[2%] px-shape px-molecule w-[100px] h-[80px] opacity-20 hidden md:block"
          />
          <div
            style={pY(-0.3)}
            className="absolute top-[40%] left-[6%] w-3 h-3 rounded-full bg-[#4FAF3B]/35 shadow-[0_0_8px_rgba(79,175,59,0.25)] hidden md:block"
          />
          <div
            style={pY(-0.25)}
            className="absolute top-[20%] right-[20%] w-2.5 h-2.5 rounded-full bg-[#78C850]/40 shadow-[0_0_8px_rgba(120,200,80,0.3)] hidden md:block"
          />
          <div
            style={pY(-0.18)}
            className="absolute bottom-[20%] right-[8%] w-[180px] h-px bg-gradient-to-r from-transparent via-[#4FAF3B]/20 to-transparent hidden md:block"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-20 animate-fadeInUp">
            <div className="chip mb-6">{t.sectionLabels.aboutKabrita}</div>
            <h2 className="text-4xl md:text-6xl font-extralight text-[#e8efe8] mb-6 tracking-tighter">
              {t.about.title}
            </h2>
            <div className="section-divider-left mb-8" />
            <p className="text-lg text-[#e8efe8]/50 max-w-2xl leading-relaxed font-light">
              {t.about.content}
            </p>
          </div>

          {/* Bento Grid */}
          <div className="bento-grid animate-stagger">
            {/* Vision — Large card */}
            <div className="bento-span-2 bento-row-2 glass-card-enhanced rounded-3xl p-8 lg:p-10 group transition-all duration-500 hover:border-[#4FAF3B]/30 relative overflow-hidden spotlight">
              <div className="relative z-10">
                <div className="icon-container icon-container-lg mb-6">
                  <Target className="h-7 w-7 text-[#4FAF3B]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-extralight text-[#e8efe8] mb-4 tracking-tight">
                  {t.vision.title}
                </h3>
                <p className="text-[#e8efe8]/50 leading-relaxed font-light text-base md:text-lg">
                  {t.vision.content}
                </p>
                <div className="mt-8 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <div className="w-8 h-px bg-gradient-to-r from-[#4FAF3B] to-transparent" />
                  <span className="text-[#78C850] text-xs font-medium tracking-wider uppercase">
                    {locale === 'ar' ? 'نظرتنا المستقبلية' : 'Our Forward Vision'}
                  </span>
                </div>
              </div>
              {/* Inner glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4FAF3B]/3 via-transparent to-[#2F4A6D]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
            </div>

            {/* Mission */}
            <div className="bento-span-2 glass-card-enhanced rounded-3xl p-8 group transition-all duration-500 hover:border-[#4FAF3B]/30 relative overflow-hidden">
              <div className="relative z-10">
                <div className="icon-container mb-5">
                  <ShieldCheck className="h-5 w-5 text-[#4FAF3B]" />
                </div>
                <h3 className="text-xl font-light text-[#e8efe8] mb-4 tracking-tight">
                  {t.mission.title}
                </h3>
                <ul className="space-y-3">
                  {t.mission.points.map((point, index) => (
                    <li key={index} className="text-[#e8efe8]/50 leading-relaxed font-light text-sm flex items-start gap-3">
                      <div className="w-1 h-1 rounded-full bg-[#4FAF3B] mt-2.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#4FAF3B]/2 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
            </div>

            {/* Values */}
            <div className="bento-span-2 glass-card-enhanced rounded-3xl p-8 group transition-all duration-500 hover:border-[#4FAF3B]/30 relative overflow-hidden">
              <div className="relative z-10">
                <div className="icon-container mb-5">
                  <Sparkles className="h-5 w-5 text-[#78C850]" />
                </div>
                <h3 className="text-xl font-light text-[#e8efe8] mb-4 tracking-tight">
                  {t.values.title}
                </h3>
                <div className="space-y-4">
                  {t.values.items.map((value, index) => (
                    <div key={index} className="group/item">
                      <h4 className="text-sm font-medium text-[#78C850] mb-1 tracking-wide">{value.title}</h4>
                      <p className="text-xs text-[#e8efe8]/40 font-light leading-relaxed">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-bl from-[#78C850]/2 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
           PRODUCTS SECTION — Immersive 3D Showcase + Depth
         ═══════════════════════════════════════════════════════════ */}
      <section id="products" className="relative py-32 overflow-hidden">
        <div className="dot-pattern absolute inset-0" />
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0a0f0a] to-transparent z-[1] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0f0a] to-transparent z-[1] pointer-events-none" />

        {/* Depth elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            style={pY(-0.14)}
            className="absolute top-[10%] left-[5%] w-[350px] h-[350px] bg-[#2F4A6D]/12 rounded-full blur-[80px]"
          />
          <div
            style={pYR(-0.1, 0.07)}
            className="absolute bottom-[15%] right-[5%] px-shape px-hex-double w-[110px] h-[65px] opacity-18 hidden md:block"
          />
          <div
            style={pY(-0.28)}
            className="absolute top-[30%] right-[15%] w-3 h-3 rounded-full bg-[#78C850]/40 shadow-[0_0_10px_rgba(120,200,80,0.3)] hidden md:block"
          />
          <div
            style={pY(-0.16)}
            className="absolute bottom-[30%] left-[12%] w-px h-[120px] bg-gradient-to-b from-transparent via-[#4FAF3B]/18 to-transparent hidden md:block"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-8 animate-fadeInUp">
            <div>
              <div className="chip mb-6">{t.sectionLabels.ourProducts}</div>
              <h2 className="text-4xl md:text-6xl font-extralight text-[#e8efe8] tracking-tighter">
                {t.products.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={prevProduct}
                className="w-12 h-12 rounded-full border border-[#4FAF3B]/20 flex items-center justify-center text-[#e8efe8]/50 hover:text-[#e8efe8] hover:bg-[#4FAF3B]/10 hover:border-[#4FAF3B]/40 transition-all duration-300"
                aria-label={t.ariaLabels.previousProduct}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextProduct}
                className="w-12 h-12 rounded-full border border-[#4FAF3B]/20 flex items-center justify-center text-[#e8efe8]/50 hover:text-[#e8efe8] hover:bg-[#4FAF3B]/10 hover:border-[#4FAF3B]/40 transition-all duration-300"
                aria-label={t.ariaLabels.nextProduct}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Product Showcase Card */}
          <div className="relative rounded-[2rem] overflow-hidden border border-[#4FAF3B]/10 animate-scaleIn group hover-lift-subtle">
            <div className="absolute inset-0">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
                    index === currentProductIndex ? 'opacity-50 scale-100' : 'opacity-0 scale-110'
                  }`}
                >
                  <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${image.url})` }}
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f0a]/95 via-[#0a0f0a]/70 to-[#0a0f0a]/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a]/80 via-transparent to-[#0a0f0a]/30" />
            </div>

            <div className="relative z-10 p-8 md:p-12 lg:p-16 min-h-[500px] md:min-h-[600px] flex flex-col justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-xs font-mono text-[#4FAF3B]">
                    {String(currentProductIndex + 1).padStart(2, '0')}
                  </span>
                  <div className="w-8 h-px bg-[#4FAF3B]/40" />
                  <span className="text-xs text-[#e8efe8]/30 font-mono">
                    {locale === 'ar' ? 'خدماتنا' : 'Our Services'}
                  </span>
                </div>

                <h3 className="text-3xl md:text-5xl lg:text-6xl font-extralight text-[#e8efe8] mb-8 leading-tight tracking-tighter">
                  {productImages[currentProductIndex]?.product?.name}
                </h3>

                <div className="space-y-4 mb-10">
                  {productImages[currentProductIndex]?.product?.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-4 group/feat">
                      <div className="w-6 h-px bg-gradient-to-r from-[#4FAF3B] to-transparent group-hover/feat:w-10 transition-all duration-300" />
                      <span className="text-sm md:text-base text-[#e8efe8]/60 font-light group-hover/feat:text-[#e8efe8]/80 transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="group/btn bg-white/10 hover:bg-[#4FAF3B] text-[#e8efe8] rounded-full px-8 py-3 text-sm font-medium border border-white/10 hover:border-[#4FAF3B] transition-all duration-300 backdrop-blur-sm"
                  onClick={() => scrollToSection('contact')}
                >
                  {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Button>
              </div>

              <div className="flex items-center gap-3 mt-8">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProductIndex(index)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      index === currentProductIndex
                        ? 'bg-[#4FAF3B] w-10'
                        : 'bg-[#e8efe8]/15 w-6 hover:bg-[#e8efe8]/30'
                    }`}
                    aria-label={`Go to product ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
           SERVICES & STATISTICS SECTION — Depth Layers
         ═══════════════════════════════════════════════════════════ */}
      <section id="services" className="relative py-32 overflow-hidden">
        <div className="aurora-bg absolute inset-0" />
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0a0f0a] to-transparent z-[1] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0f0a] to-transparent z-[1] pointer-events-none" />

        {/* Depth elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            style={pY(-0.16)}
            className="absolute top-[8%] right-[5%] w-[380px] h-[380px] bg-[#4FAF3B]/10 rounded-full blur-[80px]"
          />
          <div
            style={pYR(-0.12, 0.09)}
            className="absolute bottom-[10%] left-[3%] px-shape px-capsule-blue w-[55px] h-[22px] opacity-20 hidden md:block"
          />
          <div
            style={pY(-0.3)}
            className="absolute top-[45%] right-[20%] w-3 h-3 rounded-full bg-[#78C850]/40 shadow-[0_0_10px_rgba(120,200,80,0.3)] hidden md:block"
          />
          <div
            style={pY(-0.18)}
            className="absolute top-[60%] left-[10%] w-[150px] h-px bg-gradient-to-r from-transparent via-[#4FAF3B]/18 to-transparent hidden md:block"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="mb-20 animate-fadeInUp">
            <div className="chip mb-6">{t.sectionLabels.ourServices}</div>
            <h2 className="text-4xl md:text-6xl font-extralight text-[#e8efe8] tracking-tighter mb-4">
              {t.services.title}
            </h2>
            <div className="section-divider-left" />
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-32 animate-stagger">
            {t.services.items.map((service, index) => {
              const icons = [ClipboardList, Pill, Truck, Building2];
              const Icon = icons[index % icons.length];

              return (
                <div
                  key={index}
                  className="glass-card-enhanced rounded-2xl p-6 group transition-all duration-500 hover:border-[#4FAF3B]/30 relative overflow-hidden hover-lift-subtle"
                >
                  <div className="relative z-10">
                    <div className="icon-container mb-5">
                      <Icon className="h-5 w-5 text-[#78C850]" />
                    </div>
                    <h4 className="text-base font-medium text-[#e8efe8] mb-3 tracking-tight">
                      {service.title}
                    </h4>
                    <p className="text-sm text-[#e8efe8]/40 leading-relaxed font-light">
                      {service.description}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4FAF3B]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4FAF3B]/2 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />
                </div>
              );
            })}
          </div>

          {/* Statistics — Immersive Panel */}
          <div className="relative rounded-[2rem] overflow-hidden border border-[#4FAF3B]/15 animate-scaleIn">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d1a0d] via-[#0a0f0a] to-[#0d1520]" />
            <div className="absolute inset-0 grid-pattern" />
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#4FAF3B]/5 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#2F4A6D]/8 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <div className="text-center mb-14">
                <h3 className="text-3xl md:text-4xl font-extralight text-[#e8efe8] mb-3 tracking-tight">
                  {t.stats.title}
                </h3>
                <div className="section-divider mt-4" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
                {t.stats.items.map((stat, index) => (
                  <div
                    key={index}
                    className="stat-card glass-card-enhanced rounded-2xl p-6 text-center group"
                  >
                    <div className="text-2xl md:text-3xl font-light text-[#e8efe8] mb-2 tracking-tight text-shimmer">
                      {stat.number}
                    </div>
                    <div className="text-[10px] md:text-xs text-[#e8efe8]/40 font-medium tracking-wider uppercase">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
           WHY CHOOSE US — Depth Layers + 3D
         ═══════════════════════════════════════════════════════════ */}
      <section id="advantages" className="relative py-32 overflow-hidden">
        <div className="dot-pattern absolute inset-0" />
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0a0f0a] to-transparent z-[1] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0f0a] to-transparent z-[1] pointer-events-none" />

        {/* Depth elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            style={pY(-0.17)}
            className="absolute top-[3%] left-[5%] w-[420px] h-[420px] bg-[#2F4A6D]/10 rounded-full blur-[90px]"
          />
          <div
            style={pYR(-0.13, 0.08)}
            className="absolute bottom-[5%] right-[4%] px-shape px-hex w-[75px] h-[85px] opacity-18 hidden md:block"
          />
          <div
            style={pY(-0.32)}
            className="absolute top-[25%] right-[12%] w-3.5 h-3.5 rounded-full bg-[#4FAF3B]/35 shadow-[0_0_10px_rgba(79,175,59,0.25)] hidden md:block"
          />
          <div
            style={pY(-0.18)}
            className="absolute top-[50%] right-[8%] w-px h-[160px] bg-gradient-to-b from-transparent via-[#78C850]/15 to-transparent hidden md:block"
          />
          <div
            style={pY(-0.26)}
            className="absolute bottom-[30%] left-[15%] w-2.5 h-2.5 rounded-full bg-[#78C850]/40 shadow-[0_0_8px_rgba(120,200,80,0.3)] hidden md:block"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-20 animate-fadeInUp">
            <div className="chip mx-auto mb-6">{t.sectionLabels.whyChooseUs}</div>
            <h2 className="text-4xl md:text-6xl font-extralight text-[#e8efe8] tracking-tighter mb-4">
              {t.advantages.title}
            </h2>
            <div className="section-divider mt-4" />
          </div>

          {/* Advantages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-32 animate-stagger">
            {t.advantages.items.map((adv, index) => (
              <div
                key={index}
                className="glass-card-enhanced rounded-2xl p-6 group transition-all duration-500 hover:border-[#4FAF3B]/30 relative overflow-hidden hover-lift-subtle"
              >
                <div className="relative z-10 flex items-start gap-4">
                  <div className="icon-container flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-[#4FAF3B]" />
                  </div>
                  <p className="text-sm text-[#e8efe8]/70 font-light leading-relaxed pt-2">
                    {adv}
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#4FAF3B]/3 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
            ))}
          </div>

          {/* Testimonial — Full-width immersive */}
          <div className="relative rounded-[2rem] overflow-hidden border border-[#4FAF3B]/10 mb-32 animate-scaleIn">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0d1a0d] to-[#0a0f0a]" />
            <div className="absolute inset-0 spotlight" />
            <div className="relative z-10 p-10 md:p-16 lg:p-20 text-center">
              <Quote className="mx-auto h-10 w-10 text-[#4FAF3B]/30 mb-10" />
              <p className="text-xl md:text-3xl lg:text-4xl font-extralight text-[#e8efe8] mb-8 leading-relaxed tracking-tight max-w-4xl mx-auto">
                &ldquo;{t.testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-px bg-[#4FAF3B]/40" />
                <p className="text-sm text-[#78C850] font-medium tracking-wide">{t.testimonial.author}</p>
                <div className="w-8 h-px bg-[#4FAF3B]/40" />
              </div>
            </div>
          </div>

          {/* Partners — Split Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-32 animate-stagger">
            <div className="glass-card-enhanced rounded-3xl p-8 lg:p-10 group transition-all duration-500 hover:border-[#4FAF3B]/30 relative overflow-hidden hover-lift-subtle">
              <div className="relative z-10">
                <div className="icon-container icon-container-lg mb-6">
                  <Globe className="h-7 w-7 text-[#78C850]" />
                </div>
                <h3 className="text-2xl font-light text-[#e8efe8] mb-6 tracking-tight">
                  {t.partners.globalTitle}
                </h3>
                <ul className="space-y-3">
                  {t.partners.global.map((item, idx) => (
                    <li key={idx} className="text-sm text-[#e8efe8]/50 font-light leading-relaxed flex items-start gap-3">
                      <div className="w-1 h-1 rounded-full bg-[#4FAF3B] mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#78C850]/2 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
            </div>

            <div className="glass-card-enhanced rounded-3xl p-8 lg:p-10 group transition-all duration-500 hover:border-[#4FAF3B]/30 relative overflow-hidden hover-lift-subtle">
              <div className="relative z-10">
                <div className="icon-container icon-container-lg mb-6">
                  <Handshake className="h-7 w-7 text-[#78C850]" />
                </div>
                <h3 className="text-2xl font-light text-[#e8efe8] mb-6 tracking-tight">
                  {t.partners.localTitle}
                </h3>
                <ul className="space-y-3">
                  {t.partners.local.map((item, idx) => (
                    <li key={idx} className="text-sm text-[#e8efe8]/50 font-light leading-relaxed flex items-start gap-3">
                      <div className="w-1 h-1 rounded-full bg-[#4FAF3B] mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute inset-0 bg-gradient-to-bl from-[#4FAF3B]/2 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
            </div>
          </div>

          {/* Future Plans — Gradient Panel */}
          <div className="relative rounded-[2rem] overflow-hidden animate-fadeInUp">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2E7D32]/20 via-[#0a0f0a] to-[#2F4A6D]/10" />
            <div className="absolute inset-0 border border-[#4FAF3B]/15 rounded-[2rem]" />
            <div className="absolute inset-0 grid-pattern" />

            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <div className="text-center mb-14">
                <h3 className="text-3xl md:text-4xl font-extralight text-[#e8efe8] mb-3 tracking-tight">
                  {t.future.title}
                </h3>
                <p className="text-lg text-[#e8efe8]/40 font-light italic">
                  {t.future.subtitle}
                </p>
                <div className="section-divider mt-6" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {t.future.points.map((point, index) => (
                  <div
                    key={index}
                    className="glass-card-enhanced rounded-2xl p-6 group transition-all duration-500 hover:border-[#4FAF3B]/30 relative overflow-hidden hover-lift-subtle"
                  >
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="icon-container flex-shrink-0">
                        <Rocket className="h-5 w-5 text-[#78C850]" />
                      </div>
                      <p className="text-sm text-[#e8efe8]/60 font-light leading-relaxed pt-2">
                        {point}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
           CONTACT SECTION — Split Immersive + Depth
         ═══════════════════════════════════════════════════════════ */}
      <section id="contact" className="relative py-32 overflow-hidden">
        <div className="aurora-bg absolute inset-0" />
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0a0f0a] to-transparent z-[1] pointer-events-none" />

        {/* Depth elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            style={pY(-0.14)}
            className="absolute top-[5%] left-[8%] w-[350px] h-[350px] bg-[#4FAF3B]/10 rounded-full blur-[80px]"
          />
          <div
            style={pYR(-0.1, 0.07)}
            className="absolute bottom-[10%] right-[5%] px-shape px-atom w-[16px] h-[16px] opacity-25 hidden md:block"
          />
          <div
            style={pY(-0.28)}
            className="absolute top-[40%] right-[12%] w-2.5 h-2.5 rounded-full bg-[#4FAF3B]/40 shadow-[0_0_8px_rgba(79,175,59,0.25)] hidden md:block"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-20 animate-fadeInUp">
            <div className="chip mx-auto mb-6">{t.sectionLabels.getInTouch}</div>
            <h2 className="text-4xl md:text-6xl font-extralight text-[#e8efe8] tracking-tighter mb-4">
              {t.contact.title}
            </h2>
            <p className="text-lg text-[#e8efe8]/40 max-w-xl mx-auto font-light">
              {t.contact.description}
            </p>
            <div className="section-divider mt-6" />
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 animate-stagger">
            {/* Primary CTA — Large Card */}
            <div className="lg:col-span-3 relative rounded-[2rem] overflow-hidden border border-[#4FAF3B]/15 group hover-lift-subtle">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0d1a0d] via-[#0a0f0a] to-[#0d1520]" />
              <div className="absolute inset-0 spotlight" />
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#4FAF3B]/5 rounded-full blur-[100px]" />

              <div className="relative z-10 p-8 md:p-12 flex flex-col justify-between min-h-[400px]">
                <div>
                  <div className="icon-container icon-container-lg mb-8 float-animation">
                    <MessageCircle className="h-7 w-7 text-[#78C850]" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extralight text-[#e8efe8] mb-4 tracking-tight leading-tight">
                    {locale === 'ar' ? 'تواصل معنا فوراً' : 'Connect With Us Instantly'}
                  </h3>
                  <p className="text-base text-[#e8efe8]/40 font-light leading-relaxed max-w-md mb-8">
                    {locale === 'ar'
                      ? 'نحن متواجدون دائماً لخدمتكم وتلبية احتياجاتكم'
                      : "We're always here to serve you and meet your business needs"
                    }
                  </p>
                </div>
                <div>
                  <Button
                    asChild
                    size="lg"
                    className="group/wa bg-[#4FAF3B] hover:bg-[#2E7D32] text-white rounded-full px-8 py-3 text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#4FAF3B]/25 btn-glow w-full md:w-auto"
                  >
                    <a
                      href={`https://wa.me/${t.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hey i got your number from your official website')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 justify-center"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span dir="ltr">{t.contact.whatsapp}</span>
                      <ArrowUpRight className="h-4 w-4 group-hover/wa:translate-x-0.5 group-hover/wa:-translate-y-0.5 transition-transform" />
                    </a>
                  </Button>
                  <p className="text-xs text-[#e8efe8]/25 mt-3 font-light">
                    {locale === 'ar' ? 'انقر للمراسلة الفورية' : 'Click for instant messaging'}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Cards Stack */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Address */}
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=33.526306,36.317208"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card-enhanced rounded-2xl p-6 group transition-all duration-500 hover:border-[#4FAF3B]/30 hover-lift-subtle block"
              >
                <div className="flex items-start gap-4">
                  <div className="icon-container flex-shrink-0">
                    <MapPin className="h-5 w-5 text-[#78C850]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#e8efe8] mb-1 flex items-center gap-2">
                      {locale === 'ar' ? 'العنوان' : 'Address'}
                      <ArrowUpRight className="h-3 w-3 text-[#78C850] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-xs text-[#e8efe8]/40 leading-relaxed font-light">
                      {t.contact.address}
                    </p>
                    <p className="text-[10px] text-[#78C850]/60 mt-1.5 font-light group-hover:text-[#78C850] transition-colors">
                      {locale === 'ar' ? 'افتح في خرائط جوجل' : 'Open in Google Maps'}
                    </p>
                  </div>
                </div>
              </a>

              {/* Email */}
              <div className="glass-card-enhanced rounded-2xl p-6 group transition-all duration-500 hover:border-[#4FAF3B]/30 hover-lift-subtle">
                <div className="flex items-start gap-4">
                  <div className="icon-container flex-shrink-0">
                    <Mail className="h-5 w-5 text-[#78C850]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#e8efe8] mb-1">
                      {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </h4>
                    <a
                      href={`mailto:${t.contact.email}?subject=Contact from Official Website&body=${encodeURIComponent('Hey i got your number from your official website')}`}
                      className="text-xs text-[#78C850] hover:text-[#A7D97A] font-medium transition-colors break-all"
                    >
                      {t.contact.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* B2B */}
              <div className="glass-card-enhanced rounded-2xl p-6 group transition-all duration-500 hover:border-[#4FAF3B]/30 flex-1 hover-lift-subtle">
                <div className="flex items-start gap-4">
                  <div className="icon-container flex-shrink-0">
                    <Users className="h-5 w-5 text-[#78C850]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-[#e8efe8] mb-1">
                      {locale === 'ar' ? 'للشراكات والموردين الكرام' : 'Partnerships & Suppliers'}
                    </h4>
                    <a
                      href={`mailto:${t.contact.b2b}?subject=B2B Inquiry from Official Website&body=${encodeURIComponent('Hey i got your number from your official website')}`}
                      className="text-xs text-[#78C850] hover:text-[#A7D97A] font-medium transition-colors break-all"
                    >
                      {t.contact.b2b}
                    </a>
                    <p className="text-[10px] text-[#e8efe8]/25 mt-1.5 font-light">
                      {locale === 'ar' ? 'للشراكات التجارية والتوزيع' : 'For business partnerships & distribution'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Map */}
          <div className="mt-8 relative rounded-[2rem] overflow-hidden border border-[#4FAF3B]/15 animate-fadeInUp h-[350px]">
            <iframe
              src="https://maps.google.com/maps?q=33.526306,36.317208&z=17&output=embed"
              width="100%"
              height="450"
              style={{
                border: 0,
                filter: 'invert(1) hue-rotate(180deg)',
                marginBottom: '-100px',
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Barjouk Pharma Location"
              className="w-full"
            />
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=33.526306,36.317208"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4FAF3B] hover:bg-[#2E7D32] text-white text-xs font-medium transition-all duration-300 shadow-lg"
            >
              <MapPin className="h-3.5 w-3.5" />
              {locale === 'ar' ? 'الاتجاهات' : 'Get Directions'}
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
           FOOTER — Minimal Modern
         ═══════════════════════════════════════════════════════════ */}
      <footer className="relative py-16 border-t border-[#4FAF3B]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Image src="/images/barjouk-logo.png" alt="Barjouk Pharma Logo" width={48} height={48} className="w-12 h-12 object-contain drop-shadow-[0_0_8px_rgba(79,175,59,0.4)]" />
                <span className="text-lg font-light text-[#e8efe8] tracking-wide">
                  {locale === 'ar' ? 'برجوك فارما' : 'Barjouk Pharma'}
                </span>
              </div>
              <p className="text-sm text-[#e8efe8]/30 font-light max-w-sm">
                {locale === 'ar'
                  ? 'نرتقي بالرعاية الصحية .... ونبني الثقة'
                  : 'Elevating Healthcare... Building Trust'
                }
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={`https://wa.me/${t.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hey i got your number from your official website')}`}
                className="w-10 h-10 rounded-full border border-[#4FAF3B]/15 flex items-center justify-center text-[#e8efe8]/30 hover:text-[#78C850] hover:border-[#4FAF3B]/40 transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${t.contact.email}?subject=Contact from Official Website&body=${encodeURIComponent('Hey i got your number from your official website')}`}
                className="w-10 h-10 rounded-full border border-[#4FAF3B]/15 flex items-center justify-center text-[#e8efe8]/30 hover:text-[#78C850] hover:border-[#4FAF3B]/40 transition-all duration-300"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>

            <p className="text-xs text-[#e8efe8]/15 font-light">
              © 2026 Coddra. inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
