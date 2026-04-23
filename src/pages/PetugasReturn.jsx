import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

export default function PetugasReturn() {

  const role = localStorage.getItem("role");

  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("request");

  // MODAL
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
const [activeLoans, setActiveLoans] = useState([]); // Tab Pengingat
const [sending, setSending] = useState(null); // Loading per baris
  
/* ================= LOAD UPDATED ================= */
const load = async () => {
  setLoading(true);
  try {
    const resReq = await api.get("/loans/return-request");
    const resHis = await api.get("/loans/history");
    
    setRequests(resReq.data);
    setHistory(resHis.data.filter(item => item.status === "returned"));
    
    // Ambil data yang masih dipinjam (status approved) untuk tab pengingat
    setActiveLoans(resHis.data.filter(item => item.status === "approved"));
  } catch (err) {
    alert("Gagal memuat data");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    load();
  }, []);


  /* ================= SEND EMAIL REMINDER ================= */
const sendReminder = async (id) => {
  try {
    setSending(id);
    const res = await api.post(`/loans/${id}/reminder`);
    alert(`📧 Berhasil! ${res.data.message}`);
  } catch (err) {
    alert(err.response?.data?.message || "Gagal mengirim email");
  } finally {
    setSending(null);
  }
};

/* ================= SISA WAKTU LOGIC ================= */
const getRemainingTime = (loan) => {
  const now = new Date();
  let limit;

  if (loan.type === "day") {
    limit = new Date(loan.end_date);
    limit.setHours(23, 59, 59);
  } else {
    limit = new Date(`${loan.start_date} ${loan.end_time}`);
  }

  const diffMs = limit - now;
  
  // Jika waktu sudah lewat (terlambat)
  if (diffMs < 0) {
    return { text: "Waktu Habis", color: "text-red-600", urgent: true };
  }

  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;

  // Jika di bawah 1 jam (Hanya tampilkan Menit)
  if (hours === 0) {
    return { 
      text: `${mins} Menit Lagi`, 
      color: "text-amber-600", 
      urgent: mins <= 20 // Berkedip jika sisa 20 menit kebawah
    };
  }

  // Jika di atas 1 jam (Tampilkan Jam & Menit)
  return { 
    text: `${hours}j ${mins}m Lagi`, 
    color: "text-green-600", 
    urgent: false 
  };
};

  /* ================= CONFIRM ================= */
  const confirmReturn = async (id) => {

    try {

      const res = await api.post(`/loans/${id}/confirm-return`);

      alert(
        `Berhasil ✅\nDenda: Rp ${res.data.fine?.toLocaleString() || 0}`
      );

      load();

    } catch (err) {

      alert(err.response?.data?.message || "Gagal konfirmasi");
    }
  };



  /* ================= BATAS ================= */
  const getLimit = (l) => {

    if (l.type === "day") return l.end_date;

    if (l.type === "hour")
      return `${l.start_date} • ${l.start_time} - ${l.end_time}`;

    return "-";
  };



  /* ================= TELAT INFO ================= */
  const getLateInfo = (loan) => {

    if (!loan.return_date) return "-";

    const returned = new Date(loan.return_date + " GMT+0700");

    let limit;

    if (loan.type === "day") {
      limit = new Date(loan.end_date);
      limit.setHours(23, 59, 59);
    }
    else {
      limit = new Date(`${loan.start_date} ${loan.end_time}`);
    }

    const diff = returned - limit;

    if (diff <= 0) return "Tepat waktu";


    if (loan.type === "day") {

      const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));

      return `${days} Hari`;
    }


    const hours = Math.max(1, Math.ceil(diff / (1000 * 60 * 60)));

    return `${hours} Jam`;
  };



  /* ================= PREVIEW DENDA ================= */
  const getPreviewFine = (loan) => {

    const now = new Date();

    const hourRate = 5000;
    const dayRate = 10000;

    let limit;

    if (loan.type === "day") {

      limit = new Date(loan.end_date);
      limit.setHours(23, 59, 59);

    }
    else {

      limit = new Date(`${loan.start_date} ${loan.end_time}`);
    }

    const diff = now - limit;


    if (diff <= 0) {

      return {
        late: false,
        text: "Tepat Waktu",
        fine: 0
      };
    }


    if (loan.type === "day") {

      const lateDay = Math.max(
        1,
        Math.ceil(diff / (1000 * 60 * 60 * 24))
      );

      return {
        late: true,
        text: `Terlambat ${lateDay} Hari`,
        fine: lateDay * dayRate
      };
    }


    const lateHour = Math.max(
      1,
      Math.ceil(diff / (1000 * 60 * 60))
    );

    return {
      late: true,
      text: `Terlambat ${lateHour} Jam`,
      fine: lateHour * hourRate
    };
  };



  /* ================= FILTERED DATA ================= */
  const getFilteredData = () => {
    const currentData = tab === "request" ? requests : tab === "reminder" ? activeLoans : history;
    if (!search) return currentData;
    return currentData.filter(item => 
      item.user?.name?.toLowerCase().includes(search.toLowerCase())
    );
  };

  /* ================= STATUS TEPAT/TERLAMBAT ================= */
  const getStatusBadge = (loan) => {
    const now = new Date();
    let limit;

    if (loan.type === "day") {
      limit = new Date(loan.end_date);
      limit.setHours(23, 59, 59);
    } else {
      limit = new Date(`${loan.start_date} ${loan.end_time}`);
    }

    const isLate = now > limit;

    return {
      text: isLate ? "Terlambat" : "Tepat",
      color: isLate ? "text-red-600 bg-red-50 border-red-100" : "text-green-600 bg-green-50 border-green-100",
      bgClass: isLate ? "bg-red-50" : "bg-green-50"
    };
  };

  /* ================= UI ================= */
  return (
    <DashboardLayout role={role}>


      {/* HEADER */}
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


        {/* TAB */}
        <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1 w-fit border border-gray-200 shadow-inner">

    <button onClick={() => setTab("reminder")} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${tab === "reminder" ? "bg-white text-amber-600 shadow-md" : "text-gray-500"}`}>
        Pengingat <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100">{activeLoans.length}</span>
      </button>
          <button
            onClick={() => setTab("request")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              tab === "request"
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Antrean
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100">
              {requests.length}
            </span>
          </button>


          <button
            onClick={() => setTab("history")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              tab === "history"
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Riwayat
          </button>

        </div>
      </div>



      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[450px]">

        <div className="overflow-x-auto p-6">

<div className="mb-6 flex justify-between items-center">
  <input
    type="text"
    placeholder="Cari nama siswa..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="px-5 py-3 rounded-2xl border bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm w-72"
  />
</div>

         <table className="w-full border-separate border-spacing-y-4">
  {/* HEAD */}
  <thead>
    <tr className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
      <th className="px-4 py-2 text-center w-16">No</th>
      <th className="px-4 py-2 text-left">Siswa</th>
      
      {/* Judul Kolom Dinamis */}
      {tab === "reminder" ? (
        <th className="px-4 py-2 text-center">Sisa Waktu</th>
      ) : tab === "request" ? (
        <>
          <th className="px-4 py-2 text-center">Tanggal Pengajuan</th>
          <th className="px-4 py-2 text-center">Status</th>
        </>
      ) : (
        <>
          <th className="px-4 py-2 text-left">Pinjam</th>
          <th className="px-4 py-2 text-center">Batas</th>
        </>
      )}

      {tab === "history" && (
        <th className="px-4 py-2 text-center">Denda</th>
      )}

      <th className="px-4 py-2 text-center">Aksi</th>
    </tr>
  </thead>

  {/* BODY */}
  <tbody>
    {loading ? (
      <tr>
        <td colSpan={tab === "reminder" ? 3 : tab === "request" ? 4 : 5} className="py-20 text-center">
          <i className="fas fa-spinner animate-spin text-3xl text-blue-500"></i>
        </td>
      </tr>
    ) : getFilteredData().length === 0 ? (
      <tr>
        <td colSpan={tab === "reminder" ? 3 : tab === "request" ? 4 : 5} className="py-20 text-center text-gray-400 font-bold italic">
          Data tidak ditemukan.
        </td>
      </tr>
    ) : (
      getFilteredData().map((l, i) => {
        
        // Ambil info denda untuk history atau info waktu untuk reminder
        const info = tab === "history" ? getPreviewFine(l) : null;
        const timeInfo = tab === "reminder" ? getRemainingTime(l) : null;
        const statusBadge = tab === "request" ? getStatusBadge(l) : null;

        return (
          <tr key={l.id} className="group">
            <td className="bg-gray-50/50 px-4 py-5 text-center rounded-l-2xl font-black text-gray-400">
              {i + 1}
            </td>

            <td className="bg-gray-50/50 px-4 py-5 font-bold text-gray-700">
              {l.user?.name}
              {tab === "reminder" && (
                <div className="text-[10px] text-gray-400 font-medium">{l.user?.email}</div>
              )}
            </td>

            {/* Kolom Waktu Dinamis */}
            {tab === "reminder" ? (
              <td className="bg-gray-50/50 px-4 py-5 text-center">
                <span className={`text-xs font-black uppercase ${timeInfo.color} ${timeInfo.urgent ? 'animate-pulse' : ''}`}>
                  {timeInfo.text}
                </span>
              </td>
            ) : tab === "request" ? (
              <>
                <td className="bg-gray-50/50 px-4 py-5 text-center">
  <div className="flex flex-col gap-1">
    
    {/* TANGGAL PENGAJUAN RETURN */}
    <span className="text-xs font-bold text-gray-700">
      {l.return_request_at
        ? new Date(l.return_request_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "-"}
    </span>

    {/* JAM PENGAJUAN RETURN */}
    <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded-lg">
      {l.return_request_at
        ? new Date(l.return_request_at).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "-"}
    </span>

  </div>
</td>
                <td className="bg-gray-50/50 px-4 py-5 text-center">
                  <span className={`text-xs font-black px-3 py-1.5 rounded-xl border ${statusBadge.color}`}>
                    {statusBadge.text}
                  </span>
                </td>
              </>
            ) : (
              <>
                <td className="bg-gray-50/50 px-4 py-5">
                  <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-xl border">
                    {l.start_date}
                  </span>
                </td>
                <td className="bg-gray-50/50 px-4 py-5 text-center">
                  <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-xl border">
                    {getLimit(l)}
                  </span>
                </td>
              </>
            )}

            {/* Kolom Denda (Hanya Riwayat) */}
            {tab === "history" && (
              <td className="bg-gray-50/50 px-4 py-5 text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-400 font-bold">
                    {getLateInfo(l)}
                  </span>
                  <span className={`text-xs font-black ${l.fine > 0 ? "text-red-500" : "text-green-500"}`}>
                    Rp {l.fine?.toLocaleString() || 0}
                  </span>
                </div>
              </td>
            )}

            {/* Kolom Aksi Dinamis */}
            <td className="bg-gray-50/50 px-4 py-5 text-center rounded-r-2xl">
              {tab === "request" && (
                <button
                  onClick={() => { setSelectedLoan(l); setShowModal(true); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest shadow"
                >
                  VALIDASI
                </button>
              )}

              {tab === "reminder" && (
                <button
                  onClick={() => sendReminder(l.id)}
                  disabled={sending === l.id}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest shadow transition-all flex items-center justify-center gap-2 mx-auto
                    ${sending === l.id 
                      ? 'bg-gray-300 text-gray-500' 
                      : timeInfo.urgent 
                        ? 'bg-red-500 text-white animate-pulse' // Berkedip kalau urgent
                        : 'bg-amber-500 text-white hover:bg-amber-600'
                    }
                  `}
                >
                  {sending === l.id ? (
                    <i className="fas fa-spinner animate-spin"></i>
                  ) : (
                    <i className="fas fa-paper-plane"></i>
                  )}
                  {sending === l.id ? 'MENGIRIM...' : 'KIRIM EMAIL'}
                </button>
              )}

              {tab === "history" && (
                <div className="text-green-600 font-black text-[10px] uppercase">
                  SELESAI
                </div>
              )}
            </td>
          </tr>
        );
      })
    )}
  </tbody>
</table>

        </div>
      </div>



      {/* ================= MODAL ================= */}
      {showModal && selectedLoan && (() => {

        const info = getPreviewFine(selectedLoan);

        return (

          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
  <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in">

    {/* HEADER */}
    <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
      <div>
        <h3 className="text-2xl font-black">Konfirmasi Pengembalian</h3>
        <p className="text-blue-100 text-sm">Validasi peminjaman</p>
      </div>

      <div className="bg-white/20 p-4 rounded-2xl">
        <i className="fas fa-rotate-left text-2xl"></i>
      </div>
    </div>

    {/* CONTENT */}
   <div className="p-8">

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* LEFT */}
    <div className="space-y-6">

      {/* SISWA */}
      <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
          <i className="fas fa-user"></i>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Siswa</p>
          <p className="font-black text-gray-800">{selectedLoan.user?.name}</p>
        </div>
      </div>

      {/* ALAT */}
      <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden">
          <img
            src={
              selectedLoan.tool?.image
                ? selectedLoan.tool.image.startsWith("http")
                  ? selectedLoan.tool.image
                  : `http://localhost:8000/storage/${selectedLoan.tool.image}`
                : "https://via.placeholder.com/60"
            }
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <p className="text-[10px] text-gray-400 font-bold uppercase">Alat</p>
          <p className="font-black text-gray-800">{selectedLoan.tool?.name}</p>
          <p className="text-xs text-gray-500">Jumlah: {selectedLoan.qty}</p>
        </div>
      </div>

        {/* STATUS */}
      <div className={`p-4 rounded-2xl border text-center ${
        info.late ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"
      }`}>
        <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">
          Status
        </p>
        <p className={`font-black text-sm ${
          info.late ? "text-red-600" : "text-green-600"
        }`}>
          {info.text}
        </p>
      </div>

    </div>

    {/* RIGHT */}
    <div className="space-y-6">

{/* DIPINJAM PADA */}
<div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
  <p className="text-[10px] text-gray-400 font-bold uppercase">
    Dipinjam Pada
  </p>

  <p className="font-black text-gray-800">
    {selectedLoan.type === "hour"
      ? `${selectedLoan.start_date} • ${selectedLoan.start_time}`
      : selectedLoan.start_date}
  </p>
</div>
      {/* BATAS */}
      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <p className="text-[10px] text-gray-400 font-bold uppercase">Batas</p>
        <p className="font-black text-gray-800">{getLimit(selectedLoan)}</p>
      </div>

    

      {/* DENDA */}
      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-400 uppercase">
          Denda
        </span>
        <span className={`text-lg font-black ${
          info.fine > 0 ? "text-red-500" : "text-green-600"
        }`}>
          Rp {info.fine.toLocaleString()}
        </span>
      </div>

    </div>

  </div>

  {/* BUTTON */}
  <div className="flex gap-3 mt-8">
    <button
      onClick={() => {
        setShowModal(false);
        setSelectedLoan(null);
      }}
      className="flex-1 py-3 bg-gray-100 rounded-xl font-black text-xs uppercase tracking-widest"
    >
      Batal
    </button>

    <button
      onClick={async () => {
        await confirmReturn(selectedLoan.id);
        setShowModal(false);
        setSelectedLoan(null);
      }}
      className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all active:scale-95"
    >
      Konfirmasi
    </button>
  </div>

</div>
  </div>
</div>
        );
      })()}


    </DashboardLayout>
  );
}
