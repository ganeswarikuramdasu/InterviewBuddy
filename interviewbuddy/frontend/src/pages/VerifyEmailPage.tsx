import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authApi } from "../api/auth";
import { getErrorMessage } from "../api/client";
import Spinner from "../components/Spinner";
type Status = "loading" | "success" | "error";
const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [resent, setResent] = useState(false);
  useEffect(() => {
    let active = true;
    (async () => {
      if (!token) {
        if (active) {
          setStatus("error");
          setMessage(
            "No verification token was provided. Check the link in your email or request a new one.",
          );
        }
        return;
      }
      try {
        await authApi.verifyEmail(token);
        if (active) {
          setStatus("success");
          setMessage(
            "Your email has been verified successfully. You can now log in and use all features.",
          );
        }
      } catch (err) {
        if (active) {
          setStatus("error");
          setMessage(getErrorMessage(err));
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);
  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setResent(false);
    try {
      await authApi.resendVerification(email.trim());
      setResent(true);
    } catch (err) {
      setMessage(getErrorMessage(err));
      setStatus("error");
    } finally {
      setSending(false);
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
          InterviewBuddy{" "}
        </Link>{" "}
        <div className="card p-8 text-center">
          {" "}
          {status === "loading" && (
            <div className="py-6">
              {" "}
              <Spinner />{" "}
              <p className="mt-4 text-sm text-slate-500">
                Verifying your email...
              </p>{" "}
            </div>
          )}{" "}
          {status === "success" && (
            <div>
              {" "}
              <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl">
                &#10003;
              </div>{" "}
              <h1 className="text-xl font-bold text-slate-900 mb-2">
                Email verified!
              </h1>{" "}
              <p className="text-sm text-slate-500 mb-6">{message}</p>{" "}
              <Link to="/login" className="btn-primary w-full">
                Go to Login
              </Link>{" "}
            </div>
          )}{" "}
          {status === "error" && (
            <div>
              {" "}
              <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl">
                &#10007;
              </div>{" "}
              <h1 className="text-xl font-bold text-slate-900 mb-2">
                Verification failed
              </h1>{" "}
              <p className="text-sm text-slate-500 mb-6">
                {message || "The verification link is invalid or has expired."}
              </p>{" "}
              <form onSubmit={handleResend} className="space-y-3 text-left">
                {" "}
                <label className="label" htmlFor="resendEmail">
                  Resend verification email
                </label>{" "}
                <input
                  id="resendEmail"
                  type="email"
                  required
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />{" "}
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full"
                >
                  {" "}
                  {sending ? "Sending..." : "Resend Verification Link"}{" "}
                </button>{" "}
              </form>{" "}
              {resent && (
                <p className="mt-3 text-sm text-green-600">
                  A new verification link has been sent. Please check your
                  inbox.
                </p>
              )}{" "}
            </div>
          )}{" "}
          <p className="mt-6 text-sm text-slate-500">
            {" "}
            <Link
              to="/login"
              className="text-brand-600 font-medium hover:underline"
            >
              Back to login
            </Link>{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default VerifyEmailPage;
