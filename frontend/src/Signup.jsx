import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import SignUpCard from "./Components/SignUpCard";
import { AuthContext } from "./context/AuthContextValue";

const Signup = () => {
  const { register, user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(false);

  const handleSubmit = async ({ email, name, password }) => {
    setError("");
    setFormLoading(true);
    try {
      const registered = await register({ email, name, password });
      navigate(registered?.role === "admin" ? "/admin" : "/store", {
        replace: true,
      });
    } catch (err) {
      const message =
        err.response?.data?.message ??
        err.response?.data?.errors ??
        "Unable to create account.";
      setError(
        typeof message === "string"
          ? message
          : "Pastikan seluruh data terisi dengan benar."
      );
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
          Buat akun baru dan mulai eksplor berbagai menu favorit dari RungJa.
        </p>
        <p className="mt-6 text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link to="/signin" className="font-semibold text-orange-500">
            Masuk di sini
          </Link>
        </p>
      </div>
      <div className="w-full max-w-sm">
        <SignUpCard onSubmit={handleSubmit} loading={formLoading} error={error} />
      </div>
      <div className="absolute h-full w-px bg-gray-200" />
    </main>
  );
};

export default Signup;
