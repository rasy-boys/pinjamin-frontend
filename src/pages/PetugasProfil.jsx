import { useState, useEffect } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

export default function PetugasProfil() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "Petugas",
    lastLogin: "-",
  });

  const role = localStorage.getItem("role");

  const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [showForm, setShowForm] = useState(false);

const handleChangePassword = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!oldPassword || !newPassword || !confirmPassword) {
    return setError("Semua field wajib diisi.");
  }

  if (newPassword.length < 8) {
    return setError("Password minimal 8 karakter.");
  }

  if (newPassword !== confirmPassword) {
    return setError("Konfirmasi password tidak cocok.");
  }

  try {
    const res = await api.post("/profile/change-password", {
      current_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    });

    setSuccess(res.data.message || "Password berhasil diubah");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowForm(false);
  } catch (err) {
    setError(err.response?.data?.message || "Gagal ubah password");
  }
};

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");

        setUser({
          name: res.data.name || "Petugas Lab",
          email: res.data.email || "-",
          role: res.data.role || "Petugas",
          lastLogin: res.data.last_login || "Baru saja login",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  
  return (
    <DashboardLayout role={role}>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">

            {/* Avatar */}
            <div className="relative">
              <div className="w-40 h-40 bg-white/10 rounded-[3rem] border border-white/20 flex items-center justify-center text-6xl font-black">
                {user.name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center border-4 border-slate-900">
                <i className="fas fa-user-cog text-white"></i>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/20 text-orange-400 rounded-full mb-4 border border-orange-500/30">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {user.role}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black italic">
                {user.name}
              </h2>

              <p className="text-slate-400 mt-3 max-w-md">
                Bertugas mengelola peminjaman dan pengembalian alat laboratorium.
              </p>
            </div>

            {/* Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition"
            >
              {isEditing ? "Simpan" : "Edit Profil"}
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">
                Informasi Petugas
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input label="Nama Lengkap" value={user.name} disabled={!isEditing} />
                <Input label="Email" value={user.email} disabled={!isEditing} />

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase">
                    Role
                  </label>
                  <div className="bg-orange-50 px-5 py-4 rounded-xl font-bold text-orange-600 mt-2">
                    {user.role}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase">
                    Status
                  </label>
                  <div className="bg-green-50 px-5 py-4 rounded-xl text-green-600 font-bold mt-2">
                    Aktif
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Password */}
           <div className="bg-white rounded-[2.5rem] p-8 border">
  <h4 className="text-[11px] font-black text-slate-400 uppercase mb-6">
    Keamanan
  </h4>

  {!showForm ? (
    <button
      onClick={() => setShowForm(true)}
      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition"
    >
      Ganti Password
    </button>
  ) : (
    <form onSubmit={handleChangePassword} className="space-y-4">

      <input
        type="password"
        placeholder="Password Lama"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-400"
      />

      <input
        type="password"
        placeholder="Password Baru (min 8 karakter)"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-400"
      />

      <input
        type="password"
        placeholder="Konfirmasi Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-400"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
      {success && <p className="text-xs text-green-600">{success}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition"
        >
          Simpan
        </button>

        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="flex-1 bg-gray-200 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
        >
          Batal
        </button>
      </div>

    </form>
  )}
</div>
            {/* Activity */}
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border">
              <h4 className="text-[11px] font-black text-slate-400 uppercase mb-4">
                Aktivitas Terakhir
              </h4>

              <p className="text-sm font-bold text-slate-700">
                Login terakhir
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {user.lastLogin}
              </p>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

/* INPUT */
function Input({ label, value, disabled }) {
  return (
    <div>
      <label className="text-[10px] font-black text-slate-500 uppercase">
        {label}
      </label>
      <input
        defaultValue={value}
        disabled={disabled}
        className="w-full bg-slate-50 rounded-xl px-5 py-4 font-bold mt-2 outline-none disabled:opacity-60"
      />
    </div>
  );
}