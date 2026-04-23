import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    kelas: "",
    jurusan: "",
    nis: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (!form.email || !form.password) {
      return setError("Email dan password wajib diisi.");
    }
    if (form.password.length < 8) {
      return setError("Password minimal 8 karakter.");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Konfirmasi password tidak cocok.");
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.full_name || !form.kelas || !form.jurusan) {
      return setError("Data siswa wajib diisi.");
    }

    try {
      setLoading(true);

      const res = await api.post("/register", {
        name: form.full_name,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmPassword,
        full_name: form.full_name,
        kelas: form.kelas,
        jurusan: form.jurusan,
        nis: form.nis,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);

      navigate("/peminjam");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-green-50 to-emerald-100">

      {/* LEFT */}
      <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-emerald-600 to-green-700 text-white">
        <div>
          <h1 className="text-3xl font-black mb-4">
            Sistem Peminjaman
          </h1>
          <p className="text-sm opacity-90">
            Platform modern untuk manajemen peminjaman yang cepat dan efisien.
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src="https://illustrations.popsy.co/white/student-graduation.svg"
            alt="illustration"
            className="w-80 opacity-90"
          />
        </div>

        <Link to="/" className="text-sm opacity-80 hover:opacity-100">
          Kembali ke Home
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl relative overflow-hidden">

          {/* STEP BAR */}
          <div className="flex gap-2 mb-6">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-green-600" : "bg-gray-200"}`} />
            <div className={`h-1 flex-1 rounded-full ${step === 2 ? "bg-green-600" : "bg-gray-200"}`} />
          </div>

          <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">
            {step === 1 ? "Buat Akun" : "Data Siswa"}
          </h2>

          {/* ANIMATED FORM */}
          <div className="relative h-[320px] overflow-hidden">

            {/* STEP 1 */}
            <div className={`absolute w-full transition-all duration-500 ${
              step === 1 ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            }`}>
              <input name="email" placeholder="Email" onChange={handleChange} className="input" />

              <div className="relative mt-4">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password (min 8 karakter)"
                  onChange={handleChange}
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-sm text-slate-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Konfirmasi password"
                onChange={handleChange}
                className="input mt-4"
              />

              <button onClick={nextStep} className="btn-primary mt-6">
                Lanjut
              </button>
            </div>

            {/* STEP 2 */}
            <div className={`absolute w-full transition-all duration-500 ${
              step === 2 ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}>
              <input name="full_name" placeholder="Nama lengkap" onChange={handleChange} className="input" />

              <select name="kelas" onChange={handleChange} className="input mt-4">
                <option value="">Pilih kelas</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>

              <select name="jurusan" onChange={handleChange} className="input mt-4">
                <option value="">Pilih jurusan</option>
                <option value="RPL">RPL</option>
                <option value="TKJ">TKJ</option>
              </select>

              <input name="nis" placeholder="NIS (opsional)" onChange={handleChange} className="input mt-4" />

              <div className="flex gap-2 mt-6">
                <button onClick={() => setStep(1)} className="btn-secondary">
                  Kembali
                </button>
                <button onClick={handleSubmit} className="btn-primary flex-1">
                  {loading ? "Memproses..." : "Daftar"}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-4">
              {error}
            </p>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-green-600 font-bold">
              Login
            </Link>
          </p>

          {/* LOADING OVERLAY */}
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          outline: none;
          transition: 0.2s;
        }
        .input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.15);
        }
        .btn-primary {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: white;
          border-radius: 12px;
          font-weight: bold;
        }
        .btn-secondary {
          padding: 12px;
          background: #e2e8f0;
          border-radius: 12px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}