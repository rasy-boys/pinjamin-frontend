import React, { useState, useEffect } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    darkMode ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-sans text-slate-900 dark:text-slate-100 bg-white dark:bg-[#020617] transition-colors duration-700 overflow-x-hidden">
      
      {/* --- NAVBAR: Responsive Floating --- */}
      <nav className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-500 rounded-2xl md:rounded-3xl border ${
        scrolled 
          ? "bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-slate-200/50 dark:border-slate-800/50 shadow-xl py-3" 
          : "bg-transparent border-transparent py-5"
      }`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-green-500 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>
            <span className="text-lg md:text-xl font-bold tracking-tight dark:text-white">Pinjamin.</span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-8">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-green-500 transition-all"
            >
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>

            <a href="/login" className="px-4 py-2 md:px-6 md:py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[10px] md:text-xs font-bold rounded-xl shadow-lg transition-transform active:scale-95">
              Login <span className="hidden md:inline">Panel</span>
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO: Adaptive Typography --- */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center pt-24 md:pt-0 px-4 overflow-hidden">
        {/* Gradients stay subtle */}
        <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-green-400/10 rounded-full blur-[80px] md:blur-[120px]"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-md mb-6 md:mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
            <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Inventory v2.0</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-[8rem] font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1] md:leading-none mb-6">
            Digitize Your <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent italic">Laboratory.</span>
          </h1>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-xl max-w-[280px] sm:max-w-xl mx-auto mb-10 md:mb-12 font-medium leading-relaxed">
            Satu platform untuk manajemen alat praktikum. Presisi, fleksibel, dan terintegrasi otomatis.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-green-500 text-white rounded-2xl font-bold text-xs md:text-sm shadow-xl shadow-green-500/20 active:scale-95 transition-all">
              Mulai Sekarang
            </button>
            <button className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-xs md:text-sm active:scale-95 transition-all">
              Lihat Demo
            </button>
          </div>
        </div>
      </section>

      {/* --- BENTO GRID: Mobile Stack to Desktop Grid --- */}
      <section id="fitur" className="py-20 md:py-32 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            
            {/* Card 1: Main Feature */}
            <div className="md:col-span-8 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 overflow-hidden">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-6">
                <i className="fas fa-bolt text-lg"></i>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold dark:text-white mb-4 tracking-tight">Real-time <br />Availability.</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-xs">Cek ketersediaan alat dalam hitungan detik. Tanpa double booking.</p>
            </div>

            {/* Card 2: Image Card (Hidden on very small devices or simplified) */}
            <div className="md:col-span-4 h-64 md:h-auto bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden flex flex-col justify-end p-8 text-white">
              <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="lab" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-1">High-End Security</h3>
                <p className="text-slate-400 text-[10px] md:text-xs">Data terenkripsi aman.</p>
              </div>
            </div>

            {/* Card 3: Action Card */}
            <div className="md:col-span-12 bg-linear-to-r from-emerald-500 to-green-600 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h3 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter">Ready to digitize?</h3>
                    <p className="text-green-100 text-sm md:text-lg opacity-80 mb-6 md:mb-0">Modernkan laboratorium sekolahmu dalam satu klik.</p>
                </div>
                <button className="w-full md:w-auto px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-xs md:text-sm shadow-xl transition-all active:scale-95">
                   Ajukan Demo Gratis
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER: Responsive Stack --- */}
      <footer className="py-12 md:py-20 border-t border-slate-100 dark:border-slate-900 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-center md:text-left">
          <span className="text-slate-400 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em]">© 2026 PINJAMIN SYSTEM</span>
          <div className="flex gap-6 md:gap-8 text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-green-500">Privacy</a>
            <a href="#" className="hover:text-green-500">Terms</a>
            <a href="#" className="hover:text-green-500">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}