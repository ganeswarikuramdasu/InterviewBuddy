import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../api/client";
import PasswordField from "../components/PasswordField";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASSWORD_RULES = [
  { test: (v: string) => v.length >= 8, label: "At least 8 characters" },
  { test: (v: string) => /[A-Z]/.test(v), label: "One uppercase letter" },
  { test: (v: string) => /[a-z]/.test(v), label: "One lowercase letter" },
  { test: (v: string) => /[0-9]/.test(v), label: "One number" },
  {
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
    label: "One special character",
  },
];
const FieldWrapper: React.FC<{
  children: React.ReactNode;
  label: string;
  htmlFor: string;
  hint?: string;
}> = ({ children, label, htmlFor, hint }) => (
  <div>
    {" "}
    <label className="label" htmlFor={htmlFor}>
      {label}
    </label>{" "}
    {children}{" "}
    {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}{" "}
  </div>
);
const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    college: "",
    branch: "",
    graduationYear: "",
  });
  const [fieldError, setFieldError] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const update = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (fieldError[key]) setFieldError((fe) => ({ ...fe, [key]: "" }));
  };
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!EMAIL_RE.test(form.email.trim())) {
      errs.email = "Please enter a valid email address";
    }
    const pwd = form.password;
    if (!pwd) {
      errs.password = "Password is required";
    } else {
      const failed = PASSWORD_RULES.filter((r) => !r.test(pwd));
      if (failed.length > 0)
        errs.password = "Password does not meet the strength requirements";
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = "Please retype your password";
    } else if (form.confirmPassword !== pwd) {
      errs.confirmPassword = "Passwords do not match";
    }
    setFieldError(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone || undefined,
        college: form.college || undefined,
        branch: form.branch || undefined,
        graduationYear: form.graduationYear
          ? Number(form.graduationYear)
          : undefined,
      });
      showToast(
        `Welcome to InterviewBuddy, ${user.fullName.split(" ")[0]}! Please check your email to verify your account.`,
        "success",
      );
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };
  const pwdStrengthOk = PASSWORD_RULES.every((r) => r.test(form.password));
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      {" "}
      <div className="w-full max-w-lg">
        {" "}
        <Link
          to="/"
          className="flex items-center justify-center gap-2 font-extrabold text-xl text-slate-900 mb-8"
        >
          {" "}
          <span className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-sm">
            IB
          </span>{" "}
          InterviewBuddy{" "}
        </Link>{" "}
        <div className="card p-8">
          {" "}
          <h1 className="text-xl font-bold text-slate-900 mb-1">
            Create your account
          </h1>{" "}
          <p className="text-sm text-slate-500 mb-6">
            {" "}
            Start preparing for placements in minutes. A verification email will
            be sent to confirm your address.{" "}
          </p>{" "}
          {apiError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {apiError}
            </div>
          )}{" "}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {" "}
            <FieldWrapper label="Full Name" htmlFor="fullName">
              {" "}
              <input
                id="fullName"
                required
                className="input"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
              />{" "}
              {fieldError.fullName && (
                <p className="text-xs text-red-600 mt-1">
                  {fieldError.fullName}
                </p>
              )}{" "}
            </FieldWrapper>{" "}
            <FieldWrapper label="Email" htmlFor="email">
              {" "}
              <input
                id="email"
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />{" "}
              {fieldError.email ? (
                <p className="text-xs text-red-600 mt-1">{fieldError.email}</p>
              ) : (
                <p className="text-xs text-slate-400 mt-1">
                  You must verify this email before you can log in.
                </p>
              )}{" "}
            </FieldWrapper>{" "}
            <FieldWrapper label="Password" htmlFor="password">
              {" "}
              <PasswordField
                id="password"
                value={form.password}
                onChange={(v) => update("password", v)}
                placeholder="Create a strong password"
              />{" "}
              {fieldError.password && (
                <p className="text-xs text-red-600 mt-1">
                  {fieldError.password}
                </p>
              )}{" "}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
                {" "}
                {PASSWORD_RULES.map((r) => {
                  const ok = r.test(form.password);
                  return (
                    <li
                      key={r.label}
                      className={`text-xs flex items-center gap-1.5 ${ok ? "text-emerald-600" : "text-slate-400"}`}
                    >
                      {" "}
                      <span>{ok ? "\u2713" : "\u25CB"}</span> {r.label}{" "}
                    </li>
                  );
                })}{" "}
              </ul>{" "}
            </FieldWrapper>{" "}
            <FieldWrapper label="Retype Password" htmlFor="confirmPassword">
              {" "}
              <PasswordField
                id="confirmPassword"
                value={form.confirmPassword}
                onChange={(v) => update("confirmPassword", v)}
                placeholder="Retype your password"
              />{" "}
              {fieldError.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {fieldError.confirmPassword}
                </p>
              )}{" "}
              {form.confirmPassword &&
                form.confirmPassword === form.password &&
                pwdStrengthOk && (
                  <p className="text-xs text-emerald-600 mt-1">
                    Passwords match.
                  </p>
                )}{" "}
            </FieldWrapper>{" "}
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <div>
                {" "}
                <label className="label" htmlFor="phone">
                  Phone
                </label>{" "}
                <input
                  id="phone"
                  className="input"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label" htmlFor="graduationYear">
                  Graduation Year
                </label>{" "}
                <input
                  id="graduationYear"
                  type="number"
                  className="input"
                  value={form.graduationYear}
                  onChange={(e) => update("graduationYear", e.target.value)}
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <div>
                {" "}
                <label className="label" htmlFor="college">
                  College
                </label>{" "}
                <input
                  id="college"
                  className="input"
                  value={form.college}
                  onChange={(e) => update("college", e.target.value)}
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="label" htmlFor="branch">
                  Branch
                </label>{" "}
                <input
                  id="branch"
                  className="input"
                  value={form.branch}
                  onChange={(e) => update("branch", e.target.value)}
                />{" "}
              </div>{" "}
            </div>{" "}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full"
            >
              {" "}
              {submitting ? "Creating account..." : "Create Account"}{" "}
            </button>{" "}
          </form>{" "}
          <p className="mt-6 text-center text-sm text-slate-500">
            {" "}
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-600 font-medium hover:underline"
            >
              Log in
            </Link>{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default RegisterPage;
