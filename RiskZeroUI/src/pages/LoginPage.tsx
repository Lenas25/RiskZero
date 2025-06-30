// src/pages/LoginPage.tsx
import React from "react";
import Auth from "../components/Auth";

const LoginPage: React.FC = () => {
  return (
    <div className="bg-black/30 min-h-screen text-white backdrop-blur-2xl">
      <div className="min-h-screen flex justify-center items-center">
        <Auth title="Iniciar Sesion" type="login" />
      </div>
    </div>
  );
};

export default LoginPage;
