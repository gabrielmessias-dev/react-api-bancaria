import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Deposito from "../pages/deposito/Deposito";
import Transferencia from "../pages/transferencia/Transferencia";
import Saque from "../pages/saque/Saque";
import Extrato from "../pages/extrato/Extrato";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/deposito" element={<Deposito />} />
      <Route path="/transferencia" element={<Transferencia />} />
      <Route path="/saque" element={<Saque />} />
      <Route path="/extrato" element={<Extrato />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
    
  );
}

export default AppRoutes;