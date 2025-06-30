import React from "react";
import Auth from "../components/Auth";

const SignupPage: React.FC = () => {
  return (
    <div className="bg-black/30 min-h-screen text-white backdrop-blur-2xl">
      <div className="min-h-screen flex justify-center items-center">
        <Auth title="Registro" type="signup" />
      </div>
    </div>
  );
};

export default SignupPage;
