import { useEffect, useState } from "react";
import api from "../api/axios";
import PeminjamLayout from "../components/PeminjamLayout";

export default function PeminjamStatus() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const requestReturn = async (id) => {
    if (!confirm("Konfirmasi pengembalian alat sekarang?")) return;
    try {
      await api.post(`/loans/${id}/request-return`);
      alert("Permintaan pengembalian dikirim!");
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

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

  return (
    <PeminjamLayout>
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
        <div className="py-20 text-center">
          <i className="fas fa-spinner animate-spin text-3xl text-green-500 mb-4"></i>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Menghubungkan ke server...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-dashed border-gray-200 py-24 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-receipt text-gray-300 text-3xl"></i>
          </div>
          <p className="text-slate-400 font-bold">Kamu belum pernah meminjam alat apapun.</p>
          <button onClick={() => window.location.href='/katalog'} className="mt-4 text-green-600 font-black text-xs uppercase tracking-widest hover:underline">Jelajahi Katalog</button>
        </div>
      ) : (
        <div className="overflow-hidden bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-gray-50">Alat & Detail</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-gray-50 text-center">Jml</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-gray-50">Waktu Pinjam</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-gray-50">Batas Kembali</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-gray-50 text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-gray-50 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((l) => (
                  <tr key={l.id} className="group hover:bg-green-50/30 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                          {l.tool?.image ? (
                            <img src={`http://localhost:8000/storage/${l.tool.image}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs"><i className="fas fa-toolbox"></i></div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm leading-none mb-1">{l.tool?.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l.tool?.category?.name || 'General'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center font-black text-slate-700 text-sm">{l.qty}</td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-slate-600">{l.start_date || "-"}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-600">
                          {l.type === "day" ? (
                            <><i className="far fa-calendar-alt mr-2 text-green-500"></i>{l.end_date}</>
                          ) : (
                            <><i className="far fa-clock mr-2 text-blue-500"></i>{l.start_time} - {l.end_time}</>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ring-1 ${getStatusStyle(l.status)}`}>
                        {l.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {l.status === "approved" && (
                        <button
                          onClick={() => requestReturn(l.id)}
                          className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:shadow-lg hover:shadow-green-200 transition-all active:scale-95"
                        >
                          Kembalikan
                        </button>
                      )}
                      
                      {l.status === "returned" && (
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter">Terverifikasi</span>
                          {l.fine > 0 && <span className="text-[9px] font-bold text-red-500 italic">Denda: Rp {l.fine.toLocaleString()}</span>}
                        </div>
                      )}

                      {l.status === "return_req" && (
                        <span className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                          <i className="fas fa-hourglass-half"></i> Checking
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FOOTER INFO */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Butuh Bantuan?</p>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">Hubungi petugas lab jika kamu menemui kendala saat proses pengembalian atau masalah denda.</p>
        </div>
        <div className="p-6 bg-slate-50 rounded-3xl border border-gray-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Info Status</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
            <span className="text-[9px] font-bold text-slate-400 italic"><i className="fas fa-circle text-amber-500 mr-1"></i> Pending Approval</span>
            <span className="text-[9px] font-bold text-slate-400 italic"><i className="fas fa-circle text-blue-500 mr-1"></i> Sedang Dipinjam</span>
          </div>
        </div>
      </div>
    </PeminjamLayout>
  );
}