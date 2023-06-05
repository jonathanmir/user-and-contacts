import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import LoginPage from "./pages/Login/LoginPage";
import { AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import RegisterPage from "./pages/Register/Register";

const ProtectedRoutes = () => {
  const { isLoading } = useContext(AuthContext);
  const token = localStorage.getItem("@token");

  return token ? <Outlet /> : <Navigate to="/login" />;
};
const RoutesComponent = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default RoutesComponent;
