import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

export default function PetugasReturn() {
  const role = localStorage.getItem("role");
  
  const [requests, setRequests] = useState([]); // Antrean baru
  const [history, setHistory] = useState([]);   // Riwayat selesai
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("request"); // 'request' atau 'history'

  const load = async () => {
    setLoading(true);
    try {
      const resReq = await api.get("/loans/return-request");
      const resHis = await api.get("/loans/history"); // Pastikan endpoint ini mengembalikan data status 'returned'
      
      setRequests(resReq.data);
      // Filter history hanya yang sudah dikembalikan (returned)
      setHistory(resHis.data.filter(item => item.status === "returned"));
    } catch (err) {
      console.log(err);
      alert("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const confirmReturn = async (id) => {
    if (!confirm("Konfirmasi pengembalian alat ini?")) return;
    try {
      const res = await api.post(`/loans/${id}/confirm-return`);
      alert(`Berhasil! ✅\nStatus: Dikembalikan\nDenda: Rp ${res.data.fine?.toLocaleString() || 0}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal konfirmasi");
    }
  };

  const getLimit = (l) => {
    if (l.type === "day") return l.end_date;
    if (l.type === "hour") return `${l.start_time} - ${l.end_time}`;
    return "-";
  };

  return (
    <DashboardLayout role={role}>
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
            <span className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <i className="fas fa-rotate-left"></i>
            </span>
            Logistik Kembali
          </h2>
          <p className="text-gray-400 text-sm font-medium mt-1 ml-1">
            Pantau dan validasi pemulangan inventaris laboratorium.
          </p>
        </div>

        {/* MODERN TAB SWITCHER */}
        <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1 w-fit border border-gray-200 shadow-inner">
          <button
            onClick={() => setTab("request")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              tab === "request" ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Antrean <span className={`px-2 py-0.5 rounded-full text-[10px] ${tab === 'request' ? 'bg-blue-100' : 'bg-gray-200'}`}>{requests.length}</span>
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              tab === "history" ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Riwayat Selesai
          </button>
        </div>
      </div>

      {/* DATA CONTAINER */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[450px]">
        <div className="overflow-x-auto p-6">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                <th className="px-4 py-2 text-center w-16">No</th>
                <th className="px-4 py-2 text-left">Siswa</th>
                <th className="px-4 py-2 text-left">Alat & ID</th>
                <th className="px-4 py-2 text-center">Batas</th>
                {tab === "history" && <th className="px-4 py-2 text-center">Denda</th>}
                <th className="px-4 py-2 text-center">Aksi / Status</th>
              </tr>
            </thead>
            
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={tab === "history" ? 6 : 5} className="py-20 text-center">
                    <i className="fas fa-spinner animate-spin text-3xl text-blue-500"></i>
                  </td>
                </tr>
              ) : (tab === "request" ? requests : history).length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <p className="text-gray-400 font-bold italic tracking-wide">Data tidak ditemukan.</p>
                  </td>
                </tr>
              ) : (
                (tab === "request" ? requests : history).map((l, i) => (
                  <tr key={l.id} className="group transition-all">
                    <td className="bg-gray-50/50 px-4 py-5 text-center rounded-l-2xl font-black text-gray-400 group-hover:bg-blue-50/50 border-y border-l border-transparent group-hover:border-blue-100">
                      {i + 1}
                    </td>
                    
                    <td className="bg-gray-50/50 px-4 py-5 group-hover:bg-blue-50/50 border-y border-transparent group-hover:border-blue-100 font-bold text-gray-700 text-sm">
                      {l.user?.name}
                    </td>

                    <td className="bg-gray-50/50 px-4 py-5 group-hover:bg-blue-50/50 border-y border-transparent group-hover:border-blue-100">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-800 uppercase tracking-tighter">{l.tool?.name}</span>
                        <span className="text-[9px] text-gray-400 font-bold italic tracking-widest italic">QUANTITY: {l.qty} UNIT</span>
                      </div>
                    </td>

                    <td className="bg-gray-50/50 px-4 py-5 text-center group-hover:bg-blue-50/50 border-y border-transparent group-hover:border-blue-100">
                      <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                        {getLimit(l)}
                      </span>
                    </td>

                    {tab === "history" && (
                      <td className="bg-gray-50/50 px-4 py-5 text-center group-hover:bg-blue-50/50 border-y border-transparent group-hover:border-blue-100">
                        <span className={`text-xs font-black ${l.fine > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          Rp {l.fine?.toLocaleString() || 0}
                        </span>
                      </td>
                    )}

                    <td className="bg-gray-50/50 px-4 py-5 text-center rounded-r-2xl border-y border-r border-transparent group-hover:border-blue-100 group-hover:bg-blue-50/30">
                      {tab === "request" ? (
                        <button
                          onClick={() => confirmReturn(l.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2 mx-auto"
                        >
                          <i className="fas fa-check-double"></i>
                          VALIDASI
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest bg-green-50 py-2 rounded-xl border border-green-100">
                          <i className="fas fa-circle-check"></i>
                          Selesai
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}