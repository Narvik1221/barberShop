// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SalonList from "./components/salonList/SalonList";
import SalonDetail from "./components/salonDetail/SalonDetail";
import Auth from "./components/auth/Auth";
import Profile from "./components/profile/Profile";
import AdminAuth from "./components/adminAuth/AdminAuth";
import Header from "./components/header/Header";
import AdminDashboard from "./components/adminDashboard/AdminDashboard";
import AdminSalonDetail from "./components/adminSalonDetail/AdminSalonDetail";
import { ServicesPage } from "./components/servicesPage/ServicesPage";
import EmpDashboard from "./components/empDashboard/EmpDashboard";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div className="wrapper">
      <AuthProvider>
        <Router>
          <Header />
          <main className="main">
            <Routes>
              <Route path="/dashboard/client" element={<SalonList />} />
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/employee"
                element={
                  <ProtectedRoute allowedRoles={["employee"]}>
                    <EmpDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<SalonList />} />
              <Route path="/salons/:id" element={<SalonDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              {/* Маршрут для авторизации/регистрации сотрудников и администраторов */}
              <Route path="/admin" element={<AdminAuth />} />
              <Route
                path="/admin/salons/:salonId/services"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ServicesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/salons/:id"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminSalonDetail />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
