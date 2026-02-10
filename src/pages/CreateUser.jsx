import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

export default function CreateUser() {
  const roleLogin = localStorage.getItem("role");
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const siswa = users.filter((u) => u.role === "peminjam");
  const petugas = users.filter((u) => u.role === "petugas");

  const [form, setForm] = useState({
    id: null, name: "", email: "", password: "", role: "peminjam",
    full_name: "", kelas: "", jurusan: "", nis: "",
  });

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {
      console.error("Gagal load data");
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const openAdd = () => {
    setForm({ id: null, name: "", email: "", password: "", role: "peminjam", full_name: "", kelas: "", jurusan: "", nis: "" });
    setIsEdit(false);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setForm({
      id: user.id, name: user.name, email: user.email, password: "", role: user.role,
      full_name: user.siswa?.full_name || "", kelas: user.siswa?.kelas || "",
      jurusan: user.siswa?.jurusan || "", nis: user.siswa?.nis || "",
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) { await api.put(`/users/${form.id}`, form); } 
      else { await api.post("/create-user", form); }
      setShowModal(false);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus akun ini?")) return;
    try {
      await api.delete(`/users/${id}`);
      loadUsers();
    } catch {
      alert("Gagal hapus");
    }
  };

  return (
    <DashboardLayout role={roleLogin}>
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full mb-3">
            <i className="fas fa-users-gear text-[10px] text-slate-500"></i>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Access Management</span>
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Otoritas Pengguna</h2>
          <p className="text-slate-400 font-medium mt-2">Atur hak akses akun petugas dan kelola database identitas siswa secara terpusat.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-slate-900 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-3 group"
        >
          <i className="fas fa-user-plus group-hover:rotate-12 transition-transform"></i>
          Tambah User Baru
        </button>
      </div>

      {/* PETUGAS SECTION - Hanya untuk Super Admin */}
      {roleLogin === "admin" && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Tim Manajemen & Petugas</h3>
            </div>
            <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
              {petugas.length} Akun Aktif
            </span>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identitas</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Akses Sistem</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {petugas.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-slate-200 group-hover:bg-blue-600 transition-colors">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-700 uppercase tracking-tight leading-none">{u.name}</p>
                          <p className="text-[11px] text-slate-400 font-bold mt-1.5 tracking-wide">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                         <i className="fas fa-shield-halved text-[8px]"></i> {u.role}
                       </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => openEdit(u)} className="w-10 h-10 flex items-center justify-center bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm">
                           <i className="fas fa-pen-to-square text-xs"></i>
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                           <i className="fas fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SISWA SECTION */}
      <div>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-green-500 rounded-full"></div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Database Siswa / Peminjam</h3>
          </div>
          <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-100">
            {siswa.length} Terdaftar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {siswa.map((u) => (
            <div key={u.id} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all relative overflow-hidden">
              {/* Card Actions Hover */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all flex gap-2 translate-x-4 group-hover:translate-x-0">
                 <button onClick={() => openEdit(u)} className="w-9 h-9 bg-white shadow-xl rounded-xl text-amber-500 hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center border border-slate-50">
                    <i className="fas fa-edit text-[10px]"></i>
                 </button>
                 <button onClick={() => handleDelete(u.id)} className="w-9 h-9 bg-white shadow-xl rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-slate-50">
                    <i className="fas fa-trash text-[10px]"></i>
                 </button>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-3xl mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-inner">
                  {u.siswa?.jurusan?.toLowerCase().includes("rpl") ? (
                    <i className="fas fa-laptop-code"></i>
                  ) : (
                    <i className="fas fa-user-graduate"></i>
                  )}
                </div>
                <h4 className="font-black text-slate-800 text-lg leading-tight uppercase tracking-tight text-center px-4">
                  {u.siswa?.full_name || u.name}
                </h4>
                
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                    {u.siswa?.kelas || "N/A"}
                  </span>
                  <span className="text-[9px] font-black bg-green-50 text-green-600 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-green-100">
                    {u.siswa?.jurusan || "Umum"}
                  </span>
                </div>

                <div className="w-full mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Email Address</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">{u.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">NIS</p>
                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">{u.siswa?.nis || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL SYSTEM */}
{showModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setShowModal(false)}></div>
    
    <div className="relative bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
      {/* Header Tipis & Modern */}
      <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[9px] font-black text-green-500 uppercase tracking-[0.3em] mb-1">Account Management</p>
          <h3 className="text-xl font-black tracking-tight">{isEdit ? "Update User Detail" : "Registrasi User Baru"}</h3>
        </div>
        <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-2xl transition-all relative z-10">
          <i className="fas fa-times"></i>
        </button>
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          
          {/* KOLOM KIRI: Akses Akun */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-key text-slate-400 text-xs"></i>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kredensial Akses</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Username</label>
                <input placeholder="Ex: johndoe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-slate-900 outline-none transition-all" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Password</label>
                <input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-slate-900 outline-none transition-all" required={!isEdit} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Email Sekolah</label>
              <input type="email" placeholder="user@sekolah.sch.id" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-slate-900 outline-none transition-all" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Tipe Akun (Role)</label>
              <select value={form.role} disabled={isEdit} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-slate-900 outline-none cursor-pointer">
                <option value="peminjam">Siswa (Peminjam)</option>
                <option value="petugas">Petugas (Inventory)</option>
              </select>
            </div>
          </div>

          {/* KOLOM KANAN: Data Identitas (Muncul jika Siswa) */}
          <div className={`space-y-5 transition-all ${form.role !== "peminjam" ? "opacity-30 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-id-card text-green-600 text-xs"></i>
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Informasi Identitas</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
              <input placeholder="Nama Sesuai Ijazah" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full bg-green-50/30 border border-green-100/50 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-green-500 outline-none" required={form.role === "peminjam"} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Kelas</label>
                <input placeholder="Ex: XII" value={form.kelas} onChange={(e) => setForm({ ...form, kelas: e.target.value })} className="w-full bg-green-50/30 border border-green-100/50 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-green-500 outline-none" required={form.role === "peminjam"} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Jurusan</label>
                <input placeholder="Ex: RPL" value={form.jurusan} onChange={(e) => setForm({ ...form, jurusan: e.target.value })} className="w-full bg-green-50/30 border border-green-100/50 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-green-500 outline-none" required={form.role === "peminjam"} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">NIS</label>
                <span className="text-[9px] font-bold text-slate-400 italic font-sans">Opsional</span>
              </div>
              <input placeholder="Nomor Induk Siswa" value={form.nis} onChange={(e) => setForm({ ...form, nis: e.target.value })} className="w-full bg-green-50/30 border border-green-100/50 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-10 pt-6 border-t border-slate-50 flex gap-4 justify-end items-center">
          <button type="button" onClick={() => setShowModal(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors px-4">Batal</button>
          <button type="submit" className="bg-green-600 text-white px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-100 hover:bg-green-700 active:scale-95 transition-all">
            {isEdit ? "Update Akun" : "Simpan User"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </DashboardLayout>
  );
}