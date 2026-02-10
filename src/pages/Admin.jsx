import DashboardLayout from "../components/DashboardLayout";

export default function Admin() {
  const role = localStorage.getItem("role");

  // Data statistik dengan Icon Font Awesome
  const stats = [
    { label: "Total Pengguna", value: "1,254", icon: "fa-users", color: "text-blue-600", bg: "bg-blue-50", shadow: "shadow-blue-100" },
    { label: "Alat Tersedia", value: "432", icon: "fa-toolbox", color: "text-green-600", bg: "bg-green-50", shadow: "shadow-green-100" },
    { label: "Peminjaman Aktif", value: "89", icon: "fa-sync", color: "text-orange-600", bg: "bg-orange-50", shadow: "shadow-orange-100" },
    { label: "Laporan Masuk", value: "12", icon: "fa-envelope-open-text", color: "text-purple-600", bg: "bg-purple-50", shadow: "shadow-purple-100" },
  ];

  return (
    <DashboardLayout role={role}>
      <div className="space-y-10">
        
        {/* --- HERO SECTION: MODERN GRADIENT --- */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 text-white shadow-2xl shadow-slate-200">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full mb-4 border border-green-500/30">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-green-400">System Live</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Selamat Datang, <span className="text-green-500 italic">Admin</span>.
              </h2>
              <p className="mt-4 text-slate-400 text-sm font-medium max-w-sm leading-relaxed">
                Semua sistem berjalan normal. Anda memiliki <span className="text-white font-bold">12 laporan baru</span> yang memerlukan tindakan hari ini.
              </p>
              <button className="mt-8 bg-green-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-500 transition-all active:scale-95 shadow-lg shadow-green-900/20 flex items-center gap-3">
                <i className="fas fa-file-waveform"></i>
                Lihat Laporan
              </button>
            </div>

            {/* Ilustrasi Dashboard Ringkas */}
            <div className="hidden lg:block">
               <div className="w-64 h-40 bg-white/5 rounded-[2rem] border border-white/10 p-6 backdrop-blur-sm relative">
                  <div className="flex justify-between items-end h-full gap-2">
                    <div className="w-1/4 bg-green-500 h-[60%] rounded-lg animate-in slide-in-from-bottom duration-500"></div>
                    <div className="w-1/4 bg-green-500 h-[100%] rounded-lg animate-in slide-in-from-bottom duration-700"></div>
                    <div className="w-1/4 bg-green-500 h-[40%] rounded-lg animate-in slide-in-from-bottom duration-1000"></div>
                    <div className="w-1/4 bg-green-500 h-[80%] rounded-lg animate-in slide-in-from-bottom duration-300"></div>
                  </div>
                  <i className="fas fa-chart-line absolute -top-4 -right-4 text-5xl text-green-500/20"></i>
               </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        </div>

        {/* --- STATS GRID: CLEAN & BOLD --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="group p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-green-200 hover:shadow-xl hover:shadow-green-50/50 transition-all duration-300">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-800 mt-2 tracking-tighter">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Activity: List Design */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="font-black text-slate-800 text-xl tracking-tight">Aktivitas Terkini</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Log sistem otomatis terbaru</p>
              </div>
              <button className="px-5 py-2.5 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors">
                Log Lengkap
              </button>
            </div>
            
            <div className="space-y-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                    <i className="fas fa-user-clock text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-800 tracking-tight">User Baru Terdaftar</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">2 Menit yang lalu • <span className="text-slate-300">ID: #8921</span></p>
                  </div>
                  <div className="text-right">
                     <span className="text-[9px] bg-green-50 text-green-600 px-3 py-1.5 rounded-lg font-black tracking-widest uppercase border border-green-100">Success</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Info: Sidebar-like Design */}
          <div className="space-y-6">
            <div className="bg-green-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <i className="fas fa-lightbulb absolute -top-4 -right-4 text-7xl text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-500"></i>
              <h3 className="font-black text-white text-lg mb-4 flex items-center gap-3">
                <i className="fas fa-bolt text-green-300"></i>
                Tips Admin
              </h3>
              <p className="text-sm text-green-50 leading-relaxed font-medium">
                Pastikan untuk memeriksa log aktivitas setiap akhir pekan untuk menjaga keamanan data alat dan pengguna.
              </p>
              <div className="mt-6 pt-6 border-t border-white/10 text-[10px] font-bold text-green-200 italic">
                "Keamanan adalah prioritas utama Pinjamin."
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Server Capacity</h4>
               <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-black tracking-tighter">94%</span>
                  <span className="text-[10px] font-bold text-green-500 uppercase">Optimal</span>
               </div>
               <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[94%] shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}