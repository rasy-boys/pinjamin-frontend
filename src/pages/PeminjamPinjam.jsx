import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import PeminjamLayout from "../components/PeminjamLayout";

export default function PeminjamPinjam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [qty, setQty] = useState(1);
  const [type, setType] = useState("day");
  const [reason, setReason] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const loadTool = async () => {
    try {
      const res = await api.get(`/tools/${id}`);
      setTool(res.data);
    } catch {
      alert("Gagal mengambil data alat");
      navigate("/katalog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTool();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/loans", {
        tool_id: tool.id,
        qty,
        reason,
        type,
        end_date: type === "day" ? endDate : null,
        start_time: type === "hour" ? startTime : null,
        end_time: type === "hour" ? endTime : null,
      });

      // Efek sukses yang lebih keren bisa pakai library toast
      alert("Permintaan berhasil dikirim 🎉");
      navigate("/status-pinjaman");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengirim permintaan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PeminjamLayout>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
        </div>
      </PeminjamLayout>
    );
  }

  return (
    <PeminjamLayout>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SISI KIRI: RINGKASAN ALAT */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                <div className="relative h-64 w-full rounded-[2rem] overflow-hidden mb-6 bg-gray-50">
                  {tool.image ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${tool.image}`}
                      className="w-full h-full object-cover"
                      alt={tool.name}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <i className="fas fa-image text-5xl"></i>
                    </div>
                  )}
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                  {tool.name}
                </h3>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {tool.category?.name || "General"}
                </span>
                
                <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Stok Tersedia</p>
                  <p className="text-xl font-black text-green-600">{tool.stock} Unit</p>
                </div>
              </div>

              {/* INFO BOX */}
              <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
                <div className="flex gap-4">
                  <i className="fas fa-circle-exclamation text-amber-500 mt-1"></i>
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    Pastikan alat dicek kondisinya saat serah terima di laboratorium. Segala kerusakan setelah peminjaman menjadi tanggung jawab peminjam.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SISI KANAN: FORM PEMINJAMAN */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-xl shadow-gray-200/20">
              <h4 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <i className="fas fa-file-signature text-green-600"></i>
                Detail Peminjaman
              </h4>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* JUMLAH */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-1">
                    Jumlah Alat
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      max={tool.stock}
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-green-500 font-bold outline-none"
                      required
                    />
                    <span className="font-bold text-slate-400">Unit</span>
                  </div>
                </div>

                {/* TIPE PEMINJAMAN */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-1">
                    Durasi Peminjaman
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-50 rounded-[1.5rem]">
                    <button
                      type="button"
                      onClick={() => setType("day")}
                      className={`py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                        type === "day" ? "bg-white text-green-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      Harian
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("hour")}
                      className={`py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                        type === "hour" ? "bg-white text-green-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      Per Jam
                    </button>
                  </div>
                </div>

                {/* ALASAN */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-1">
                    Alasan Peminjaman
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Contoh: Praktikum Fisika Dasar Kelompok 5"
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-green-500 font-medium outline-none"
                    rows="3"
                    required
                  />
                </div>

                {/* CONDITIONAL INPUTS */}
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  {type === "day" ? (
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-1">
                        Tanggal Pengembalian
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-green-500 font-bold outline-none"
                        required
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-1">
                          Jam Mulai
                        </label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-green-500 font-bold outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-1">
                          Jam Selesai
                        </label>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-green-500 font-bold outline-none"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/katalog")}
                    className="flex-1 px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] px-8 py-4 bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-green-100 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </PeminjamLayout>
  );
}