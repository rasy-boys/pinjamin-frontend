import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const routes = {
        admin: "/admin",
        petugas: "/petugas",
        peminjam: "/peminjam",
      };

      navigate(routes[res.data.role] || "/");
    } catch (err) {
      setError("Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-green-50 to-emerald-100">

      {/* LEFT */}
      <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        
        <div>
          <h1 className="text-3xl font-black mb-4">
            Sistem Peminjaman
          </h1>
          <p className="text-sm opacity-90">
            Kelola peminjaman dengan sistem yang cepat dan efisien.
          </p>
        </div>

        {/* ILUSTRASI FIX */}
        <div className="flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="illustration"
            className="w-64 drop-shadow-xl"
          />
        </div>

        <Link
          to="/"
          className="text-sm opacity-80 hover:opacity-100 transition"
        >
          ← Kembali ke Home
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl relative">

          <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">
            Masuk ke Akun
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-400 outline-none"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-400 outline-none pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-slate-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-bold hover:opacity-90 transition"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Belum punya akun?{" "}
            <Link to="/register" className="text-green-600 font-bold">
              Daftar
            </Link>
          </p>

          {/* LOADING */}
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-3xl">
              <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}