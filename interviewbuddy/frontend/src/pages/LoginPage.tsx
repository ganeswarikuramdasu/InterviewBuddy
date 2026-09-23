import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../api/client";
import PasswordField from "../components/PasswordField";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.fullName.split(" ")[0]}!`, "success");
      const from = (location.state as any)?.from?.pathname;
      navigate(from || (user.role === "ADMIN" ? "/admin" : "/dashboard"), {
        replace: true,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-100 px-4">
      {/* soft indigo-tinted decorative blobs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 font-extrabold text-xl text-slate-900 mb-8"
        >
          <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-sm shadow-md shadow-indigo-500/20">
            IB
          </span>
          InterviewBuddy
        </Link>

        <div className="card overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400" />
          <div className="p-8">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 mt-1 mb-7">
              Log in to continue your placement preparation journey.
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    className="text-sm font-medium text-slate-700"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium text-indigo-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <PasswordField
                  id="password"
                  value={password}
                  onChange={(v) => setPassword(v)}
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center w-full rounded-lg px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-sm shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Logging in..." : "Log In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
            <p className="mt-2 text-center text-xs text-slate-400">
              Demo: user@interviewbuddy.com / Passw0rd!
            </p>
            <p className="mt-3 text-center text-sm">
              <Link
                to="/admin/login"
                className="text-slate-500 hover:underline"
              >
                Admin Login &rarr;
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
