import { useState, useEffect } from "react";
import PeminjamLayout from "../components/PeminjamLayout";

export default function PeminjamProfil() {
  // Mengambil data dari localStorage (sesuaikan dengan key di aplikasi kamu)
  const [user, setUser] = useState({
    name: localStorage.getItem("name") || "Nama Siswa",
    email: localStorage.getItem("email") || "siswa@sekolah.sch.id",
    nis: localStorage.getItem("nis") || "12345678",
    class: localStorage.getItem("class") || "XII Rekayasa Perangkat Lunak 1",
    avatar: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <PeminjamLayout>
      <div className="max-w-5xl mx-auto">
        {/* HEADER PROFIL */}
        <div className="relative mb-8">
          <div className="h-48 md:h-64 bg-gradient-to-r from-slate-900 via-slate-800 to-green-900 rounded-[3rem] shadow-2xl overflow-hidden">
            {/* Dekorasi Abstract */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          </div>
          
          <div className="px-8 md:px-12 -mt-20 flex flex-col md:flex-row items-end gap-6 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white p-2 rounded-[2.5rem] shadow-xl">
                <div className="w-full h-full bg-green-100 rounded-[2rem] flex items-center justify-center text-green-600 text-4xl font-black border-4 border-green-50">
                  {user.name.charAt(0)}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center border-4 border-white hover:bg-green-600 transition-all">
                <i className="fas fa-camera text-xs"></i>
              </button>
            </div>
            
            <div className="flex-1 pb-4">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">{user.name}</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                NIS: {user.nis} • {user.class}
              </p>
            </div>

            <div className="pb-4 hidden md:block">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                {isEditing ? "Simpan Perubahan" : "Edit Profil"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SISI KIRI: INFO DETAIL */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-3">
                <i className="fas fa-user-gear text-green-600"></i>
                Informasi Akun
              </h4>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      defaultValue={user.name} 
                      disabled={!isEditing}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-green-500 font-bold text-slate-700 outline-none disabled:opacity-60 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Email</label>
                    <input 
                      type="email" 
                      defaultValue={user.email} 
                      disabled={!isEditing}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-green-500 font-bold text-slate-700 outline-none disabled:opacity-60 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Kelas</label>
                    <input 
                      type="text" 
                      defaultValue={user.class} 
                      disabled={!isEditing}
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-green-500 font-bold text-slate-700 outline-none disabled:opacity-60 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Role</label>
                    <div className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-xs text-green-600 uppercase tracking-widest">
                      Peminjam (Siswa)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* KEAMANAN */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Keamanan Akun</h4>
              <button className="w-full md:w-auto px-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-3">
                <i className="fas fa-lock text-slate-400"></i>
                Ganti Kata Sandi
              </button>
            </div>
          </div>

          {/* SISI KANAN: STATISTIK & AKTIVITAS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-400 mb-6">Ringkasan Aktivitas</h4>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Pinjam</span>
                    <span className="text-2xl font-black">24</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Tepat Waktu</span>
                    <span className="text-2xl font-black text-green-400">22</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Terlambat</span>
                    <span className="text-2xl font-black text-red-400">2</span>
                  </div>
                </div>
              </div>
              {/* Dekorasi */}
              <i className="fas fa-chart-line absolute bottom-[-10px] right-5 text-8xl text-white/5 rotate-12"></i>
            </div>

            <div className="bg-green-50 rounded-[2.5rem] p-8 border border-green-100">
              <h4 className="text-xs font-black text-green-800 uppercase tracking-widest mb-4">Status Skor</h4>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm">
                  <i className="fas fa-shield-heart text-2xl"></i>
                </div>
                <div>
                  <p className="text-lg font-black text-slate-800 tracking-tight">Peminjam Teladan</p>
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Skor: 98/100</p>
                </div>
              </div>
              <p className="mt-4 text-[10px] text-green-700/70 leading-relaxed font-medium">
                Pertahankan skormu dengan mengembalikan alat tepat waktu untuk mendapatkan prioritas peminjaman.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PeminjamLayout>
  );
}