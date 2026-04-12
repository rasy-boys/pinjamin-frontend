import { useState, useEffect } from "react";
import api from "../api/axios";
import PeminjamLayout from "../components/PeminjamLayout";

export default function PeminjamProfil() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    nis: "",
    class: "",
  });


  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [pwError, setPwError] = useState("");
const [pwSuccess, setPwSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");

        setUser({
          name: res.data.siswa?.full_name || res.data.name || "",
          email: res.data.email || "",
          nis: res.data.siswa?.nis || "-",
          class: `${res.data.siswa?.kelas ?? ""} ${res.data.siswa?.jurusan ?? ""}`.trim(),
        });
      } catch (err) {
        console.error("Gagal load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async (e) => {
  e.preventDefault();
  setPwError("");
  setPwSuccess("");

  if (!oldPassword || !newPassword || !confirmPassword) {
    return setPwError("Semua field wajib diisi.");
  }

  if (newPassword !== confirmPassword) {
    return setPwError("Konfirmasi password tidak cocok.");
  }

  try {
    const res = await api.post("/profile/change-password", {
  current_password: oldPassword,
  new_password: newPassword,
  new_password_confirmation: confirmPassword,
});

    setPwSuccess(res.data.message || "Password berhasil diubah");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (err) {
    setPwError(err.response?.data?.message || "Gagal ubah password");
  }
};

  if (loading) {
    return (
      <PeminjamLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-semibold">Memuat profil...</p>
          </div>
        </div>
      </PeminjamLayout>
    );
  }

  return (
    <PeminjamLayout>
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {/* HEADER */}
        <div className="relative mb-16">
          <div className="h-56 bg-gradient-to-r from-slate-900 via-slate-800 to-green-900 rounded-[3rem] shadow-xl" />

          <div className="absolute left-1/2 -bottom-16 -translate-x-1/2 w-full px-6">
            <div className="bg-white rounded-[2.5rem] shadow-xl p-8 flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-[2rem] bg-green-600 text-white flex items-center justify-center text-4xl font-black shadow-lg">
                {user.name.charAt(0) || "?"}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                  {user.name || "-"}
                </h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                  NIS {user.nis} • {user.class || "-"}
                </p>
                <p className="mt-2 text-sm text-slate-500">{user.email}</p>
              </div>

              {/* Action */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all active:scale-95"
              >
                {isEditing ? "Simpan" : "Edit Profil"}
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24">
          {/* DETAIL */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-700 mb-8 flex items-center gap-3">
              <i className="fas fa-user-gear text-green-600"></i>
              Informasi Akun
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nama Lengkap" value={user.name} />
              <Field label="Email" value={user.email} />
              <Field label="NIS" value={user.nis} />
              <Field label="Kelas / Jurusan" value={user.class} />
            </div>
          </div>

          {/* STATUS */}
          {/* UBAH PASSWORD */}
<div className="bg-green-50 rounded-[2.5rem] p-8 border border-green-100">
  <h4 className="text-xs font-black uppercase tracking-widest text-green-700 mb-6">
    Ubah Password
  </h4>

  <form onSubmit={handleChangePassword} className="space-y-4">
    <input
      type="password"
      placeholder="Password Lama"
      value={oldPassword}
      onChange={(e) => setOldPassword(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-400 outline-none"
    />

    <input
      type="password"
      placeholder="Password Baru"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-400 outline-none"
    />

    <input
      type="password"
      placeholder="Konfirmasi Password Baru"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-400 outline-none"
    />

    {pwError && (
      <p className="text-xs text-red-500 font-medium">{pwError}</p>
    )}

    {pwSuccess && (
      <p className="text-xs text-green-600 font-medium">{pwSuccess}</p>
    )}

    <button
      type="submit"
      className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
    >
      Simpan Password
    </button>
  </form>
</div>
        </div>
      </div>
    </PeminjamLayout>
  );
}

/* ---------- COMPONENT KECIL ---------- */
function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
        {label}
      </p>
      <div className="bg-slate-50 rounded-xl px-5 py-4 font-bold text-slate-700">
        {value || "-"}
      </div>
    </div>
  );
}
