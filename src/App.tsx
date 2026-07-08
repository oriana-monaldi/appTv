import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/admin/dashboard/Dashboard";
import Clientes from "./components/admin/clients/Clientes";
import NuevoCliente from "./components/admin/clients/NuevoCliente";
import ClientsDetail from "./components/admin/clients/ClientsDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/clientes" element={<Clientes />} />
        <Route path="/admin/clientes/nuevo" element={<NuevoCliente />} />
        <Route path="/admin/clientes/:id" element={<ClientsDetail />} />

        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
