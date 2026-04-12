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
  const [tools, setTools] = useState([]);
  const [showAlatDetail, setShowAlatDetail] = useState(false);
  const [selectedAlat, setSelectedAlat] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const [p, h, t] = await Promise.all([
        api.get("/loans/pending"),
        api.get("/loans/history"),
        api.get("/tools")
      ]);
      setPending(p.data);
      setHistory(h.data);
      setTools(t.data);
    } catch (err) {
      alert("Gagal load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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

  const openAlatDetail = (alat) => {
    setSelectedAlat(alat);
    setShowAlatDetail(true);
  };

  const openDetail = (loan) => {
    setSelected(loan);
    setShowDetail(true);
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

  // Logika summary alat per barang
  const alatSummary = tools.map(tool => {
    const peminjamAktif = history.filter(
      l => (l.status === "approved") && l.tool?.id === tool.id
    );
    const dipinjam = peminjamAktif.reduce((acc, l) => acc + l.qty, 0);

    return {
      ...tool,
      dipinjam,
      peminjam: peminjamAktif
    };
  });

  return (
    <DashboardLayout role={role}>
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Manajemen Peminjaman</h2>
          <p className="text-gray-400 text-sm font-medium">Monitoring dan validasi inventaris alat.</p>
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
          <button
            onClick={() => setTab("alat")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              tab === "alat" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Total Dipinjam
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
        ) : tab === "alat" ? (
          /* TAMPILAN TAB TOTAL ALAT */
         <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {alatSummary.map((tool) => {
    const totalAset = parseInt(tool.stock) + parseInt(tool.dipinjam);
    const percentage = Math.min((tool.dipinjam / totalAset) * 100, 100);
    const isKritis = (tool.dipinjam / totalAset) > 0.8;

    return (
      <div 
        key={tool.id} 
        className="group relative bg-white rounded-[2.5rem] p-7 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-green-100/50 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
      >
        {/* Dekorasi Latar Belakang */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            {/* Icon dengan Glassmorphism style */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:rotate-12 ${isKritis ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
              <i className={`fas ${isKritis ? 'fa-exclamation-triangle' : 'fa-microscope'} text-2xl`}></i>
            </div>
            
            {/* Badge Status Stok */}
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">Ready: {tool.stock}</span>
              </div>
              <span className="text-[9px] font-bold text-gray-400 mr-2 uppercase tracking-widest">Total: {totalAset} Unit</span>
            </div>
          </div>

          {/* Judul Alat */}
          <div className="mb-5">
            <h4 className="font-black text-gray-800 text-xl mb-1 group-hover:text-green-600 transition-colors tracking-tight">
              {tool.name}
            </h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Inventaris Lab</p>
          </div>
          
          {/* Progress Section yang Lebih Keren */}
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 mb-6">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Status Pemakaian</p>
                <p className={`text-lg font-black leading-none ${isKritis ? 'text-red-600' : 'text-amber-500'}`}>
                  {tool.dipinjam} <span className="text-[10px] font-bold text-gray-400">Unit</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-black text-gray-700 leading-none">{Math.round(percentage)}%</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase">Terpakai</p>
              </div>
            </div>
            
            {/* Progress Bar Track */}
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden p-[2px]">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
                  isKritis ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-amber-400 to-orange-500'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Button dengan efek hover solid */}
          <button 
            onClick={() => openAlatDetail(tool)}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-gray-200 hover:bg-green-600 hover:shadow-green-200 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <i className="fas fa-external-link-alt text-[10px]"></i>
            Detail Peminjam
          </button>
        </div>
      </div>
    );
  })}
</div>
        ) : (
          /* TAMPILAN TAB TABEL (PENDING / HISTORY) */
          <div className="overflow-x-auto p-4">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                  <th className="px-6 py-4 text-left">Peminjam</th>
                  <th className="px-6 py-4 text-left">Item / Alat</th>
                  <th className="px-6 py-4 text-center">Jumlah</th>
                  <th className="px-6 py-4 text-center">Batas Waktu</th>
                  {tab === "history" && <th className="px-6 py-4 text-center">Status</th>}
                  <th className="px-6 py-4 text-center">Aksi</th>
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
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100 text-gray-400 text-xs">
                          <i className="fas fa-user"></i>
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-700 leading-none">{l.user?.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Siswa</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-y border-transparent group-hover:border-green-100 font-bold text-sm text-gray-600">
                      {l.tool?.name}
                    </td>
                    <td className="px-6 py-4 text-center border-y border-transparent group-hover:border-green-100 font-black text-gray-700">
                      {l.qty}
                    </td>
                    <td className="px-6 py-4 text-center border-y border-transparent group-hover:border-green-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{l.type === 'hour' ? 'Jam' : 'Tanggal'}</span>
                        <span className="text-xs font-black text-gray-700">{l.type === 'hour' ? `${l.start_time} - ${l.end_time}` : l.end_date}</span>
                      </div>
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

      {/* MODAL DETAIL PEMINJAMAN */}
      {showDetail && selected && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in">
            <div className="bg-green-600 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-white">Informasi Detail</h3>
                <p className="text-green-100 text-sm font-medium">ID Peminjaman: #{selected.id}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl">
                 <i className="fas fa-file-invoice text-2xl"></i>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Nama Peminjam</label>
                  <p className="font-black text-gray-800">{selected.user?.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusInfo(selected.status).color}`}>
                    {getStatusInfo(selected.status).label}
                  </span>
                </div>
                <div className="col-span-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-sm text-gray-600">
                  "{selected.reason}"
                </div>
              </div>
              <button onClick={() => setShowDetail(false)} className="w-full bg-gray-900 hover:bg-black py-4 rounded-2xl font-black text-white uppercase tracking-widest text-xs transition-all">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL ALAT (SIAPA YANG PINJAM) */}
      {showAlatDetail && selectedAlat && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-gray-800">{selectedAlat.name}</h3>
                  <p className="text-sm text-gray-400 font-medium">Daftar peminjam aktif</p>
                </div>
                <button onClick={() => setShowAlatDetail(false)} className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 mb-6">
                {selectedAlat.peminjam.length > 0 ? (
                  selectedAlat.peminjam.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xs">
                          <i className="fas fa-user"></i>
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-700">{p.user?.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{p.type === 'hour' ? p.start_time : p.start_date}</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-green-600">{p.qty} unit</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400 italic text-sm">
                    Tidak ada peminjaman aktif untuk alat ini.
                  </div>
                )}
              </div>

              <button 
                onClick={() => setShowAlatDetail(false)} 
                className="w-full bg-gray-900 py-4 rounded-2xl font-black text-white uppercase tracking-widest text-xs"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}