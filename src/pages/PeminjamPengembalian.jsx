import { useEffect, useState } from "react";
import api from "../api/axios";
import PeminjamLayout from "../components/PeminjamLayout";

export default function PeminjamPengembalian() {

  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
const TOLERANCE_MINUTES = 5;


  // ================= LOAD =================
  // ================= LOAD =================
const load = async () => {
  setLoading(true);
  try {
    const res = await api.get("/my-loans");

    const active = res.data.filter(l =>
      l.status === "approved" || l.status === "return_req"
    );

    const logs = res.data
      .filter(l => l.status === "returned" || l.status === "rejected")
      .sort((a, b) => {
        // Gunakan updated_at karena ini mencatat waktu persis 
        // saat status berubah jadi 'returned' atau 'rejected'
        return new Date(b.updated_at) - new Date(a.updated_at);
      });

    setData(active);
    setHistory(logs);

  } catch {
    alert("Gagal memuat data pengembalian");
  } finally {
    setLoading(false);
  }
};


  // ================= AUTO REFRESH =================
  useEffect(() => {
    load();

    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);


  // ================= REQUEST RETURN =================
  const requestReturn = async (id) => {

    if (!confirm("Yakin ingin mengajukan pengembalian alat?")) return;

    try {
      await api.post(`/loans/${id}/request-return`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan");
    }
  };


  // ================= COUNTDOWN =================
  const getRemainingTime = (loan) => {

  const now = new Date();

  // PER JAM
  if (loan.type === "hour") {

    const end = new Date(`${loan.start_date} ${loan.end_time}`);
    end.setMinutes(end.getMinutes() + TOLERANCE_MINUTES);

    const diff = end - now;

    // ⛔ WAKTU HABIS → TAMPIL DENDA
    if (diff <= 0) {
      const fine = loan.fine > 0 
  ? loan.fine 
  : getEstimatedFine(loan);

return `Telat • Rp ${fine.toLocaleString()}`;

    }

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return hours > 0
      ? `${hours}j ${mins}m`
      : `${mins}m`;
  }


  // PER HARI
  if (loan.type === "day") {

    const end = new Date(loan.end_date);
    end.setHours(23, 59, 59);

    const diff = end - now;

    // ⛔ EXPIRED → TAMPIL DENDA
    if (diff <= 0) {

  const fine = loan.fine > 0 
    ? loan.fine 
    : getEstimatedFine(loan);

  return `Telat • Rp ${fine.toLocaleString()}`;
}

    return `${Math.ceil(diff / (1000 * 60 * 60 * 24))} Hari Lagi`;
  }

  return "-";
};

// ================= ESTIMASI DENDA =================
const getEstimatedFine = (loan) => {

  const now = new Date();

  const hourRate = 5000; // samakan dengan backend
  const dayRate  = 10000;

  let end;


  // PER JAM
  if (loan.type === "hour") {

    end = new Date(`${loan.start_date} ${loan.end_time}`);
    end.setMinutes(end.getMinutes() + TOLERANCE_MINUTES);

    if (now <= end) return 0;

    const diffMin = Math.floor((now - end) / 60000);

    const lateHour = Math.max(1, Math.ceil(diffMin / 60));

    return lateHour * hourRate;
  }


  // PER HARI
  if (loan.type === "day") {

    end = new Date(loan.end_date);
    end.setHours(23,59,59);

    if (now <= end) return 0;

    const diffHour = Math.floor((now - end) / 3600000);

    const lateDay = Math.max(1, Math.ceil(diffHour / 24));

    return lateDay * dayRate;
  }

  return 0;
};


  // ================= WARNING COLOR =================
  const getRemainingClass = (loan) => {

  const now = new Date();
  let end;

  if (loan.type === "hour") {
    end = new Date(`${loan.start_date} ${loan.end_time}`);
    end.setMinutes(end.getMinutes() + TOLERANCE_MINUTES);
  } 
  else {
    end = new Date(loan.end_date);
    end.setHours(23,59,59);
  }

  const diff = end - now;

if (diff <= 0)
  return "bg-red-100 text-red-700 border-red-300 animate-pulse font-extrabold";


  if (
    diff / 60000 <= 60 ||
    diff / (1000 * 3600 * 24) <= 1
  )
    return "bg-amber-50 text-amber-600 border-amber-100";

  return "bg-emerald-50 text-emerald-600 border-emerald-100";
};




  const getHistoryInfo = (loan) => {
  if (loan.status === "rejected") {
    return { text: "Permintaan Ditolak", class: "bg-red-50 text-red-600 border-red-100" };
  }

  if (!loan.return_date) {
    return { text: "Belum Ada Data", class: "bg-slate-100 text-slate-500 border-slate-200" };
  }

  // --- LOGIKA PENYAMBUNGAN WAKTU ---

  // 1. Ambil Tanggal Kembali (dari DB) dan Jam Sekarang (saat ini)
  // Ini untuk mensimulasikan "Kapan dia klik tombol return"
  const now = new Date();
  const jamSekarang = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  
  // Gabungkan: "2024-05-20" + " " + "15:30:00"
  const returnedAt = new Date(`${loan.return_date} ${jamSekarang}`);

  // 2. Tentukan Deadline (Tanggal Selesai + Jam Selesai)
  let deadline;
  if (loan.type === "day") {
    // Jika harian, deadline jam 23:59:59 di tanggal end_date
    deadline = new Date(`${loan.end_date} 23:59:59`);
  } else {
    // Jika per jam, gabungkan start_date dan end_time (karena start_date adalah hari peminjaman)
    deadline = new Date(`${loan.start_date} ${loan.end_time}`);
  }

  // 3. Bandingkan
  const diff = returnedAt - deadline;
  // Beri toleransi agar tidak terlalu pelit (misal 5 menit)
  const isLate = diff > (TOLERANCE_MINUTES * 60000);

  const dateDisplay = new Date(loan.return_date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  if (!isLate) {
    return {
      text: `Telah Dikembalikan • Tepat Waktu (${dateDisplay})`,
      class: "bg-emerald-50 text-emerald-600 border-emerald-100"
    };
  }

  // 4. Hitung Durasi Telat
  let lateText = "";
  if (loan.type === "day") {
    const lateDays = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    lateText = `${lateDays} Hari`;
  } else {
    const lateHours = Math.max(1, Math.ceil(diff / (1000 * 60 * 60)));
    lateText = `${lateHours} Jam`;
  }

  const finalFine = loan.fine > 0 ? loan.fine : getEstimatedFine(loan);

  return {
    text: `Telah Dikembalikan • Telat ${lateText} • Telah Membayar Denda Rp ${finalFine.toLocaleString()}`,
    class: "bg-rose-100 text-rose-700 border-rose-200 font-bold"
  };
};



  // ================= UI =================
  return (
    <PeminjamLayout>


      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">

        <div className="space-y-2">

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">
              Real-time Tracking
            </span>
          </div>

          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
            Pengembalian <span className="text-emerald-500">Alat</span>
          </h2>

          <p className="text-slate-400 text-sm font-medium max-w-md">
            Pantau durasi peminjaman dan kelola pengembalian alat secara mandiri.
          </p>

        </div>


        {/* TAB */}
        <div className="flex bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200">

          <button
            onClick={() => setActiveTab("active")}
            className={`relative px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "active"
                ? "bg-white text-slate-900 shadow-md"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Aktif

            {data.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] border-2 border-white">
                {data.length}
              </span>
            )}

          </button>


          <button
            onClick={() => setActiveTab("history")}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "history"
                ? "bg-white text-slate-900 shadow-md"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Riwayat
          </button>

        </div>

      </div>



      {/* LOADING */}
      {loading ? (

        <div className="py-32 text-center space-y-4">

          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Syncing database...
          </p>

        </div>


      ) : (activeTab === "active" ? data : history).length === 0 ? (


        <div className="bg-white rounded-[3.5rem] border border-slate-100 py-32 text-center shadow-sm">

          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
            <i className="fas fa-folder-open text-slate-200 text-4xl"></i>
          </div>

          <h3 className="text-slate-900 font-black text-xl mb-2">
            Belum Ada Data
          </h3>

          <p className="text-slate-400 text-sm font-medium">
            Semua aktivitas peminjaman akan muncul di sini.
          </p>

        </div>


      ) : (


        /* TABLE */
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-slate-50">

                  <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Spesifikasi Alat
                  </th>

                  <th className="px-6 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
                    Unit
                  </th>

                  <th className="px-6 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Masa Pinjam
                  </th>

                  <th className="px-6 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
                    Indikator
                  </th>

                  <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">
                    Opsi
                  </th>

                </tr>
              </thead>


              <tbody className="divide-y divide-slate-50">

                {(activeTab === "active" ? data : history).map((l) => (

                  <tr key={l.id} className="group hover:bg-slate-50/80 transition-all">

                    {/* TOOL */}
                    <td className="px-10 py-6">

                      <div className="flex items-center gap-5">

                        <div className="w-16 h-16 rounded-[1.25rem] overflow-hidden border border-slate-100 bg-slate-50">

                          {l.tool?.image ? (

                            <img
                              src={`http://localhost:8000/storage/${l.tool.image}`}
                              className="w-full h-full object-cover"
                            />

                          ) : (

                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <i className="fas fa-toolbox text-xl"></i>
                            </div>

                          )}

                        </div>


                        <div>

                          <p className="font-black text-slate-800 text-base mb-1">
                            {l.tool?.name}
                          </p>

                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded-md tracking-wider">
                            {l.tool?.category?.name || "Uncategorized"}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* QTY */}
                    <td className="px-6 py-6 text-center">

                      <span className="text-lg font-black text-slate-700">
                        {l.qty}
                      </span>

                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        Unit
                      </p>

                    </td>


                    {/* TIME */}
                    <td className="px-6 py-6">

                      <div className="flex flex-col">

                        <span className="text-xs font-black text-slate-600">
                          {l.type === "day" ? "Harian" : "Per Jam"}
                        </span>

                        <span className="text-[11px] font-medium text-slate-400 italic">
                          {l.type === "day"
                            ? `Sampai ${l.end_date}`
                            : `${l.start_date} • ${l.start_time} - ${l.end_time}`}
                        </span>


                      </div>

                    </td>


                    {/* STATUS */}
                    <td className="px-6 py-6 text-center">

                      {activeTab === "active" ? (

                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest ${getRemainingClass(l)}`}>
                          <i className="fas fa-hourglass-half text-[9px]"></i>
                          {getRemainingTime(l)}
                        </div>

                      ) : (

                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black tracking-widest ${getHistoryInfo(l).class}`}>
                          {getHistoryInfo(l).text}
                        </div>

                      )}

                    </td>


                    {/* ACTION */}
                    <td className="px-10 py-6 text-right">

                      {activeTab === "active" ? (

                        l.status === "approved" ? (

                          <button
                            onClick={() => requestReturn(l.id)}
                            className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-95"
                          >
                            Return Now
                          </button>

                        ) : (

                          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                            Processing
                          </span>

                        )

                      ) : (

                        <i className="fas fa-check-double text-slate-200 text-lg"></i>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </PeminjamLayout>
  );
}
