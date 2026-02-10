import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function AdminProfil() {
  const role = localStorage.getItem("role"); // Memastikan role adalah 'admin'
  const [isEditing, setIsEditing] = useState(false);
  
  // Ambil data dari localStorage atau state
  const adminData = {
    name: localStorage.getItem("name") || "Administrator Lab",
    email: localStorage.getItem("email") || "admin@sekolah.sch.id",
    nip: "19880122 201503 1 002", // Contoh NIP
    roleName: "Super Admin",
    lastLogin: "09 Feb 2026, 14:30 WIB"
  };

  return (
    <DashboardLayout role={role}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* TOP HEADER: ADMIN BRANDING */}
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            {/* Avatar Admin */}
            <div className="relative group">
              <div className="w-40 h-40 bg-white/10 backdrop-blur-md rounded-[3rem] border-2 border-white/20 flex items-center justify-center text-6xl font-black shadow-inner">
                {adminData.name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center border-4 border-slate-900 shadow-xl">
                <i className="fas fa-shield-halved text-white"></i>
              </div>
            </div>

            {/* Title Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full mb-4 border border-green-500/30">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{adminData.roleName}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 italic">
                {adminData.name}
              </h2>
              <p className="text-slate-400 font-medium max-w-md">
                Bertanggung jawab penuh atas manajemen aset laboratorium dan validasi peminjaman siswa.
              </p>
            </div>

            {/* Action */}
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all active:scale-95 shadow-xl"
            >
              {isEditing ? "Simpan Perubahan" : "Edit Profil"}
            </button>
          </div>

          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <i className="fas fa-microchip absolute bottom-[-20px] right-10 text-9xl text-white/5 -rotate-12"></i>
        </div>

        {/* DETAIL INFO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: FORM DATA UTAMA */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Personal Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    defaultValue={adminData.name}
                    disabled={!isEditing}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-slate-900 font-bold text-slate-800 outline-none disabled:opacity-60 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Administrator</label>
                  <input 
                    type="email" 
                    defaultValue={adminData.email}
                    disabled={!isEditing}
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-slate-900 font-bold text-slate-800 outline-none disabled:opacity-60 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">NIP / ID Pegawai</label>
                  <div className="w-full bg-slate-100 border-none rounded-2xl px-6 py-4 font-bold text-slate-500 cursor-not-allowed">
                    {adminData.nip}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Status Keaktifan</label>
                  <div className="w-full bg-green-50 border-none rounded-2xl px-6 py-4 font-black text-[10px] text-green-600 uppercase tracking-widest flex items-center gap-2">
                    <i className="fas fa-check-circle"></i> Terverifikasi Sistem
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: SYSTEM STATUS */}
          <div className="space-y-6">
            {/* Card Keamanan */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Keamanan</h4>
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all">
                Ganti Password
              </button>
              <div className="mt-6 flex items-center justify-between px-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">2FA Auth</span>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Aktif</span>
              </div>
            </div>

            {/* Card Log Info */}
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-gray-100">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Aktivitas Terakhir</h4>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 shrink-0">
                  <i className="fas fa-clock-rotate-left text-sm"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 leading-tight">Berhasil Login</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">{adminData.lastLogin}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}