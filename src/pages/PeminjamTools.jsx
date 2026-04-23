import { useEffect, useState } from "react";
import api from "../api/axios";
import PeminjamLayout from "../components/PeminjamLayout";
import { useNavigate } from "react-router-dom";

export default function PeminjamTools() {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
const [showFineModal, setShowFineModal] = useState(false);
const [fines, setFines] = useState([]);
const [loadingFine, setLoadingFine] = useState(false);

  const loadTools = async () => {
    try {
      const res = await api.get("/tools");
      setTools(res.data);
    } catch {
      alert("Gagal memuat katalog alat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  // Filter alat berdasarkan search bar
  const filteredTools = tools.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchFines = async () => {
  try {
    setLoadingFine(true);
    const res = await api.get("/fines");
    setFines(res.data);
  } catch {
    alert("Gagal memuat informasi denda");
  } finally {
    setLoadingFine(false);
  }
};

useEffect(() => {
  if (showFineModal) {
    fetchFines();
  }
}, [showFineModal]);

  return (
    <PeminjamLayout>
      {/* SEARCH & FILTER SECTION */}
      <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            placeholder="Cari buku..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-4xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm font-medium"
          />
        </div>
        
        <div className="flex gap-2">
  <button
    onClick={() => setShowFineModal(true)}
    className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-gray-50 transition-all shadow-sm"
  >
    <i className="fas fa-info-circle mr-2"></i> Informasi Denda
  </button>
</div>

      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="py-20 text-center">
          <i className="fas fa-circle-notch animate-spin text-4xl text-green-500 mb-4"></i>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Menyiapkan Katalog...</p>
        </div>
      ) : filteredTools.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
          <i className="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 font-bold">Buku tidak ditemukan</p>
        </div>
      ) : (
        /* GRID ALAT */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="group bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:shadow-green-900/5 dark:hover:shadow-green-900/20 transition-all duration-500 flex flex-col overflow-hidden"
            >
              {/* IMAGE WRAPPER */}
              <div className="relative h-56 overflow-hidden">
                {tool.image ? (
                  <img
                    src={`http://localhost:8000/storage/${tool.image}`}
                    alt={tool.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="h-full bg-slate-100 flex flex-col items-center justify-center text-slate-300">
                    <i className="fas fa-image text-4xl mb-2"></i>
                    <span className="text-[10px] font-black uppercase">No Preview</span>
                  </div>
                )}
                
                {/* Badge Kategori */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-slate-700 shadow-sm">
                    {tool.category?.name || "General"}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg ${
                    tool.stock > 0 ? "bg-green-500" : "bg-red-500"
                  }`}>
                    {tool.stock > 0 ? `${tool.stock} Tersedia` : "Habis"}
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-black text-slate-800 text-lg mb-2 group-hover:text-green-600 transition-colors">
                  {tool.name}
                </h3>

                <p className="text-gray-400 text-xs font-medium leading-relaxed mb-6 line-clamp-2">
                  {tool.description || "Tidak ada deskripsi untuk alat ini."}
                </p>

                {/* ACTION BUTTON */}
                <button
                  disabled={tool.stock <= 0}
                  onClick={() => navigate(`/pinjam/${tool.id}`)}
                  className={`mt-auto w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    tool.stock > 0
                      ? "bg-slate-900 text-white hover:bg-green-600 shadow-xl shadow-slate-200 hover:shadow-green-100"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {tool.stock > 0 ? (
                    <>
                      <i className="fas fa-plus-circle text-sm"></i>
                      Pinjam Buku
                    </>
                  ) : (
                    "Stok Kosong"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER TIPS */}
      <div className="mt-16 p-8 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shrink-0">
          <i className="fas fa-lightbulb text-amber-400"></i>
        </div>
        <div>
          <h4 className="font-black text-lg mb-1">Tips Peminjaman</h4>
          <p className="text-slate-400 text-sm font-medium">
            Gunakan buku sesuai prosedur perpustakaan. Kerusakan yang disebabkan kelalaian akan dikenakan sanksi sesuai aturan yang berlaku.
          </p>
        </div>
      </div>
      {/* MODAL INFORMASI DENDA */}
{showFineModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white w-96 rounded-4xl p-8 shadow-2xl relative animate-fadeIn">

      <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <i className="fas fa-receipt text-green-500"></i>
        Informasi Denda
      </h2>

      {loadingFine ? (
        <div className="text-center py-6">
          <i className="fas fa-circle-notch animate-spin text-3xl text-green-500 mb-3"></i>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Memuat Data...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {fines.map((fine) => (
            <div
              key={fine.id}
              className="bg-slate-50 border border-gray-100 rounded-2xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Denda per {fine.type}
                </p>
                <p className="text-lg font-black text-red-500">
                  Rp {Number(fine.rate).toLocaleString()}
                </p>
              </div>

              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-exclamation text-red-500"></i>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowFineModal(false)}
        className="mt-6 w-full py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-all"
      >
        Tutup
      </button>
    </div>
  </div>
)}

    </PeminjamLayout>
  );
}