import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo.data.user.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoutes;
