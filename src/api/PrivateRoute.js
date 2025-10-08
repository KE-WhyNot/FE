// src/api/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  // 로그인 안된 상태면 로그인 페이지로 리다이렉트
  if (!accessToken) {
    alert("로그인이 필요한 페이지입니다.");
    return <Navigate to="/" replace />;
  }

  // 로그인 된 상태라면 원래 페이지 보여주기
  return children;
};

export default PrivateRoute;
