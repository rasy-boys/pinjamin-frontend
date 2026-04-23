import { useState, useEffect } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

export default function FineSetting() {

  const role = localStorage.getItem("role");

  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");

  const [tab, setTab] = useState("setting"); // setting | info
  const [loading, setLoading] = useState(false);



  // ================= LOAD DATA =================
  const getData = async () => {

    try {

      const res = await api.get("/fines");

      res.data.forEach(item => {
        if (item.type === "day") setDay(item.rate);
        if (item.type === "hour") setHour(item.rate);
      });

    } catch {
      alert("Gagal memuat data denda");
    }
  };


  useEffect(() => {
    getData();
  }, []);



  // ================= SAVE =================
  const submit = async (e) => {

    e.preventDefault();

    if (!day || !hour) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {

      setLoading(true);

      await api.post("/fines", {
        day,
        hour
      });

      alert("Denda berhasil disimpan ✅");

    } catch {
      alert("Gagal menyimpan denda");
    } finally {
      setLoading(false);
    }
  };



  return (
    <DashboardLayout role={role}>

      {/* ================= HEADER ================= */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <h2 className="text-3xl font-black text-gray-800 tracking-tight">
            Setting Denda
          </h2>

          <p className="text-gray-400 text-sm font-medium">
            Atur tarif denda keterlambatan peminjaman.
          </p>

        </div>


        {/* ================= TAB ================= */}
        <div className="bg-gray-100 dark:bg-slate-700 p-1.5 rounded-2xl flex gap-1 w-fit">

          <button
            onClick={() => setTab("setting")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              tab === "setting"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Setting
          </button>


          <button
            onClick={() => setTab("info")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              tab === "info"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Info
          </button>

        </div>

      </div>



      {/* ================= CONTAINER ================= */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-700 overflow-hidden min-h-[350px]">

        <div className="p-10">


          {/* ================= TAB SETTING ================= */}
          {tab === "setting" && (

            <form
              onSubmit={submit}
              className="max-w-lg mx-auto space-y-6"
            >

              {/* HARI */}
              <div>

                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Denda Per Hari (Rp)
                </label>

                <input
                  type="number"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold"
                  placeholder="Contoh: 10000"
                />

              </div>


              {/* JAM */}
              <div>

                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Denda Per Jam (Rp)
                </label>

                <input
                  type="number"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold"
                  placeholder="Contoh: 5000"
                />

              </div>


              {/* BUTTON */}
              <button
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition shadow-lg shadow-blue-100"
              >

                {loading ? "Menyimpan..." : "Simpan Setting"}

              </button>

            </form>

          )}



          {/* ================= TAB INFO ================= */}
          {tab === "info" && (

            <div className="max-w-xl mx-auto space-y-6 text-center">

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

                <h3 className="font-black text-blue-700 mb-2">
                  Cara Kerja Denda
                </h3>

                <p className="text-sm text-blue-600 leading-relaxed">

                  • Telat harian → Hari × Tarif<br/>
                  • Telat jam → Jam × Tarif<br/>
                  • Waktu dibulatkan ke atas<br/>
                  • Denda otomatis tersimpan

                </p>

              </div>


              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">

                <h3 className="font-black text-gray-700 mb-2">
                  Contoh Perhitungan
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">

                  📌 Telat 2 Hari = 2 × {day || "10.000"} = Rp {(day*2 || 20000).toLocaleString()}<br/>
                  📌 Telat 3 Jam = 3 × {hour || "5.000"} = Rp {(hour*3 || 15000).toLocaleString()}

                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
}
