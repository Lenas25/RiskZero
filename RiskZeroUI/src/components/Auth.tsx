import { useState } from "react";
import { registerUser } from "../api/userService";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom"; 
import { useForm } from "react-hook-form"; 
import type { UserAuthDto } from "../types/userType";

interface FormData {
  email: string;
  password: string;
}

interface AuthProps {
  type: "login" | "signup";
  title: string;
}

const Auth = ({ type, title }: AuthProps) => {
  const { login } = useAuth();
  const navigate = useNavigate(); 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>();

  const [message, setMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setMessage(null);
    setFormError(null);

    try {
      if (type === "signup") {
        const userToRegister: UserAuthDto = { email: data.email, password: data.password };
        const response = await registerUser(userToRegister);
        if (response && "user" in response) { 
          setMessage("Registro exitoso. Puedes iniciar sesión ahora.");
          reset(); 
          navigate('/login'); 
        } else {
          setMessage(
            "message" in response
              ? response.message
              : "Registro exitoso. Puedes iniciar sesión ahora."
          );
        }
      } else { 
        const success = await login({ email: data.email, password: data.password });
        if (success) {
          setMessage("Inicio de sesión exitoso.");
          reset();
          navigate('/');
        } else {
          setFormError("Credenciales inválidas.");
        }
      }
    } catch (err) {
      console.error("Error during authentication:", err);
      setFormError(
        `Ocurrió un error al ${
          type === "login" ? "iniciar sesión" : "registrarse"
        }. Por favor, intenta de nuevo.`
      );
    }
  };

  return (
    <div className="bg-white max-w-md p-20 rounded-lg shadow-md mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-5 text-black text-center">
        {title}
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Formato de correo inválido",
              },
            })}
            className="mt-1 block w-full text-sm text-black p-2 ring-gray-300 rounded-md shadow-sm ring-1 focus:ring-yellow-500"
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6, 
                message: "La contraseña debe tener al menos 6 caracteres",
              },
              maxLength: {
                value: 20,
                message: "La contraseña no debe exceder los 20 caracteres",
              },
            })}
            className="mt-1 block w-full text-sm text-black p-2 ring-gray-300 rounded-md shadow-sm ring-1 focus:ring-yellow-500"
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>
          )}
        </div>
        {message && <div className="text-green-600 text-sm">{message}</div>}
        {formError && <div className="text-red-600 text-sm">{formError}</div>}
        <button
          type="submit"
          className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {type === "login" ? "Iniciar" : "Registrar"}
        </button>
      </form>
      {type === "login" ? (
        <p className="mt-4 text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link to="/signup" className="text-yellow-600 hover:underline">
            Regístrate
          </Link>
        </p>
      ) : (
        <p className="mt-4 text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-yellow-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      )}
    </div>
  );
};

export default Auth;