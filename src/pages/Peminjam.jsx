import PeminjamLayout from "../components/PeminjamLayout";
import { Link } from "react-router-dom";

export default function Peminjam() {
  const name = localStorage.getItem("name") || "Siswa";

  // Data dummy untuk tampilan (nanti bisa diganti dengan fetching API)
  const stats = [
    { label: "Sedang Dipinjam", value: "2", icon: "fa-box-open", color: "bg-blue-500" },
    { label: "Perlu Kembali", value: "1", icon: "fa-clock", color: "bg-amber-500" },
    { label: "Total Denda", value: "Rp 0", icon: "fa-wallet", color: "bg-red-500" },
  ];

  return (
    <PeminjamLayout>
      {/* WELCOME SECTION */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-8 md:p-12 mb-10 text-white shadow-2xl shadow-slate-200">
        <div className="relative z-10">
          <h3 className="text-green-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
            Student Portal
          </h3>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
            Selamat Datang, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              {name}!
            </span>
          </h2>
          <p className="text-slate-400 max-w-md font-medium text-sm leading-relaxed">
            Semua urusan peminjaman alat praktikum jadi lebih mudah dan terpantau dalam satu dashboard.
          </p>
          
          <div className="mt-8 flex gap-3">
            <Link to="/katalog" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95">
              Cari Alat Sekarang
            </Link>
          </div>
        </div>

        {/* Dekorasi Aksen */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <i className="fas fa-microscope absolute bottom-[-20px] right-10 text-9xl text-white/5 -rotate-12"></i>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-gray-100 group-hover:scale-110 transition-transform`}>
              <i className={`fas ${item.icon}`}></i>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
            <p className="text-2xl font-black text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY / SHORTCUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Box 1: Info Terkini */}
        <div className="bg-green-50 rounded-[2.5rem] p-8 border border-green-100">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-slate-800 uppercase tracking-tight">Info Pengembalian</h4>
            <i className="fas fa-bell text-green-600 animate-bounce"></i>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-green-200/50 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
              <i className="fas fa-info-circle"></i>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Jangan Lupa!</p>
              <p className="text-xs text-slate-500 font-medium">Mikroskop Binokuler harus dikembalikan sebelum jam 15:00 hari ini.</p>
            </div>
          </div>
        </div>

        {/* Box 2: Quick Links */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <h4 className="font-black text-slate-800 uppercase tracking-tight mb-6">Bantuan Cepat</h4>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-2xl bg-gray-50 hover:bg-slate-900 hover:text-white transition-all text-left group">
              <i className="fas fa-book-open mb-3 block text-green-600 group-hover:text-green-400"></i>
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">Panduan</p>
              <p className="text-[9px] font-medium opacity-60">Cara meminjam alat</p>
            </button>
            <button className="p-4 rounded-2xl bg-gray-50 hover:bg-slate-900 hover:text-white transition-all text-left group">
              <i className="fas fa-headset mb-3 block text-green-600 group-hover:text-green-400"></i>
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">Bantuan</p>
              <p className="text-[9px] font-medium opacity-60">Hubungi petugas lab</p>
            </button>
          </div>
        </div>
      </div>
    </PeminjamLayout>
  );
}