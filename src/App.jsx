import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const isAuthenticated = () => {
    return Boolean(localStorage.getItem("taskflow_user"));
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;