import { useState, useEffect } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

export default function PetugasLaporan() {

  const role = localStorage.getItem("role");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [tab, setTab] = useState("cetak"); // cetak | riwayat
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);


  // ================= LOAD HISTORY =================
  useEffect(() => {
    const saved = localStorage.getItem("report_history");

    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);


  // ================= SAVE HISTORY =================
  const saveHistory = (item) => {

    const newHistory = [item, ...history];

    setHistory(newHistory);

    localStorage.setItem(
      "report_history",
      JSON.stringify(newHistory)
    );
  };


  // ================= DOWNLOAD PDF =================
  const downloadPDF = async (f = from, t = to) => {

    if (!f || !t) {
      alert("Pilih tanggal terlebih dahulu!");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(
        `/report-loans?from=${f}&to=${t}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement("a");
      link.href = url;

      const filename = `laporan_${f}_${t}.pdf`;

      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();


      // SIMPAN KE RIWAYAT
      saveHistory({
        from: f,
        to: t,
        file: filename,
        time: new Date().toLocaleString()
      });

    } catch {
      alert("Gagal mencetak laporan");
    } finally {
      setLoading(false);
    }
  };


  return (
    <DashboardLayout role={role}>

      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">
            Laporan Peminjaman
          </h2>

          <p className="text-gray-400 text-sm font-medium">
            Cetak dan arsip laporan peminjaman alat.
          </p>
        </div>


        {/* TAB */}
        <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1 w-fit">

          <button
            onClick={() => setTab("cetak")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              tab === "cetak"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Cetak
          </button>


          <button
            onClick={() => setTab("riwayat")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              tab === "riwayat"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Riwayat
          </button>

        </div>

      </div>


      {/* CONTAINER */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[350px]">

        <div className="p-10">


          {/* ================= TAB CETAK ================= */}
          {tab === "cetak" && (

            <div className="max-w-lg mx-auto space-y-6">


              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Dari Tanggal
                </label>

                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold"
                />
              </div>


              <div>
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  Sampai Tanggal
                </label>

                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold"
                />
              </div>


              <button
                onClick={() => downloadPDF()}
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-green-700 transition shadow-lg shadow-green-100"
              >

                {loading ? "Memproses..." : "Cetak PDF"}

              </button>

            </div>

          )}


          {/* ================= TAB RIWAYAT ================= */}
          {tab === "riwayat" && (

            <div className="overflow-x-auto">

              {history.length === 0 ? (

                <p className="text-center text-gray-400 font-bold py-20">
                  Belum ada riwayat cetak.
                </p>

              ) : (

                <table className="w-full border-separate border-spacing-y-3">

                  <thead>
                    <tr className="text-[10px] text-gray-400 font-black uppercase tracking-widest">

                      <th className="px-6 py-3 text-left">
                        Periode
                      </th>

                      <th className="px-6 py-3 text-center">
                        Dicetak
                      </th>

                      <th className="px-6 py-3 text-center">
                        Aksi
                      </th>

                    </tr>
                  </thead>


                  <tbody>

                    {history.map((h, i) => (

                      <tr
                        key={i}
                        className="bg-gray-50/60 hover:bg-green-50 transition"
                      >

                        <td className="px-6 py-4 rounded-l-xl font-bold text-gray-700">
                          {h.from} → {h.to}
                        </td>


                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                          {h.time}
                        </td>


                        <td className="px-6 py-4 text-center rounded-r-xl">

                          <button
                            onClick={() => downloadPDF(h.from, h.to)}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase hover:bg-blue-100 transition"
                          >
                            Download
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              )}

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
}
