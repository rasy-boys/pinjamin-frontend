import React, { useState, useEffect } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  // Efek bayangan pada navbar saat scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-sans text-slate-900 bg-[#F8FAFC] selection:bg-green-100 selection:text-green-700">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm py-4" : "bg-transparent py-6"
      }`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
              <i className="fas fa-leaf text-white text-sm"></i>
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-800">
              Pinjamin<span className="text-green-600">.</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-600">
            <a href="#fitur" className="hover:text-green-600 transition-colors">Fitur</a>
            <a href="#tentang" className="hover:text-green-600 transition-colors">Tentang</a>
            <a href="/login" className="px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200">
              Masuk Panel
            </a>
          </div>
        </div>
      </nav>

      {/* --- SECTION 1: HERO --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm mb-8 animate-bounce">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Sistem Inventaris Lab Modern</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter">
            Pinjam Alat Lab <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400">
              Tanpa Ribet.
            </span>
          </h1>
          
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Platform manajemen peminjaman alat laboratorium sekolah yang serba otomatis, digital, dan transparan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="w-full sm:w-auto px-10 py-5 bg-green-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-green-200 hover:bg-green-700 hover:-translate-y-1 transition-all active:scale-95">
              Coba Sekarang
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 border border-slate-100 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
              <i className="fas fa-play text-[10px] text-green-600"></i> Lihat Video
            </button>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: FEATURES --- */}
      <section id="fitur" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">Solusi Cerdas Untuk Lab Sekolah.</h2>
              <p className="text-slate-400 font-medium text-lg">Kami memangkas birokrasi manual yang membosankan dan menggantinya dengan sistem sekali klik.</p>
            </div>
            <div className="text-green-600 font-black text-sm uppercase tracking-widest border-b-4 border-green-100 pb-2">
              Fitur Unggulan
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Smart Booking', desc: 'Siswa dapat memesan alat jauh-jauh hari melalui katalog digital yang informatif.', icon: 'fa-calendar-check', color: 'bg-blue-50 text-blue-600' },
              { title: 'Auto Fine Control', desc: 'Denda keterlambatan dihitung otomatis oleh sistem, jujur dan transparan.', icon: 'fa-vault', color: 'bg-red-50 text-red-600' },
              { title: 'Real-time Tracking', desc: 'Petugas bisa melacak siapa yang membawa alat dan kapan harus kembali.', icon: 'fa-location-dot', color: 'bg-green-50 text-green-600' }
            ].map((item, i) => (
              <div key={i} className="group p-12 rounded-[3.5rem] bg-[#F8FAFC] border border-transparent hover:border-green-100 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/40 transition-all duration-500">
                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-2xl mb-10 group-hover:rotate-6 transition-transform`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-4">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 3: CTA --- */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="relative bg-slate-900 rounded-[4rem] p-12 md:p-24 overflow-hidden shadow-2xl shadow-slate-300">
            {/* Dekorasi Aksen */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div className="relative z-10 grid lg:grid-cols-2 items-center gap-12">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Siap Digitalisasi Lab Kamu?</h2>
                <p className="text-slate-400 text-lg font-medium mb-10">Daftarkan sekolahmu sekarang dan rasakan kemudahan manajemen alat tanpa kertas.</p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] text-white font-bold italic">User</div>)}
                  </div>
                  <p className="text-slate-500 text-sm font-bold self-center">+500 Siswa telah bergabung</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <input type="email" placeholder="Email Sekolah" className="w-full px-6 py-4 rounded-2xl bg-slate-800 border-none text-white focus:ring-2 focus:ring-green-500 outline-none placeholder:text-slate-500 font-medium" />
                  <button className="w-full py-5 bg-green-500 text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-green-400 transition-all active:scale-95 shadow-lg shadow-green-500/20">
                    Gabung Sekarang
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="pt-20 pb-10 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
                  <i className="fas fa-leaf text-xs"></i>
                </div>
                <span className="text-xl font-black tracking-tighter">Pinjamin.</span>
              </div>
              <p className="text-slate-400 max-w-sm font-medium leading-relaxed">
                Membangun ekosistem laboratorium yang lebih cerdas dan teratur untuk generasi masa depan.
              </p>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-800 mb-6">Navigasi</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><a href="#" className="hover:text-green-600 transition-colors">Beranda</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Katalog</a></li>
                <li><a href="#" className="hover:text-green-600 transition-colors">Kontak Kami</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-800 mb-6">Sosial Media</h4>
              <div className="flex gap-4">
                {['fa-instagram', 'fa-github', 'fa-linkedin-in'].map(icon => (
                  <a key={icon} href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-all shadow-sm">
                    <i className={`fab ${icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              © 2026 Pinjamin System. All rights reserved.
            </p>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <a href="#" className="hover:text-slate-800">Privacy Policy</a>
              <a href="#" className="hover:text-slate-800">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}