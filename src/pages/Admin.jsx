import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

export default function Admin() {
  const role = localStorage.getItem("role");

  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);


  // ================= LOAD DASHBOARD =================
  const loadDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");

     setStats({
  users: res.data.total_user,
  peminjam: res.data.total_peminjam,
  tools: res.data.total_tool,
  loans: res.data.active_loan,
  logs: res.data.total_log
});


      setLogs(res.data.recent_logs || []);

    } catch (err) {
      console.error(err);
      alert("Gagal memuat dashboard admin");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadDashboard();
  }, []);


  // ================= DATA CARD =================
  const statData = stats && [
    {
      label: "Total Pengguna",
      value: stats.users,
      icon: "fa-users",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Alat Tersedia",
      value: stats.tools,
      icon: "fa-toolbox",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
  label: "Peminjam Aktif",
  value: stats.peminjam,
  icon: "fa-user-graduate",
  color: "text-pink-600",
  bg: "bg-pink-50"
},

    {
      label: "Log Aktivitas",
      value: stats.logs,
      icon: "fa-envelope-open-text",
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];


  return (
    <DashboardLayout role={role}>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="py-40 text-center text-gray-400 dark:text-slate-500 font-black tracking-widest uppercase text-xs">
          Memuat Dashboard...
        </div>
      )}


      {!loading && (
        <div className="space-y-10">


          {/* ================= HERO ================= */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-slate-950 p-8 md:p-12 text-white shadow-2xl dark:shadow-slate-900/50">

            <div className="flex flex-col md:flex-row justify-between items-center gap-8">

              <div>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full mb-4 border border-green-500/30">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-400">
                    System Live
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                  Selamat Datang,{" "}
                  <span className="text-green-500 italic">Admin</span>
                </h2>

                <p className="mt-4 text-slate-400 dark:text-slate-500 text-sm font-medium max-w-sm">
                  Sistem berjalan normal. Pantau semua aktivitas laboratorium di sini.
                </p>

              </div>

            </div>

            <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>

          </div>


          {/* ================= STATS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {statData?.map((stat, i) => (

              <div
                key={i}
                className="p-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[2rem] hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all"
              >

                <div
                  className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-xl mb-6`}
                >
                  <i className={`fas ${stat.icon}`}></i>
                </div>

                <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  {stat.label}
                </p>

                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-2">
                  {stat.value}
                </h3>

              </div>

            ))}

          </div>


          {/* ================= ACTIVITY ================= */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 p-8">

            <div className="flex justify-between items-center mb-8">

              <div>
                <h3 className="font-black text-slate-800 dark:text-white text-xl">
                  Aktivitas Terkini
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Log sistem terbaru
                </p>
              </div>

            </div>


            {/* LIST */}
            <div className="space-y-6">

              {logs.length === 0 && (
                <p className="text-center text-gray-400 dark:text-slate-500 italic py-10">
                  Belum ada aktivitas.
                </p>
              )}


              {logs.map((log) => (

                <div
                  key={log.id}
                  className="flex items-center gap-5 group"
                >

                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                    <i className="fas fa-history text-sm"></i>
                  </div>


                  <div className="flex-1">

                    <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                      {log.description}
                    </p>

                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase">

                      {log.user?.name || "System"} •{" "}
                      {new Date(log.created_at).toLocaleString("id-ID")}

                    </p>

                  </div>


                  <div>

                    <span className="text-[9px] bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-lg font-black uppercase border border-green-100 dark:border-green-800">
                      {log.action}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}
