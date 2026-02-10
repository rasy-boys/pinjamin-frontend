import DashboardLayout from "../components/DashboardLayout";

export default function Petugas() {
  const role = localStorage.getItem("role");

  // Data Dummy untuk Statistik (Nanti bisa diambil dari API)
  const stats = [
    { label: "Peminjaman Baru", value: "12", icon: "fa-bell", color: "bg-amber-500", shadow: "shadow-amber-100" },
    { label: "Alat Keluar", value: "45", icon: "fa-dolly", color: "bg-blue-600", shadow: "shadow-blue-100" },
    { label: "Butuh Perbaikan", value: "3", icon: "fa-tools", color: "bg-red-500", shadow: "shadow-red-100" },
    { label: "Total Siswa", value: "120", icon: "fa-users", color: "bg-green-600", shadow: "shadow-green-100" },
  ];

  return (
    <DashboardLayout role={role}>
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
          <span className="p-3 bg-white rounded-2xl shadow-sm">🧑‍💼</span>
          Dashboard Petugas
        </h2>
        <p className="text-gray-400 font-medium ml-16 -mt-2">Selamat bekerja, pantau semua aktivitas lab di sini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
            <div className="flex justify-between items-start">
              <div className={`${item.color} ${item.shadow} w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg transition-transform group-hover:scale-110`}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <span className="text-3xl font-black text-gray-800">{item.value}</span>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-4">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Activity (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">Aktivitas Peminjaman Terbaru</h3>
            <button className="text-green-600 font-bold text-xs hover:underline">Lihat Semua</button>
          </div>
          <div className="p-4">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[10px] text-gray-400 uppercase tracking-widest">
                  <th className="px-4 pb-2">Peminjam</th>
                  <th className="px-4 pb-2">Alat</th>
                  <th className="px-4 pb-2">Status</th>
                  <th className="px-4 pb-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {/* Contoh Baris Data */}
                <tr className="bg-gray-50/50 rounded-2xl overflow-hidden group hover:bg-green-50 transition-colors">
                  <td className="px-4 py-4 rounded-l-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-[10px] font-bold text-green-700">B</div>
                      <span className="text-sm font-bold text-gray-700">Budi Santoso</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-500 font-medium italic">Oscilloscope Rigol</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-black rounded-full uppercase">Menunggu</span>
                  </td>
                  <td className="px-4 py-4 rounded-r-2xl text-right">
                    <button className="p-2 hover:bg-white rounded-xl transition-all text-green-600"><i className="fas fa-check-circle"></i></button>
                    <button className="p-2 hover:bg-white rounded-xl transition-all text-red-400 ml-2"><i className="fas fa-times-circle"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box (1/3 width) */}
        <div className="bg-green-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-green-100">
          <i className="fas fa-quote-right absolute top-6 right-8 text-6xl opacity-10"></i>
          <h3 className="text-xl font-bold mb-4 relative z-10">Catatan Petugas 📒</h3>
          <p className="text-green-100 text-sm leading-relaxed mb-6 opacity-80">
            Jangan lupa untuk selalu mengecek kondisi fisik alat setelah dikembalikan oleh siswa. Pastikan kabel rapi kembali!
          </p>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Jadwal Shift</p>
            <p className="text-sm font-medium">08:00 - 15:00 WIB</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}