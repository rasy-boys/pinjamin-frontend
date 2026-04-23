import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

export default function Category() {
  const role = localStorage.getItem("role");
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const load = async () => {
    try {
      const res = await api.get("/categories");
      setData(res.data);
    } catch (err) {
      console.error("Gagal load data");
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, { name });
      } else {
        await api.post("/categories", { name });
      }
      setName("");
      setEditId(null);
      load();
    } catch {
      alert("Terjadi kesalahan 😢");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus kategori ini?")) return;
    try {
      await api.delete(`/categories/${id}`);
      load();
    } catch {
      alert("Gagal menghapus kategori");
    }
  };

  return (
    <DashboardLayout role={role}>
      {/* --- HEADER --- */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full mb-3 border border-green-100 dark:border-green-800">
          <i className="fas fa-tags text-[10px] text-green-600 dark:text-green-500"></i>
          <span className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-500">Kategori Buku</span>
        </div>
        <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">Kategori Buku</h2>
        <p className="text-slate-400 dark:text-slate-500 font-medium mt-2">Kelompokkan inventaris untuk manajemen yang lebih terstruktur.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* --- FORM SECTION (STICKY) --- */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-100/50 dark:shadow-slate-900/50">
            <div className="flex items-center gap-3 mb-8">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${editId ? 'bg-amber-500 dark:bg-amber-600 shadow-amber-100 dark:shadow-amber-900' : 'bg-slate-900 dark:bg-slate-900 shadow-slate-100 dark:shadow-slate-900'}`}>
                  <i className={`fas ${editId ? 'fa-pen-to-square' : 'fa-plus'}`}></i>
               </div>
               <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
                {editId ? "Update Kategori" : "Kategori Baru"}
               </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nama Kategori</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elektronik, Mekanik, dll..."
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-green-500 transition-all outline-none placeholder:text-slate-300"
                  required
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  className={`w-full text-white font-black text-[11px] uppercase tracking-[0.2em] py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${editId ? 'bg-amber-500 shadow-amber-100 hover:bg-amber-600' : 'bg-green-600 shadow-green-100 hover:bg-green-700'}`}
                >
                  <i className={`fas ${editId ? 'fa-save' : 'fa-circle-check'}`}></i>
                  {editId ? "Simpan Perubahan" : "Konfirmasi Data"}
                </button>
                
                {editId && (
                  <button
                    type="button"
                    onClick={() => { setEditId(null); setName(""); }}
                    className="w-full bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] py-3 rounded-2xl hover:bg-slate-100 transition-all"
                  >
                    Batal Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* --- LIST SECTION --- */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6 px-2">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                <h4 className="font-black text-slate-800 tracking-tight uppercase text-xs">Daftar Tersedia</h4>
             </div>
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{data.length} Total</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 text-2xl mx-auto shadow-sm">
                   <i className="fas fa-folder-open"></i>
                </div>
                <p className="mt-4 text-slate-400 text-sm font-bold tracking-tight">Belum ada kategori ditemukan.</p>
              </div>
            ) : (
              data.map((c) => (
                <div
                  key={c.id}
                  className="group bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-slate-100/50 hover:border-green-200 transition-all flex items-center justify-between overflow-hidden relative"
                >
                  {/* Decorative Background Icon */}
                  <i className="fas fa-tag absolute -right-4 -bottom-4 text-6xl text-slate-50 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:-rotate-12"></i>

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black group-hover:bg-green-600 group-hover:text-white transition-all duration-300 shadow-inner">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                       <span className="font-black text-slate-700 group-hover:text-slate-900 transition-colors uppercase tracking-tight">
                        {c.name}
                       </span>
                       <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5 group-hover:text-green-600 transition-colors">Kategori Buku</p>
                    </div>
                  </div>

                  <div className="flex gap-2 relative z-10 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => { setName(c.name); setEditId(c.id); }}
                      className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center"
                    >
                      <i className="fas fa-pen text-[10px]"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="w-9 h-9 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                    >
                      <i className="fas fa-trash-can text-[10px]"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}