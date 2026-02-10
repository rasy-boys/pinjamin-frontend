import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Belum login
  if (!token) {
    return <Navigate to="/" />;
  }

  // Role tidak sesuai
  if (roles && !roles.includes(role)) {
    return <Navigate to="/" />;
  }

  // Boleh masuk
  return children;
}
