import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

export default function Tool() {
  const role = localStorage.getItem("role");
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null, name: "", stock: "", description: "", category_id: "", image: null,
  });

  const loadData = async () => {
    try {
      const t = await api.get("/tools");
      const c = await api.get("/categories");
      setTools(t.data);
      setCategories(c.data);
    } catch (err) {
      console.error("Gagal load data");
    }
  };

  useEffect(() => { loadData(); }, []);

  const openAdd = () => {
    setForm({ id: null, name: "", stock: "", description: "", category_id: "", image: null });
    setIsEdit(false);
    setShowModal(true);
  };

  const openEdit = (tool) => {
    setForm({
      id: tool.id, name: tool.name, stock: tool.stock,
      description: tool.description, category_id: tool.category_id, image: null,
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => {
        if (form[k] !== null) fd.append(k, form[k]);
      });

      if (isEdit) {
        await api.post(`/tools/${form.id}?_method=PUT`, fd);
      } else {
        await api.post("/tools", fd);
      }
      setShowModal(false);
      loadData();
    } catch {
      alert("Gagal menyimpan data 😢");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus alat ini?")) return;
    try {
      await api.delete(`/tools/${id}`);
      loadData();
    } catch {
      alert("Gagal menghapus data");
    }
  };

  return (
    <DashboardLayout role={role}>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full mb-3">
            <i className="fas fa-boxes-stacked text-[10px] text-slate-500"></i>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inventory Assets</span>
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Katalog Alat</h2>
          <p className="text-slate-400 font-medium mt-2">Kelola aset fisik, pantau ketersediaan stok, dan perbarui data inventaris.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-slate-900 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-3 group w-fit"
        >
          <i className="fas fa-plus group-hover:rotate-90 transition-transform"></i>
          Daftarkan Alat Baru
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Info Barang</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Klasifikasi</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Unit Tersedia</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tools.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <i className="fas fa-box-open text-5xl mb-4"></i>
                      <p className="font-black uppercase tracking-widest text-xs">Gudang Kosong</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tools.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[1.25rem] overflow-hidden bg-slate-100 shrink-0 border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                          {t.image ? (
                            <img src={`http://localhost:8000/storage/${t.image}`} className="w-full h-full object-cover" alt={t.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                               <i className="fas fa-image text-xl"></i>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-700 uppercase tracking-tight leading-none mb-1.5">{t.name}</p>
                          <p className="text-[11px] text-slate-400 font-bold line-clamp-1 max-w-[250px] italic">{t.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">
                        {t.category?.name || "Umum"}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className={`px-4 py-1.5 rounded-xl font-black text-xs flex items-center gap-2 ${t.stock > 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                           {t.stock} <span className="text-[9px] opacity-60">Unit</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEdit(t)} className="w-10 h-10 flex items-center justify-center bg-white text-amber-500 border border-slate-100 rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-sm">
                           <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="w-10 h-10 flex items-center justify-center bg-white text-rose-500 border border-slate-100 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                           <i className="fas fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

     {/* MODAL SYSTEM - OPTIMIZED HEIGHT */}
{showModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setShowModal(false)}></div>
    <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
      
      {/* Header Lebih Ringkas */}
      <div className="bg-slate-900 px-8 py-5 text-white flex justify-between items-center relative">
         <div className="relative z-10 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-slate-900 shadow-lg shadow-green-500/20">
               <i className="fas fa-toolbox text-sm"></i>
            </div>
            <div>
               <h3 className="text-lg font-black tracking-tight">{isEdit ? "Edit Data Alat" : "Registrasi Alat Pinjam"}</h3>
               <p className="text-[9px] font-bold text-green-500 uppercase tracking-[0.2em]">Peminjaman System v1.0</p>
            </div>
         </div>
         <button onClick={() => setShowModal(false)} className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-rose-500 rounded-xl transition-all relative z-10">
            <i className="fas fa-times text-xs"></i>
         </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          
          {/* KOLOM KIRI: Identitas Alat */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Perangkat</label>
              <input placeholder="Nama alat yang akan dipinjamkan..." value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-green-500 outline-none transition-all" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stok Ready</label>
                <input type="number" placeholder="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-green-500 outline-none" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer" required>
                  <option value="">Pilih...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ketentuan / Deskripsi</label>
              <textarea rows="4" placeholder="Tuliskan kondisi alat atau kelengkapan..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-green-500 outline-none resize-none" required />
            </div>
          </div>

          {/* KOLOM KANAN: Visual Alat */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Foto Referensi</label>
              <div className="relative group h-[205px]"> {/* Tinggi dikunci agar modal tidak molor */}
                <label className="flex flex-col items-center justify-center w-full h-full border-2 border-slate-100 border-dashed rounded-[1.5rem] cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all overflow-hidden">
                  {form.image ? (
                    <div className="absolute inset-0 p-1">
                       <img src={URL.createObjectURL(form.image)} className="w-full h-full object-cover rounded-2xl" alt="Preview" />
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300 mx-auto mb-3">
                         <i className="fas fa-camera text-lg"></i>
                      </div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Upload Foto Alat</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
                </label>
              </div>
              <p className="text-[9px] text-slate-300 italic font-medium mt-2 text-center">Pastikan foto jelas agar siswa mengenali alat yang akan dipinjam.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons Lebih Ramping */}
        <div className="mt-6 pt-5 border-t border-slate-50 flex gap-3 justify-end items-center">
          <button type="button" onClick={() => setShowModal(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-600 transition-colors px-4">Batal</button>
          <button type="submit" className="bg-green-600 text-white px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-100 hover:bg-green-700 transition-all">
            {isEdit ? "Update Data" : "Konfirmasi Simpan"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </DashboardLayout>
  );
}