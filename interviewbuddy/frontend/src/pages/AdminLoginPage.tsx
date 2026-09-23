import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../api/client";
import PasswordField from "../components/PasswordField";
const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
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
      if (user.role !== "ADMIN") {
        setError("This account does not have administrator access.");
        setSubmitting(false);
        return;
      }
      showToast(`Welcome back, ${user.fullName.split(" ")[0]}!`, "success");
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      {" "}
      <div className="w-full max-w-md">
        {" "}
        <Link
          to="/"
          className="flex items-center justify-center gap-2 font-extrabold text-xl text-slate-900 mb-8"
        >
          {" "}
          <span className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-sm">
            IB
          </span>{" "}
          InterviewBuddy Admin{" "}
        </Link>{" "}
        <div className="card p-8">
          {" "}
          <h1 className="text-xl font-bold text-slate-900 mb-1">
            Administrator Login
          </h1>{" "}
          <p className="text-sm text-slate-500 mb-6">
            Restricted access for platform administrators.
          </p>{" "}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}{" "}
          <form onSubmit={handleSubmit} className="space-y-4">
            {" "}
            <div>
              {" "}
              <label className="label" htmlFor="email">
                Admin Email
              </label>{" "}
              <input
                id="email"
                type="email"
                required
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@interviewbuddy.com"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="label" htmlFor="password">
                Password
              </label>{" "}
              <PasswordField
                id="password"
                value={password}
                onChange={(v) => setPassword(v)}
                placeholder="Enter admin password"
              />{" "}
            </div>{" "}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full"
            >
              {" "}
              {submitting ? "Logging in..." : "Log In as Admin"}{" "}
            </button>{" "}
          </form>{" "}
          <p className="mt-6 text-center text-xs text-slate-400">
            {" "}
            Demo: admin@interviewbuddy.com / Passw0rd!{" "}
          </p>{" "}
          <p className="mt-3 text-center text-sm">
            {" "}
            <Link to="/login" className="text-brand-600 hover:underline">
              &larr; Back to user login
            </Link>{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default AdminLoginPage;
