import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import { useAuth } from "./hooks/useAuth";
import { CircularProgress } from "@mui/material";

const HomeProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <CircularProgress />
        <p>Verificando Autenticacion...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <main>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            <Route
              path="/"
              element={
                <HomeProtectedRoute>
                  <HomePage />
                </HomeProtectedRoute>
              }
            />

            <Route path="*" element={<div>404 - Página no encontrada</div>} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;
