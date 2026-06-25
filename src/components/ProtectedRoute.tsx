import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // TODO: replace with real auth check (e.g. read token from context/store)
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
