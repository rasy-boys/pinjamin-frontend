import { useEffect, useState } from "react";
import api from "../api/axios";
import PeminjamLayout from "../components/PeminjamLayout";
import { useNavigate } from "react-router-dom";

export default function PeminjamStatus() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  // State Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // ================= LOAD =================
  const load = async () => {
    try {
      const res = await api.get("/my-loans");
      setData(res.data);
    } catch {
      alert("Gagal memuat data riwayat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // ================= HELPER FUNCTIONS =================
  const getStatusStyle = (s) => {
    switch (s) {
      case "pending": return "bg-amber-100 text-amber-600 ring-amber-200/50";
      case "approved": return "bg-blue-100 text-blue-600 ring-blue-200/50";
      case "return_req": return "bg-purple-100 text-purple-600 ring-purple-200/50";
      case "returned": return "bg-green-100 text-green-600 ring-green-200/50";
      case "rejected": return "bg-red-100 text-red-600 ring-red-200/50";
      default: return "bg-gray-100 text-gray-600 ring-gray-200/50";
    }
  };

  const translateStatus = (status) => {
    const map = {
      pending: "Menunggu",
      approved: "Disetujui",
      rejected: "Ditolak",
      returned: "Dikembalikan",
      in_progress: "Sedang Dipinjam",
      completed: "Selesai",
      return_req: "Menunggu Cek",
    };
    return map[status] || status.replace("_", " ");
  };

  const getRemainingTime = (loan) => {
    const now = new Date();
    if (loan.type === "hour") {
      if (!loan.end_time) return "-";
      const end = new Date(`${loan.start_date} ${loan.end_time}`);
      const diff = end - now;
      if (diff <= 0) return "Waktu Habis";
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return hours > 0 ? `Sisa ${hours} jam ${mins} menit` : `Sisa ${mins} menit`;
    }
    if (loan.type === "day") {
      if (!loan.end_date) return "-";
      const end = new Date(loan.end_date);
      end.setHours(23, 59, 59);
      const diff = end - now;
      if (diff <= 0) return "Terlambat";
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return `Sisa ${days} hari`;
    }
    return "-";
  };

  const getRemainingClass = (loan) => {
    const now = new Date();
    if (loan.type === "hour") {
      const end = new Date(`${loan.start_date} ${loan.end_time}`);
      const diff = end - now;
      if (diff <= 0) return "text-red-600 animate-pulse";
      if (diff / 60000 <= 30) return "text-red-500 font-black";
      return "text-green-600";
    }
    if (loan.type === "day") {
      const end = new Date(loan.end_date);
      end.setHours(23, 59, 59);
      const diff = end - now;
      if (diff <= 0) return "text-red-600 animate-pulse";
      if (diff / (1000 * 60 * 60 * 24) <= 1) return "text-red-500 font-black";
      return "text-green-600";
    }
    return "text-slate-400";
  };

  return (
    <PeminjamLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Riwayat Pinjaman</h2>
          <p className="text-slate-400 text-sm font-medium">Pantau status dan tenggat waktu pengembalian alat.</p>
        </div>
        <button onClick={load} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm text-slate-400 hover:text-green-600 transition-all active:rotate-180">
          <i className="fas fa-rotate"></i>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center"><i className="fas fa-spinner animate-spin text-3xl text-green-500 mb-4"></i></div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-dashed border-gray-200 py-24 text-center">
          <p className="text-slate-400 font-bold">Kamu belum pernah meminjam alat apapun.</p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-8 py-5">Alat & Detail</th>
                  <th className="px-8 py-5 text-center">Jml</th>
                  <th className="px-8 py-5">Waktu Pinjam</th>
                  <th className="px-8 py-5">Batas Kembali</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((l) => (
                  <tr key={l.id} className="group hover:bg-green-50/30 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                          <img src={`http://localhost:8000/storage/${l.tool?.image}`} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm leading-none mb-1">{l.tool?.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l.tool?.category?.name || 'General'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center font-black text-slate-700 text-sm">{l.qty}</td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-600">{l.start_date || "-"}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        {l.status === "returned" ? (
                           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">Telah Dikembalikan</span>
                        ) : (
                          <>
                            <span className="text-xs font-bold text-slate-600">
                              {l.type === "day" ? l.end_date : `${l.start_time} - ${l.end_time}`}
                            </span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${getRemainingClass(l)}`}>
                              ⏳ {getRemainingTime(l)}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ring-1 ${getStatusStyle(l.status)}`}>
                        {translateStatus(l.status)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => { setSelectedLoan(l); setShowModal(true); }}
                        className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all active:scale-95 shadow-sm"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL DETAIL ================= */}
      {showModal && selectedLoan && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-black text-slate-800">Detail Pinjaman</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500"><i className="fas fa-times text-xl"></i></button>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 mb-6 flex items-center gap-5">
                <img src={`http://localhost:8000/storage/${selectedLoan.tool?.image}`} className="w-20 h-20 rounded-2xl object-cover border-4 border-white" />
                <div>
                  <h4 className="font-black text-slate-800 text-lg leading-tight">{selectedLoan.tool?.name}</h4>
                  <p className="text-emerald-600 font-bold text-sm">{selectedLoan.tool?.category?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Mulai</p>
                  <p className="text-xs font-bold text-slate-700">{selectedLoan.start_date}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className={`text-xs font-bold uppercase ${getStatusStyle(selectedLoan.status)} bg-transparent ring-0`}>
                    {translateStatus(selectedLoan.status)}
                  </p>
                </div>
              </div>

              <div className="space-y-3 px-2 mb-8">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs font-bold text-slate-400">JUMLAH</span>
                  <span className="text-xs font-black text-slate-800">{selectedLoan.qty} Unit</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs font-bold text-slate-400">DIBAYAR/DENDA</span>
                  <span className="text-xs font-black text-red-500">Rp {(selectedLoan.fine || 0).toLocaleString()}</span>
                </div>
                {selectedLoan.status === "returned" && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-xs font-bold text-slate-400">DIKEMBALIKAN</span>
                    <span className="text-xs font-black text-emerald-600 uppercase">
                        {selectedLoan.returned_at ? new Date(selectedLoan.returned_at).toLocaleString('id-ID') : 'Sudah Terverifikasi'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-500 text-[10px] font-black uppercase">Tutup</button>
                {selectedLoan.status === "approved" && (
                  <button 
                    onClick={() => navigate(`/pengembalian-peminjam?loan=${selectedLoan.id}`)}
                    className="flex-[2] py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase hover:bg-emerald-600 transition-all"
                  >
                    Proses Kembalikan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PeminjamLayout>
  );
}