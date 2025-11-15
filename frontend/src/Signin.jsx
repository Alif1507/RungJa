import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import SignInCard from "./Components/SignInCard";
import { AuthContext } from "./context/AuthContextValue";

const Signin = () => {
  const { login, user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(false);

  const handleSubmit = async ({ email, password }) => {
    setError("");
    setFormLoading(true);
    try {
      const loggedUser = await login(email, password);
      navigate(loggedUser?.role === "admin" ? "/admin" : "/store", {
        replace: true,
      });
    } catch (err) {
      setError(err.response?.data?.message ?? "Unable to sign in.");
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    if (pendingRedirect || authLoading) return;
    if (user) {
      setPendingRedirect(true);
      navigate(user.role === "admin" ? "/admin" : "/store", { replace: true });
    }
  }, [user, navigate, authLoading, pendingRedirect]);

  return (
    <main className="relative flex h-screen w-screen flex-row items-center justify-around bg-white">
      <div className="flex flex-col items-center text-center">
        <img src="./img/logo.png" alt="LOGO" className="w-48" />
        <h1 className="font-milonga text-7xl text-gray-800">RungJa</h1>
        <p className="mt-4 text-lg text-gray-500">
          Selamat datang kembali! Silakan masuk untuk melanjutkan belanja.
        </p>
        <p className="mt-6 text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link to="/signup" className="font-semibold text-orange-500">
            Daftar sekarang
          </Link>
        </p>
      </div>
      <div className="w-full max-w-sm">
        <SignInCard onSubmit={handleSubmit} loading={formLoading} error={error} />
      </div>
      <div className="absolute h-full w-px bg-gray-200" />
    </main>
  );
};

export default Signin;
