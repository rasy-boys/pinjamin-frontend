import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function DashboardLayout({ children, role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (confirm("Yakin ingin keluar dari akun?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const NavLink = ({ to, icon, children }) => (
    <Link
      to={to}
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative ${
        isActive(to)
          ? "bg-green-600 text-white shadow-lg shadow-green-100"
          : "text-gray-500 hover:bg-green-50 hover:text-green-600"
      }`}
    >
      <i className={`fas ${icon} text-lg ${isCollapsed ? "mx-auto" : ""} ${isActive(to) ? "scale-110" : "group-hover:scale-110 transition-transform"}`}></i>
      {!isCollapsed && <span className="font-bold text-sm tracking-wide whitespace-nowrap">{children}</span>}
      {isCollapsed && (
        <span className="absolute left-16 scale-0 group-hover:scale-100 transition-all bg-gray-800 text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest z-50">
          {children}
        </span>
      )}
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-[#FBFCFE]">
      {/* Overlay Mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setIsMobileOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[70] bg-white border-r border-gray-100 flex flex-col transition-all duration-500 
        ${isCollapsed ? "w-20" : "w-72"} 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "px-6"} h-24 mb-4`}>
          <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200 shrink-0">
            <i className="fas fa-leaf text-white text-lg"></i>
          </div>
          {!isCollapsed && (
            <h2 className="ml-3 text-xl font-black tracking-tighter text-gray-800">
              Pinjamin<span className="text-green-600">.</span>
            </h2>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4 px-4 ${isCollapsed ? "text-center" : ""}`}>
            {isCollapsed ? "•••" : "Menu Utama"}
          </p>
          
          {role === "admin" && <NavLink to="/admin" icon="fa-chart-pie">Dashboard</NavLink>}
          {role === "petugas" && <NavLink to="/petugas" icon="fa-laptop-code">Dashboard</NavLink>}
          {role === "peminjam" && <NavLink to="/peminjam" icon="fa-cubes">Dashboard</NavLink>}

          <div className="pt-6 mt-6 border-t border-gray-50 space-y-2">
             {!isCollapsed && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4 px-4">Manajemen</p>}
             {role !== "peminjam" && <NavLink to="/create-user" icon="fa-user-plus">Buat Akun</NavLink>}
             {role === "admin" && (
               <>
                 <NavLink to="/categories" icon="fa-folder-tree">Kategori</NavLink>
                 <NavLink to="/tools" icon="fa-toolbox">Data Alat</NavLink>
                 <NavLink to="/logs" icon="fa-history">Log Aktivitas</NavLink>
               </>
             )}
             {role === "petugas" && (
               <>
                 <NavLink to="/manage-peminjaman" icon="fa-tasks">Kelola Pinjaman</NavLink>
                 <NavLink to="/manage-return" icon="fa-retweet">Pengembalian</NavLink>
                 <NavLink to="/petugas-laporan" icon="fa-file-invoice">Laporan</NavLink>
                 <NavLink to="/fine-setting" icon="fa-money-bill-wave">Setting Denda</NavLink>
               </>
             )}
          </div>
        </nav>

        <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex items-center justify-center h-12 w-12 mx-auto mb-6 bg-gray-50 text-gray-400 rounded-xl hover:text-green-600 transition-colors">
          <i className={`fas ${isCollapsed ? "fa-indent" : "fa-outdent"}`}></i>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ${isCollapsed ? "lg:ml-20" : "lg:ml-72"}`}>
        
        {/* Header */}
        <header className="sticky top-0 z-50 flex justify-between items-center bg-white/70 backdrop-blur-xl px-4 lg:px-8 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 text-gray-500">
              <i className="fas fa-bars-staggered text-xl"></i>
            </button>
            <div className="hidden sm:block">
              <h1 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{role} System</h1>
              <p className="text-lg font-black text-gray-800 mt-1">Portal Peminjaman</p>
            </div>
          </div>

          {/* DROPDOWN PROFILE */}
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 bg-gray-50 p-1.5 pr-4 rounded-full border border-gray-100 hover:bg-white hover:shadow-md transition-all"
            >
              {/* Avatar Bulat */}
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                {localStorage.getItem("name")?.charAt(0) || "A"}
              </div>

              {/* Text Container: Name di atas, Role di bawah */}
              <div className="hidden md:flex flex-col text-left justify-center leading-none">
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
                  {localStorage.getItem("name") || "Guest"}
                </p>
                <p className="text-[9px] font-bold text-green-600 uppercase tracking-wide mt-1">
                  {role}
                </p>
              </div>

              <i className={`fas fa-chevron-down text-[10px] text-gray-400 transition-transform ${showProfile ? 'rotate-180' : ''}`}></i>
            </button>

            {/* Dropdown Menu */}
            {showProfile && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)}></div>
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-20 animate-in fade-in zoom-in duration-200">
                  <Link 
                    to="/profil-admin" 
                    onClick={() => setShowProfile(false)}
                    className="w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-all"
                  >
                    <i className="fas fa-user-circle text-gray-400 text-lg"></i>
                    <span className="text-xs font-bold uppercase tracking-widest">Profil Saya</span>
                  </Link>
                  
                  <hr className="my-1 border-gray-50" />
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-all"
                  >
                    <i className="fas fa-power-off text-sm"></i>
                    <span className="text-xs font-bold uppercase tracking-widest">Keluar Akun</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="p-4 lg:p-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 min-h-[calc(100vh-140px)] p-6 lg:p-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}