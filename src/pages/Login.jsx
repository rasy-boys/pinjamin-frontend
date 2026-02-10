import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      
      if (remember) localStorage.setItem("remember_email", email);
      else localStorage.removeItem("remember_email");

      const routes = { admin: "/admin", petugas: "/petugas", peminjam: "/peminjam" };
      navigate(routes[res.data.role] || "/");
    } catch (err) {
      setError("Kredensial yang Anda masukkan salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4 relative overflow-hidden">
      
      {/* BACKGROUND DECORATION (Bikin Rame) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-green-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-blue-200 rounded-full blur-3xl"></div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex w-full max-w-4xl bg-white/90 backdrop-blur-lg rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-white min-h-[550px] z-10">
        
        {/* LEFT SIDE: Brand & Pattern */}
        <div className="hidden md:flex w-[45%] bg-green-600 p-10 flex-col justify-between relative">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.png")` }}></div>
          
          <div className="relative z-10">
            <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/30">
              <i className="fas fa-microscope text-white text-2xl"></i>
            </div>
            <h1 className="text-white text-3xl font-extrabold leading-tight tracking-tight">
              LAB <br /> <span className="text-green-200">INTEGRATED</span> <br /> SYSTEM.
            </h1>
            <p className="text-green-100 text-sm mt-4 font-medium opacity-80">Kelola inventaris dan peminjaman dalam satu genggaman digital.</p>
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-4 bg-black/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-boxes-stacked text-white"></i>
              </div>
              <span className="text-white text-xs font-bold uppercase tracking-widest">Asset Tracking</span>
            </div>
            <div className="flex items-center gap-4 bg-black/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-calendar-check text-white"></i>
              </div>
              <span className="text-white text-xs font-bold uppercase tracking-widest">Easy Booking</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="w-full md:w-[55%] p-10 md:p-14 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">Login Portal</h2>
            <div className="h-1.5 w-12 bg-green-500 rounded-full mt-2 mx-auto md:mx-0"></div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-3 border border-red-100 animate-bounce-short">
              <i className="fas fa-exclamation-circle text-lg"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1 mb-1 block transition-colors group-focus-within:text-green-600">Email Identity</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-green-500"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl pl-12 pr-4 py-4 focus:bg-white focus:border-green-500 outline-none transition-all text-sm font-medium shadow-sm focus:shadow-green-100"
                  placeholder="name@school.id"
                  required
                />
              </div>
            </div>

            <div className="relative group">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1 mb-1 block transition-colors group-focus-within:text-green-600">Access Key</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-green-500"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl pl-12 pr-14 py-4 focus:bg-white focus:border-green-500 outline-none transition-all text-sm font-medium shadow-sm focus:shadow-green-100"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                    className="peer hidden"
                  />
                  <div className="w-5 h-5 border-2 border-gray-200 rounded-lg peer-checked:bg-green-500 peer-checked:border-green-500 transition-all flex items-center justify-center">
                    <i className="fas fa-check text-[10px] text-white opacity-0 peer-checked:opacity-100"></i>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-green-600">Remember Account</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black tracking-widest shadow-[0_10px_20px_rgba(22,163,74,0.2)] transition-all active:scale-[0.97] disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {loading ? (
                <i className="fas fa-circle-notch animate-spin text-xl"></i>
              ) : (
                <>
                  <span>AUTHENTICATE</span>
                  <i className="fas fa-arrow-right text-xs"></i>
                </>
              )}
            </button>
          </form>

          <div className="mt-12 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-gray-100"></div>
            <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">Lab System V.2</p>
            <div className="h-[1px] flex-1 bg-gray-100"></div>
          </div>
        </div>

      </div>
    </div>
  );
}