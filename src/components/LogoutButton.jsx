import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout"); // panggil Laravel
    } catch (err) {
      // kalau error, tetap logout di frontend
      console.log("Logout error, force logout");
    }

    // hapus data login
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // balik ke login
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        background: "red",
        color: "white",
        padding: "8px 12px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}
