import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
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
      localStorage.setItem("name", res.data.name || res.data.user?.name);
      const routes = { admin: "/admin", petugas: "/petugas", peminjam: "/peminjam" };
      navigate(routes[res.data.role] || "/");
    } catch (err) {
      setError("Akses ditolak. Cek kembali kredensial Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617] p-4 md:p-6 relative overflow-hidden transition-colors duration-500">
      
      {/* --- BACKGROUND ELEMENTS: Abstract Shapes --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 dark:bg-green-500/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 dark:bg-emerald-600/5 rounded-full blur-[120px]"></div>

      {/* --- BACK LINK --- */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-green-600 transition-all z-50"
      >
        <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:border-green-500 transition-colors">
          <i className="fas fa-chevron-left group-hover:-translate-x-0.5 transition-transform"></i>
        </div>
        Back to Home
      </Link>

      {/* --- LOGIN CARD: Ultra Modern Bento --- */}
      <div className="relative w-full max-w-240 grid md:grid-cols-2 bg-white dark:bg-slate-900/50 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3.5rem] border border-white dark:border-slate-800/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500">
        
        {/* LEFT SIDE: Visual Brand (Hidden on Mobile) */}
        <div className="relative hidden md:flex flex-col justify-between p-14 bg-linear-to-br from-slate-900 to-slate-800 dark:from-green-600 dark:to-emerald-800 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            
            <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                    <i className="fas fa-leaf text-xl"></i>
                </div>
                <h2 className="text-4xl font-black leading-tight tracking-tighter">
                    Manage your <br /> lab assets <br /> <span className="text-green-400">effortlessly.</span>
                </h2>
            </div>

            <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-4xl">
                <p className="text-sm font-medium text-slate-200 italic">"The best way to predict the future is to invent it."</p>
                <div className="mt-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-500 border border-white/20 overflow-hidden">
                        <img src="https://i.pravatar.cc/100" alt="avatar" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Platform Lead, Pinjamin</span>
                </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute bottom-[-5%] left-[-5%] w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* RIGHT SIDE: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center transition-all">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Welcome Back.</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Enter your credentials to access system</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold rounded-2xl flex items-center gap-3 animate-pulse">
               <i className="fas fa-circle-exclamation text-base"></i> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Work Email</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-green-500 transition-colors"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4 pl-12 text-sm rounded-2xl dark:text-white outline-none focus:border-green-500/50 focus:ring-4 focus:ring-green-500/5 transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Secure Password</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-green-500 transition-colors"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4 pl-12 pr-12 text-sm rounded-2xl dark:text-white outline-none focus:border-green-500/50 focus:ring-4 focus:ring-green-500/5 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-500 transition-colors"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <input 
                    type="checkbox" 
                    checked={remember} 
                    onChange={() => setRemember(!remember)}
                    className="w-4 h-4 rounded-lg accent-green-600 cursor-pointer" 
                />
                Remember me
              </label>
              <a href="#" className="text-green-600 hover:text-green-500 uppercase tracking-widest">Forgot Access?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-slate-200 dark:shadow-none disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? <i className="fas fa-circle-notch animate-spin"></i> : "Sign In to Dashboard"}
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </div>
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Internal Access Only • <span className="text-slate-300 dark:text-slate-700">Ver 4.0.2</span>
          </p>
        </div>
      </div>
    </div>
  );
}