import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function AuthenticatedRoute() {
  const auth = localStorage.getItem("user");
  return auth ? <Outlet /> : <Navigate to="/login" />;
}

export default AuthenticatedRoute;
