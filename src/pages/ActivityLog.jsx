import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

export default function ActivityLog() {
  const role = localStorage.getItem("role");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/logs").then((r) => setLogs(r.data));
  }, []);

  // Helper untuk warna badge berdasarkan aksi
  const getActionStyle = (action) => {
    const act = action.toLowerCase();
    if (act.includes("create") || act.includes("tambah")) return "bg-green-100 text-green-700 ring-green-200";
    if (act.includes("update") || act.includes("edit")) return "bg-blue-100 text-blue-700 ring-blue-200";
    if (act.includes("delete") || act.includes("hapus")) return "bg-red-100 text-red-700 ring-red-200";
    return "bg-gray-100 text-gray-700 ring-gray-200";
  };

  return (
    <DashboardLayout role={role}>
      {/* HEADER */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Log Aktivitas</h2>
          <p className="text-gray-500 mt-1">Rekaman seluruh jejak audit sistem dalam 30 hari terakhir.</p>
        </div>
        <div className="hidden md:block">
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-4 py-2 rounded-full">
             Real-time Monitoring Active
           </span>
        </div>
      </div>

      {/* MODERN TABLE CONTAINER */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-6 text-xs font-bold uppercase text-gray-400 tracking-wider">Timestamp</th>
                <th className="p-6 text-xs font-bold uppercase text-gray-400 tracking-wider">Aktor</th>
                <th className="p-6 text-xs font-bold uppercase text-gray-400 tracking-wider text-center">Aksi</th>
                <th className="p-6 text-xs font-bold uppercase text-gray-400 tracking-wider">Modul</th>
                <th className="p-6 text-xs font-bold uppercase text-gray-400 tracking-wider">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <span className="text-5xl mb-4">📜</span>
                      <p className="font-bold text-gray-500">Belum ada aktivitas tercatat</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="hover:bg-green-50/30 transition-all group">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-700 uppercase">
                          {new Date(l.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">
                          {new Date(l.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-linear-to-tr from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500 uppercase">
                          {l.user?.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{l.user?.name}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center">
                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ring-1 ring-inset uppercase tracking-tighter ${getActionStyle(l.action)}`}>
                          {l.action}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                        {l.module}
                      </span>
                    </td>
                    <td className="p-6">
                      <p className="text-sm text-gray-600 leading-relaxed max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">
                        {l.description}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* FOOTER INFO */}
      <div className="mt-6 px-6 flex items-center gap-2 text-gray-400">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <p className="text-xs font-medium uppercase tracking-widest">Logs are auto-purged every 30 days for performance</p>
      </div>
    </DashboardLayout>
  );
}