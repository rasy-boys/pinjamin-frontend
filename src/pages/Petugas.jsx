import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

export default function Petugas() {
  const role = localStorage.getItem("role");
  
  const [data, setData] = useState({
    pendingCount: 0,
    totalStudents: 0,
    totalTools: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Mengambil data secara paralel
      const [resPending, resHistory, resUsers, resTools] = await Promise.all([
        api.get("/loans/pending"),
        api.get("/loans/history"),
        api.get("/users"), 
        api.get("/tools")
      ]);

      // Fungsi helper untuk mengekstrak data dari Laravel (menangani res.data atau res.data.data)
      const extractData = (res) => {
        if (res.data && res.data.data && Array.isArray(res.data.data)) return res.data.data;
        if (res.data && Array.isArray(res.data)) return res.data;
        return [];
      };

      const listPending = extractData(resPending);
      const listHistory = extractData(resHistory);
      const listUsers = extractData(resUsers);
      const listTools = extractData(resTools);

      // Filter role 'peminjam' (Case Insensitive)
      const jmlPeminjam = listUsers.filter(u => 
        String(u.role).toLowerCase() === 'peminjam'
      ).length;

      setData({
        pendingCount: listPending.length,
        totalStudents: jmlPeminjam,
        totalTools: listTools.length,
        // Gabungkan pending & history, urutkan dari ID terbaru
        recentActivities: [...listPending, ...listHistory]
          .sort((a, b) => b.id - a.id)
          .slice(0, 5) 
      });
    } catch (error) {
      console.error("Gagal memuat data dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleAction = async (id, action) => {
    if (!confirm(`Yakin ingin ${action === 'approve' ? 'menyetujui' : 'menolak'} ini?`)) return;
    try {
      await api.post(`/loans/${id}/${action}`);
      loadDashboardData(); 
    } catch (err) {
      alert("Gagal memproses aksi");
    }
  };

  const stats = [
    { label: "Peminjaman Baru", value: data.pendingCount, icon: "fa-bell", color: "bg-amber-500", shadow: "shadow-amber-100" },
    { label: "Total Peminjam", value: data.totalStudents, icon: "fa-users", color: "bg-green-600", shadow: "shadow-green-100" },
    { label: "Total Buku", value: data.totalTools, icon: "fa-book", color: "bg-blue-500", shadow: "shadow-blue-100" },
    { label: "Aktivitas", value: data.recentActivities.length, icon: "fa-history", color: "bg-purple-500", shadow: "shadow-purple-100" },
  ];

  return (
    <DashboardLayout role={role}>
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight flex items-center gap-3">
          <span className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900">🧑‍💼</span>
          Dashboard Petugas
        </h2>
        <p className="text-gray-400 dark:text-slate-500 font-medium ml-16 -mt-2">Selamat bekerja, pantau semua aktivitas di sini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-slate-900 transition-all group">
            <div className="flex justify-between items-start">
              <div className={`${item.color} ${item.shadow} w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg transition-transform group-hover:scale-110`}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <span className="text-3xl font-black text-gray-800 dark:text-white">
                {loading ? "..." : item.value}
              </span>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-4">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Activity */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">Aktivitas Terbaru</h3>
            <a href="/petugas/approve" className="text-green-600 font-bold text-xs hover:underline">Kelola Data</a>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[10px] text-gray-400 uppercase tracking-widest">
                  <th className="px-4 pb-2">Peminjam</th>
                  <th className="px-4 pb-2">Alat</th>
                  <th className="px-4 pb-2 text-center">Status</th>
                  <th className="px-4 pb-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.recentActivities.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-400 italic text-sm">Tidak ada aktivitas terbaru</td>
                  </tr>
                ) : (
                  data.recentActivities.map((loan) => (
                    <tr key={loan.id} className="bg-gray-50/50 rounded-2xl group hover:bg-green-50 transition-colors">
                      <td className="px-4 py-4 rounded-l-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-[10px] font-bold text-green-700 uppercase">
                            {loan.user?.name?.charAt(0) || "U"}
                          </div>
                          <span className="text-sm font-bold text-gray-700">{loan.user?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-500 font-medium">{loan.tool?.name}</span>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">{loan.qty} Unit</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase ${
                          loan.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                          loan.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 rounded-r-2xl text-center">
                        {loan.status === 'pending' ? (
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => handleAction(loan.id, 'approve')} title="Setujui" className="p-2 hover:bg-white rounded-xl transition-all text-green-600">
                              <i className="fas fa-check-circle"></i>
                            </button>
                            <button onClick={() => handleAction(loan.id, 'reject')} title="Tolak" className="p-2 hover:bg-white rounded-xl transition-all text-red-400">
                              <i className="fas fa-times-circle"></i>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-300">Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-green-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-green-100 flex flex-col justify-between min-h-[400px]">
          <div>
            <i className="fas fa-quote-right absolute top-6 right-8 text-6xl opacity-10"></i>
            <h3 className="text-xl font-bold mb-4 relative z-10">Catatan Petugas 📒</h3>
            <p className="text-green-100 text-sm leading-relaxed mb-6 opacity-80">
              Jangan lupa untuk selalu mengecek kondisi fisik alat setelah dikembalikan. Pastikan tidak ada komponen yang tertinggal!
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Status Lab Hari Ini</p>
            <p className="text-sm font-medium">
              {data.pendingCount > 0 ? `⚠️ Ada ${data.pendingCount} permintaan baru` : '✅ Semua terkendali'}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}