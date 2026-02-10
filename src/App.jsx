import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import CreateUser from "./pages/CreateUser";
import Admin from "./pages/Admin";
import Petugas from "./pages/Petugas";
import Peminjam from "./pages/Peminjam";
import Category from "./pages/Category";
import Tool from "./pages/Tool";
import ActivityLog from "./pages/ActivityLog";
import PeminjamTools from "./pages/PeminjamTools";
import PeminjamPinjam from "./pages/PeminjamPinjam";
import PeminjamStatus from "./pages/PeminjamStatus";
import PetugasApprove from "./pages/PetugasApprove";
import PetugasReturn from "./pages/PetugasReturn";
import Home from "./pages/Home";
import PeminjamProfil from "./pages/PeminjamProfil";  
import AdminProfil from "./pages/AdminProfil";  

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />

        <Route
  path="/create-user"
  element={
    <ProtectedRoute roles={["admin","petugas"]}>
      <CreateUser />
    </ProtectedRoute>
  }
/>

   <Route
  path="/admin"
  element={
    <ProtectedRoute roles={["admin"]}>
      <Admin />
    </ProtectedRoute>
  }
/>
        <Route 
        path="/petugas" 
        element={
        <ProtectedRoute roles={["petugas"]}>
        <Petugas />
        </ProtectedRoute>
        }
        />

        <Route
  path="/peminjam"
  element={
    <ProtectedRoute roles={["peminjam","admin","petugas"]}>
      <Peminjam />
    </ProtectedRoute>
  }
/>



<Route
 path="/categories"
 element={
  <ProtectedRoute roles={["admin"]}>
    <Category/>
  </ProtectedRoute>
 }
/>

<Route
 path="/tools"
 element={
  <ProtectedRoute roles={["admin"]}>
    <Tool/>
  </ProtectedRoute>
 }
/>

<Route
 path="/logs"
 element={
  <ProtectedRoute roles={["admin"]}>
    <ActivityLog/>
  </ProtectedRoute>
 }
/>

<Route
  path="/katalog"
  element={
    <ProtectedRoute roles={["peminjam"]}>
      <PeminjamTools />
    </ProtectedRoute>
  }
/>

<Route
  path="/profil-peminjam"
  element={
    <ProtectedRoute roles={["peminjam"]}>
      <PeminjamProfil />
    </ProtectedRoute>
  }
/>

<Route
 path="/profil-admin"
 element={
  <ProtectedRoute roles={["admin"]}>
    <AdminProfil/>
  </ProtectedRoute>
 }
/>

<Route
  path="/pinjam/:id"
  element={
    <ProtectedRoute roles={["peminjam"]}>
      <PeminjamPinjam />
    </ProtectedRoute>
  }
/>


<Route
  path="/status-pinjaman"
  element={
    <ProtectedRoute roles={["peminjam"]}>
      <PeminjamStatus />
    </ProtectedRoute>
  }
/>

<Route
  path="/manage-peminjaman"
  element={
    <ProtectedRoute roles={["petugas"]}>
      <PetugasApprove />
    </ProtectedRoute>
  }
/>

<Route
  path="/manage-return"
  element={
    <ProtectedRoute roles={["petugas"]}>
      <PetugasReturn />
    </ProtectedRoute>
  }
/>



      </Routes>
    </BrowserRouter>
  );
}



export default App;
