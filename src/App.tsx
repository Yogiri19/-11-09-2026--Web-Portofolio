import { useEffect, useRef, useState } from 'react';
import {
  Globe,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Phone,
  Database,
  Bot,
  Layers,
  CheckCircle2,
  Download,
  X,
  Sparkles
} from 'lucide-react';
import { AskYogiriModal } from './components/AskYogiriModal';
import { translations, Language } from './data/translations';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('yogiri_lang');
    return saved === 'en' || saved === 'id' ? saved : 'id';
  });

  const toggleLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('yogiri_lang', lang);
  };

  const t = translations[language];

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  const fadingOutRef = useRef<boolean>(false);
  const currentFadeOpacityRef = useRef<number>(0);

  const [fadeOpacity, setFadeOpacity] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isAskYogiriOpen, setIsAskYogiriOpen] = useState<boolean>(false);

  const selectedProject = selectedProjectId
    ? t.projects.items.find((p) => p.id === selectedProjectId) || null
    : null;

  // Global keyboard shortcut (Ctrl+K or Cmd+K) to open Ask Yogiri AI
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAskYogiriOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const targetScrollProgressRef = useRef<number>(0);

  // Custom requestAnimationFrame fade animation for video load and loop
  const animateFade = (targetOpacity: number, durationMs: number = 500, onComplete?: () => void) => {
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }

    const startOpacity = currentFadeOpacityRef.current;
    const diff = targetOpacity - startOpacity;

    if (Math.abs(diff) < 0.001) {
      currentFadeOpacityRef.current = targetOpacity;
      setFadeOpacity(targetOpacity);
      onComplete?.();
      return;
    }

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const val = startOpacity + diff * progress;

      currentFadeOpacityRef.current = val;
      setFadeOpacity(val);

      if (progress < 1) {
        fadeRafRef.current = requestAnimationFrame(tick);
      } else {
        currentFadeOpacityRef.current = targetOpacity;
        setFadeOpacity(targetOpacity);
        fadeRafRef.current = null;
        onComplete?.();
      }
    };

    fadeRafRef.current = requestAnimationFrame(tick);
  };

  // Video initialization and autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    currentFadeOpacityRef.current = 0;
    setFadeOpacity(0);
    fadingOutRef.current = false;
    video.currentTime = 0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => animateFade(1, 500))
        .catch((err) => {
          console.warn('Autoplay prevented or load notice:', err);
          animateFade(1, 500);
        });
    }

    return () => {
      if (fadeRafRef.current !== null) {
        cancelAnimationFrame(fadeRafRef.current);
      }
    };
  }, []);

  // Smooth scroll listener with lerp for OpenAI Astra-style orbit expansion
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 0.65;
      const raw = Math.min(Math.max(scrollY / threshold, 0), 1);
      targetScrollProgressRef.current = raw;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    let rafId: number;
    let current = 0;

    const lerpLoop = () => {
      const target = targetScrollProgressRef.current;
      if (Math.abs(target - current) > 0.0005) {
        current += (target - current) * 0.12;
        setScrollProgress(current);
      } else if (current !== target) {
        current = target;
        setScrollProgress(current);
      }
      rafId = requestAnimationFrame(lerpLoop);
    };

    rafId = requestAnimationFrame(lerpLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Monitor timeUpdate for 500ms fade-out when 0.55s remain before video ends
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const timeLeft = video.duration - video.currentTime;
    if (timeLeft <= 0.55 && !fadingOutRef.current) {
      fadingOutRef.current = true;
      animateFade(0, 500);
    }
  };

  // On ended: opacity 0, then after 100ms reset currentTime to 0, play, and fade back in
  const handleEnded = () => {
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }

    currentFadeOpacityRef.current = 0;
    setFadeOpacity(0);

    setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;

      fadingOutRef.current = false;
      v.currentTime = 0;
      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => animateFade(1, 500))
          .catch((err) => {
            console.warn('Playback error on loop reset:', err);
            animateFade(1, 500);
          });
      }
    }, 100);
  };

  const orbitScale = 1 + scrollProgress * 0.45;
  const orbitScaleX = 1 + scrollProgress * 1.55;
  const orbitFade = Math.max(0, 1 - scrollProgress * 1.4);
  const effectiveOrbitOpacity = fadeOpacity * orbitFade;
  const orbitBlur = scrollProgress * 8; // in px

  // Hero content gentle vertical parallax
  const heroContentOpacity = Math.max(0, 1 - scrollProgress * 1.6);
  const heroContentTranslateY = -scrollProgress * 45; // purely vertical

  // Skills Data with translated titles
  const skillGroups = [
    {
      category: t.skills.categories.ai,
      icon: <Bot className="text-white" size={20} />,
      items: [
        'Large Language Models (LLMs)',
        'Multi-Agent Systems (CrewAI)',
        'LangChain & Tool Use',
        'RAG Pipelines & Chunking',
        'Vector Databases (ChromaDB)',
        'HuggingFace & Transformers',
        'Ollama Local Inference',
        'PyTorch & Deep Learning',
        'ResNet18 & Custom CNNs',
        'YOLO11 & Object Detection',
        'OpenCV Computer Vision'
      ]
    },
    {
      category: t.skills.categories.backend,
      icon: <Layers className="text-white" size={20} />,
      items: [
        'Python (Advanced)',
        'FastAPI & Pydantic v2',
        'Clean Architecture Pattern',
        'Flask Microservices',
        'Streamlit Rapid Apps',
        'Docker & Containerization',
        'Docker Compose Multi-service',
        'Asynchronous Programming',
        'RESTful API Design',
        'CI/CD & Git Workflows'
      ]
    },
    {
      category: t.skills.categories.data,
      icon: <Database className="text-white" size={20} />,
      items: [
        'NumPy & Pandas',
        'Scikit-Learn (sklearn)',
        'ChromaDB Vector Store',
        'MongoDB NoSQL',
        'Data Augmentation Pipelines',
        'Model Evaluation & Metrics',
        'Matplotlib & Seaborn'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-white/20 selection:text-white font-sans antialiased">
      {/* Sticky Hero Viewport */}
      <div className="relative h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* Background Orbit Element (Astra-Class Motion) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center overflow-hidden"
          style={{
            transform: `translate3d(0, 17%, 0) scale(${orbitScale}) scaleX(${orbitScaleX})`,
            opacity: effectiveOrbitOpacity,
            filter: `blur(${orbitBlur}px)`,
            willChange: 'transform, opacity, filter',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 60%, black 45%, transparent 78%)',
            maskImage: 'radial-gradient(ellipse 75% 65% at 50% 60%, black 45%, transparent 78%)',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            className="w-full h-full object-cover pointer-events-none"
            style={{ opacity: 1 }}
          >
            <source src="./background.mp4" type="video/mp4" />
            <source
              src="https://drive.usercontent.google.com/download?id=1otZj3wbzhFRbnsjeQzLO8jOpkqZHpa8t&export=download"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Navigation Bar */}
        <header className="relative z-20 pl-4 pr-4 sm:pl-6 sm:pr-6 py-6">
          <div className="rounded-full px-4 sm:px-6 py-3 flex items-center justify-between max-w-6xl mx-auto w-full liquid-glass gap-2 sm:gap-4">
            
            {/* Left side: Brand Logo */}
            <div className="flex items-center gap-6 lg:gap-8">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2.5 text-white font-semibold text-lg cursor-pointer group flex-shrink-0"
              >
                <div className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="leading-tight tracking-tight text-sm sm:text-base font-semibold whitespace-nowrap">Fakhri Dinal</span>
                  <span className="hidden sm:block text-[10px] text-white/50 tracking-wider font-mono uppercase">{t.nav.role}</span>
                </div>
              </a>

              {/* Navigation links */}
              <nav className="hidden md:flex items-center gap-6 lg:gap-7">
                <a
                  href="#about"
                  className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                >
                  {t.nav.about}
                </a>
                <a
                  href="#projects"
                  className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                >
                  {t.nav.projects}
                </a>
                <a
                  href="#skills"
                  className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                >
                  {t.nav.skills}
                </a>
                <a
                  href="#contact"
                  className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                >
                  {t.nav.contact}
                </a>
              </nav>
            </div>

            {/* Right side: Language Switcher + Ask Yogiri AI Bar + Resume CV + Hire Me */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* 1-Click Language Switcher Toolbar */}
              <div className="liquid-glass rounded-full p-0.5 sm:p-1 flex items-center border border-white/10">
                <button
                  type="button"
                  onClick={() => toggleLanguage('id')}
                  className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-mono transition-all cursor-pointer ${
                    language === 'id'
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  title="Ganti ke Bahasa Indonesia"
                >
                  🇮🇩 ID
                </button>
                <button
                  type="button"
                  onClick={() => toggleLanguage('en')}
                  className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-mono transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                  title="Switch to English"
                >
                  🇬🇧 EN
                </button>
              </div>

              {/* Ask Yogiri AI Bar */}
              <button
                type="button"
                onClick={() => setIsAskYogiriOpen(true)}
                className="liquid-glass rounded-full pl-2.5 sm:pl-3 pr-3 sm:pr-3.5 py-1.5 text-white text-xs sm:text-sm font-medium hover:bg-white/10 hover:border-emerald-400/40 transition-all flex items-center gap-1.5 sm:gap-2 border border-white/10 group cursor-pointer shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles size={11} className="animate-pulse" />
                </div>
                <span className="tracking-tight text-xs sm:text-sm">{t.nav.askYogiri}</span>
                <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono rounded bg-white/10 text-white/50 border border-white/10">
                  ⌘K
                </kbd>
              </button>

              <a
                href="./Fakhri_Dinal_Maulana_Putra_CV.pdf"
                download="Fakhri_Dinal_Maulana_Putra_CV.pdf"
                className="hidden sm:flex liquid-glass rounded-full px-3.5 sm:px-4 py-1.5 text-white text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors items-center gap-2"
              >
                <Download size={14} />
                <span>{t.nav.downloadCv}</span>
              </a>

              <a
                href="#contact"
                className="bg-white text-black rounded-full px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium hover:bg-white/90 transition-colors"
              >
                {t.nav.hireMe}
              </a>
            </div>
          </div>
        </header>

        {/* Hero Content Area */}
        <main
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[12%]"
          style={{
            opacity: heroContentOpacity,
            transform: `translate3d(0, calc(-12% + ${heroContentTranslateY}px), 0)`,
            willChange: 'transform, opacity',
            pointerEvents: heroContentOpacity < 0.1 ? 'none' : 'auto',
          }}
        >
          {/* Status badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass text-xs font-mono text-white/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.hero.statusBadge}</span>
          </div>

          {/* Main Hero Heading */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {t.hero.name}
          </h1>

          <div className="max-w-2xl w-full space-y-6">
            {/* Tagline / Subtitle */}
            <p className="text-white/80 text-base md:text-lg leading-relaxed font-light px-4">
              {t.hero.taglineBefore}
              <span className="text-white font-medium">{t.hero.taglineHighlight1}</span>
              {t.hero.taglineMiddle}
              <span className="text-white font-medium">{t.hero.taglineHighlight2}</span>
              {t.hero.taglineAnd}
              <span className="text-white font-medium">{t.hero.taglineHighlight3}</span>.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="#projects"
                className="liquid-glass rounded-full px-8 py-3.5 text-white text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2 group cursor-pointer"
              >
                <span>{t.hero.viewProjects}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="./Fakhri_Dinal_Maulana_Putra_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-7 py-3.5 bg-white/10 text-white hover:bg-white/15 text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                <span>{t.hero.downloadCv}</span>
              </a>
            </div>
          </div>
        </main>

        {/* Social Icons & Scroll Indicator */}
        <footer
          className="relative z-10 flex flex-col items-center gap-4 pb-8 transition-opacity duration-300"
          style={{
            opacity: heroContentOpacity,
            pointerEvents: heroContentOpacity < 0.1 ? 'none' : 'auto',
          }}
        >
          <div className="flex justify-center gap-3">
            <a
              href="https://github.com/Yogiri19"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="liquid-glass rounded-full p-3.5 text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
            >
              <Github size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/fakhri-dinal-maulana-putra-407156404/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="liquid-glass rounded-full p-3.5 text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="mailto:godofwar085793692785@gmail.com"
              aria-label="Email"
              className="liquid-glass rounded-full p-3.5 text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
            >
              <Mail size={18} />
            </a>
            <a
              href="https://yogiri19.github.io/Website-Portofolio/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio Website"
              className="liquid-glass rounded-full p-3.5 text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
            >
              <Globe size={18} />
            </a>
          </div>
          <div className="text-[11px] font-mono tracking-widest text-white/40 uppercase flex items-center gap-2">
            <span>{t.hero.scrollToExplore}</span>
            <ArrowRight size={12} className="rotate-90 animate-bounce" />
          </div>
        </footer>
      </div>

      {/* Main Content Sections (Revealed on Scroll) */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 py-20 space-y-32">
        
        {/* About Section */}
        <section id="about" className="scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* Profile Avatar with Liquid Glass */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative group cursor-pointer">
                <div className="w-60 h-60 md:w-72 md:h-72 aspect-square rounded-full overflow-hidden liquid-glass p-1.5 shadow-2xl relative">
                  <img
                    src="./avatar_square.jpg"
                    alt="Fakhri Dinal Maulana Putra"
                    className="w-full h-full object-cover rounded-full filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 liquid-glass rounded-full px-4 py-1 text-xs font-mono text-white/90 whitespace-nowrap shadow-lg">
                  {t.about.location}
                </div>
              </div>
            </div>

            {/* Profile Bio */}
            <div className="md:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass text-xs font-mono text-white/70 uppercase tracking-widest">
                <span>{t.about.badge}</span>
              </div>
              <h2
                className="text-4xl md:text-5xl text-white tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {t.about.heading}
              </h2>
              <p className="text-white/70 leading-relaxed text-base">
                {t.about.bioP1}
                <strong className="text-white">{t.about.bioP1Highlight1}</strong>
                {t.about.bioP1Middle}
                <strong className="text-white">{t.about.bioP1Highlight2}</strong>
                {t.about.bioP1End}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="liquid-glass rounded-xl p-4">
                  <span className="text-2xl font-semibold text-white font-mono">{t.about.stat1Value}</span>
                  <p className="text-xs text-white/50 mt-1">{t.about.stat1Label}</p>
                </div>
                <div className="liquid-glass rounded-xl p-4">
                  <span className="text-2xl font-semibold text-white font-mono">{t.about.stat2Value}</span>
                  <p className="text-xs text-white/50 mt-1">{t.about.stat2Label}</p>
                </div>
                <div className="liquid-glass rounded-xl p-4 col-span-2 sm:col-span-1">
                  <span className="text-2xl font-semibold text-white font-mono">{t.about.stat3Value}</span>
                  <p className="text-xs text-white/50 mt-1">{t.about.stat3Label}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section id="projects" className="scroll-mt-24 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass text-xs font-mono text-white/70 uppercase tracking-widest mb-3">
                <span>{t.projects.badge}</span>
              </div>
              <h2
                className="text-4xl md:text-5xl text-white tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {t.projects.heading}
              </h2>
            </div>
            <p className="text-white/50 text-sm max-w-md">
              {t.projects.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {t.projects.items.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className="liquid-glass rounded-2xl p-7 flex flex-col justify-between group hover:bg-white/[0.03] transition-all cursor-pointer border border-transparent hover:border-white/10"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-white/50">
                    <span>{project.category}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-medium text-white group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="pt-6 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 text-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-white/5">
                    <CheckCircle2 size={13} />
                    <span>{project.metrics}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Skills Section */}
        <section id="skills" className="scroll-mt-24 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass text-xs font-mono text-white/70 uppercase tracking-widest">
              <span>{t.skills.badge}</span>
            </div>
            <h2
              className="text-4xl md:text-5xl text-white tracking-tight"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {t.skills.heading}
            </h2>
            <p className="text-white/60 text-sm">
              {t.skills.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skillGroups.map((skillGroup, index) => (
              <div key={index} className="liquid-glass rounded-2xl p-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center">
                    {skillGroup.icon}
                  </div>
                  <h3 className="text-lg font-medium text-white">{skillGroup.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs font-mono px-3 py-1.5 rounded-full liquid-glass text-white/80 hover:text-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-24">
          <div className="liquid-glass rounded-3xl p-8 md:p-14 text-center space-y-8 relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass text-xs font-mono text-white/70 uppercase tracking-widest">
                <span>{t.contact.badge}</span>
              </div>
              <h2
                className="text-4xl md:text-6xl text-white tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {t.contact.heading}
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                {t.contact.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${t.contact.email}`}
                className="liquid-glass rounded-full px-6 py-3.5 text-white text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2.5"
              >
                <Mail size={16} />
                <span>{t.contact.email}</span>
              </a>
              <a
                href="https://wa.me/6285793692785"
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass rounded-full px-6 py-3.5 text-white text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2.5"
              >
                <Phone size={16} />
                <span>{t.contact.phone}</span>
              </a>
              <a
                href="https://www.linkedin.com/in/fakhri-dinal-maulana-putra-407156404/"
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass rounded-full px-6 py-3.5 text-white text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2.5"
              >
                <Linkedin size={16} />
                <span>{t.contact.linkedin}</span>
              </a>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-white/40 gap-4">
              <span>{t.contact.copyright}</span>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t.contact.backToOrbit}</span>
                <ArrowRight size={13} className="-rotate-90" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Interactive Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl liquid-glass rounded-3xl p-6 md:p-10 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-white/10">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedProjectId(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                {selectedProject.category}
              </span>
              <h3
                className="text-3xl md:text-4xl text-white font-medium mt-1 mb-2"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {selectedProject.title}
              </h3>
              <p className="text-xs font-mono text-white/60">{selectedProject.role}</p>
            </div>

            <p className="text-white/80 text-sm leading-relaxed">
              {selectedProject.description}
            </p>

            {/* Architecture breakdown */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-semibold text-white uppercase font-mono tracking-wider">
                {t.projects.modal.architecturalHighlights}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedProject.architecture.map((arch, i) => (
                  <div key={i} className="liquid-glass rounded-lg p-3 text-xs font-mono text-white/80 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 flex-shrink-0" />
                    <span>{arch}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Technical Features */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-semibold text-white uppercase font-mono tracking-wider">
                {t.projects.modal.keyAchievements}
              </h4>
              <ul className="space-y-2">
                {selectedProject.features.map((feat, idx) => (
                  <li key={idx} className="text-xs text-white/70 leading-relaxed flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Pills */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">
                {t.projects.modal.technologiesUsed}
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <a
                href={selectedProject.githubUrl || 'https://github.com/Yogiri19'}
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass rounded-full px-5 py-2.5 text-white text-xs font-mono hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Github size={14} />
                <span>{t.projects.modal.viewOnGithub}</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedProjectId(null)}
                className="bg-white text-black rounded-full px-6 py-2 text-xs font-medium hover:bg-white/90 transition-colors cursor-pointer"
              >
                {t.projects.modal.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive AI Chatbot Modal: Ask Yogiri */}
      <AskYogiriModal
        isOpen={isAskYogiriOpen}
        onClose={() => setIsAskYogiriOpen(false)}
        language={language}
      />
    </div>
  );
}
