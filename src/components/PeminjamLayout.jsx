import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function PeminjamLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (confirm("Yakin ingin keluar dari akun?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const menuItems = [
    { name: "Beranda", path: "/peminjam", icon: "fa-house" },
    { name: "Katalog", path: "/katalog", icon: "fa-magnifying-glass" },
    { name: "Pinjaman", path: "/status-pinjaman", icon: "fa-receipt" },
    { name: "Profil", path: "/profil-peminjam", icon: "fa-user" }, // Tambahan menu profil
  ];

  return (
    <div className="min-h-screen bg-[#FDFEFF] pb-24 lg:pb-0">
      {/* --- TOP NAVBAR --- */}
      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
              <i className="fas fa-leaf text-white"></i>
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter">
              Pinjamin<span className="text-green-600">.</span>
            </h1>
          </div>

          {/* User Profile Dropdown (Desktop) */}
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 bg-gray-50 p-1 pr-4 rounded-full border border-gray-100 hover:bg-gray-100 transition-all"
            >
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {localStorage.getItem("name")?.charAt(0) || "S"}
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-600 hidden md:block">
                {localStorage.getItem("name")?.split(' ')[0] || "Siswa"}
              </span>
              <i className={`fas fa-chevron-down text-[10px] text-slate-400 transition-transform ${showProfile ? 'rotate-180' : ''}`}></i>
            </button>

            {showProfile && (
              <>
                {/* Overlay untuk nutup dropdown saat klik di luar */}
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowProfile(false)}></div>
                <div className="absolute right-0 mt-4 w-56 bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-3 animate-in fade-in zoom-in duration-200">
                  <Link 
                    to="/profil-peminjam" 
                    onClick={() => setShowProfile(false)}
                    className="w-full text-left px-5 py-4 text-slate-600 hover:bg-slate-50 rounded-[1.5rem] flex items-center gap-4 transition-all group"
                  >
                    <i className="fas fa-id-card text-slate-400 group-hover:text-green-600"></i>
                    <span className="text-xs font-bold uppercase tracking-widest">Profil Saya</span>
                  </Link>
                  <hr className="my-2 border-gray-50" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-4 text-red-500 hover:bg-red-50 rounded-[1.5rem] flex items-center gap-4 transition-all group"
                  >
                    <i className="fas fa-power-off text-sm opacity-70 group-hover:scale-110 transition-transform"></i>
                    <span className="text-xs font-bold uppercase tracking-widest">Keluar Akun</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- SIDEBAR (Desktop Only) --- */}
      <aside className="fixed left-0 top-20 bottom-0 w-24 bg-white border-r border-gray-50 hidden lg:flex flex-col items-center py-10 gap-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`group relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${
              isActive(item.path)
                ? "bg-green-600 text-white shadow-lg shadow-green-100 scale-110"
                : "bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600"
            }`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="absolute left-16 bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              {item.name}
            </span>
          </Link>
        ))}
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="lg:ml-24">
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          {/* Header Konten Dinamis */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              {isActive("/peminjam") && "Halo, Mau Pinjam Apa?"}
              {isActive("/katalog") && "Katalog Alat"}
              {isActive("/status-pinjaman") && "Pinjaman Kamu"}
              {isActive("/profil-peminjam") && "Profil Akun"}
              {location.pathname.includes("/pinjam/") && "Konfirmasi Pinjaman"}
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">
              {isActive("/peminjam") && "Temukan kebutuhan praktekmu di sini."}
              {isActive("/katalog") && "Pilih alat yang tersedia untuk dipesan."}
              {isActive("/status-pinjaman") && "Pantau batas waktu dan status pengembalian."}
              {isActive("/profil-peminjam") && "Kelola informasi data dirimu."}
              {location.pathname.includes("/pinjam/") && "Lengkapi formulir untuk mengajukan alat."}
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>

      {/* --- BOTTOM NAVBAR (Mobile Only) --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-gray-100 px-4 py-4 flex justify-around items-center lg:hidden z-50">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1.5 transition-all ${
              isActive(item.path) ? "text-green-600" : "text-gray-300"
            }`}
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isActive(item.path) ? 'bg-green-50' : ''}`}>
              <i className={`fas ${item.icon} text-lg`}></i>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}