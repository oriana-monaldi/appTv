import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/auth/LogIn";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Dashboard from "./components/admin/dashboard/Dashboard";
import Clientes from "./components/admin/clients/Clientes";
import NuevoCliente from "./components/admin/clients/NuevoCliente";
import ClientsDetail from "./components/admin/clients/ClientsDetail";
import DevicePayments from "./components/admin/clients/DevicePayments";
import AltaTelevisor from "./components/admin/clients/AltaTelevisor";
import EditarCliente from "./components/admin/clients/EditarCliente";
import InactiveServices from "./components/admin/dashboard/InactiveServices";
import ClientHome from "./components/cliente/ClientHome";
import ClientPayments from "./components/cliente/ClientPayments";
import ClientDevices from "./components/cliente/ClientDevices";
import ListadoTelevisores from "./components/admin/dashboard/ListadoTelevisores";
import TelevisoresActivos from "./components/admin/dashboard/TelevisoresActivos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/clientes"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/clientes/nuevo"
          element={
            <ProtectedRoute>
              <NuevoCliente />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/clientes/:id"
          element={
            <ProtectedRoute>
              <ClientsDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/clientes/:id/editar"
          element={
            <ProtectedRoute>
              <EditarCliente />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/clientes/:id/agregar-televisor"
          element={
            <ProtectedRoute>
              <AltaTelevisor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/clientes/:clientId/televisores/:deviceId"
          element={
            <ProtectedRoute>
              <DevicePayments />
            </ProtectedRoute>
          }
        />
        <Route path="/cliente/home" element={<ClientHome />} />
        <Route
          path="/cliente/televisores/:deviceId/cuotas"
          element={<ClientPayments />}
        />
        <Route
          path="/admin/servicios-inactivos"
          element={
            <ProtectedRoute>
              <InactiveServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/servicios-inactivos"
          element={<InactiveServices />}
        />
        <Route
          path="/admin/dashboard/televisores"
          element={<ListadoTelevisores />}
        />
        <Route
          path="/admin/dashboard/televisores-activos"
          element={<TelevisoresActivos />}
        />
        <Route path="/cliente/mis-televisores" element={<ClientDevices />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
