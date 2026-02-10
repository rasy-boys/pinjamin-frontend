import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

export default function PetugasApprove() {
  const role = localStorage.getItem("role");
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const [showDetail, setShowDetail] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    try {
      const p = await api.get("/loans/pending");
      const h = await api.get("/loans/history");
      setPending(p.data);
      setHistory(h.data);
    } catch {
      alert("Gagal load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    if (!confirm("Setujui peminjaman ini?")) return;
    await api.post(`/loans/${id}/approve`);
    load();
  };

  const reject = async (id) => {
    if (!confirm("Tolak peminjaman ini?")) return;
    await api.post(`/loans/${id}/reject`);
    load();
  };

  const getLimit = (loan) => {
    if (loan.type === "day") return loan.end_date;
    if (loan.type === "hour") return `${loan.start_time} - ${loan.end_time}`;
    return "-";
  };

  const getStatusInfo = (s) => {
    const map = {
      approved: { label: "Disetujui", color: "bg-green-100 text-green-700 border-green-200" },
      rejected: { label: "Ditolak", color: "bg-red-100 text-red-700 border-red-200" },
      returned: { label: "Kembali", color: "bg-blue-100 text-blue-700 border-blue-200" },
      pending: { label: "Menunggu", color: "bg-amber-100 text-amber-700 border-amber-200" }
    };
    return map[s] || { label: s, color: "bg-gray-100 text-gray-700 border-gray-200" };
  };

  const openDetail = (loan) => {
    setSelected(loan);
    setShowDetail(true);
  };

  return (
    <DashboardLayout role={role}>
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Persetujuan Alat</h2>
          <p className="text-gray-400 text-sm font-medium">Validasi permintaan peminjaman dari siswa.</p>
        </div>

        {/* MODERN TAB SWITCHER */}
        <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1 w-fit">
          <button
            onClick={() => setTab("pending")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              tab === "pending" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Permintaan <span className="ml-1 bg-green-100 px-2 py-0.5 rounded-full">{pending.length}</span>
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              tab === "history" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Riwayat
          </button>
        </div>
      </div>

      {/* DATA CONTAINER */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
            <i className="fas fa-circle-notch animate-spin text-3xl mb-4 text-green-500"></i>
            <p className="font-bold uppercase tracking-widest text-xs">Memuat Data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                  <th className="px-6 py-4 text-left">Peminjam</th>
                  <th className="px-6 py-4 text-left">Item / Alat</th>
                  <th className="px-6 py-4 text-center">Jumlah</th>
                  <th className="px-6 py-4 text-center">Batas Waktu</th>
                  {tab === "history" && <th className="px-6 py-4 text-center">Status</th>}
                  <th className="px-6 py-4 text-center whitespace-nowrap">Detail & Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(tab === "pending" ? pending : history).length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-gray-400 font-medium italic">
                      Belum ada catatan peminjaman.
                    </td>
                  </tr>
                )}
                {(tab === "pending" ? pending : history).map((l) => (
                  <tr key={l.id} className="bg-gray-50/50 hover:bg-green-50 transition-colors group">
                    <td className="px-6 py-4 rounded-l-2xl border-y border-l border-transparent group-hover:border-green-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
                          <i className="fas fa-user text-gray-400 text-xs"></i>
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-700 leading-none">{l.user?.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Siswa</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-y border-transparent group-hover:border-green-100 font-bold text-sm text-gray-600">
                      <i className="fas fa-microscope mr-2 text-green-500/50"></i> {l.tool?.name}
                    </td>
                    <td className="px-6 py-4 text-center border-y border-transparent group-hover:border-green-100 font-black text-gray-700">
                      {l.qty}
                    </td>
                    <td className="px-6 py-4 text-center border-y border-transparent group-hover:border-green-100">
                      <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                        {getLimit(l)}
                      </span>
                    </td>
                    {tab === "history" && (
                      <td className="px-6 py-4 text-center border-y border-transparent group-hover:border-green-100">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${getStatusInfo(l.status).color}`}>
                          {getStatusInfo(l.status).label}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-right rounded-r-2xl border-y border-r border-transparent group-hover:border-green-100">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openDetail(l)} className="w-9 h-9 flex items-center justify-center bg-white rounded-xl border border-gray-100 text-blue-500 hover:bg-blue-50 transition-all shadow-sm">
                          <i className="fas fa-eye"></i>
                        </button>
                        {tab === "pending" && (
                          <>
                            <button onClick={() => approve(l.id)} className="w-9 h-9 flex items-center justify-center bg-green-600 rounded-xl text-white hover:bg-green-700 transition-all shadow-lg shadow-green-100">
                              <i className="fas fa-check"></i>
                            </button>
                            <button onClick={() => reject(l.id)} className="w-9 h-9 flex items-center justify-center bg-red-100 rounded-xl text-red-600 hover:bg-red-200 transition-all">
                              <i className="fas fa-times"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODERN MODAL DETAIL */}
      {showDetail && selected && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in">
            <div className="bg-green-600 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black">Informasi Detail</h3>
                <p className="text-green-100 text-sm font-medium">Data lengkap peminjaman alat.</p>
              </div>
              <i className="fas fa-file-invoice text-4xl opacity-20"></i>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Nama Peminjam</label>
                  <p className="font-bold text-gray-800">{selected.user?.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Status Sekarang</label>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusInfo(selected.status).color}`}>
                    {getStatusInfo(selected.status).label}
                  </span>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Alasan Peminjaman</label>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium text-gray-600 leading-relaxed italic">
                    "{selected.reason}"
                  </div>
                </div>
              </div>
              
              <button onClick={() => setShowDetail(false)} className="w-full bg-gray-100 hover:bg-gray-200 py-4 rounded-2xl font-black text-gray-500 uppercase tracking-widest text-xs transition-all">
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}