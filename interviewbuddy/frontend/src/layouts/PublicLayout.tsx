import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-extrabold text-lg text-slate-900"
          >
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-sm">
              IB
            </span>
            InterviewBuddy
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900">
              Features
            </a>
            <a href="#crt" className="hover:text-slate-900">
              CRT
            </a>
            <a href="#coding" className="hover:text-slate-900">
              Coding
            </a>
            <a href="#interviews" className="hover:text-slate-900">
              AI Interviews
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                className="btn-primary"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Log In
                </Link>
                <Link to="/register" className="btn-primary">
                  Start Preparing
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-extrabold text-lg text-white mb-3">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-sm">
                IB
              </span>
              InterviewBuddy
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              AI-powered interview and placement preparation platform for CRT,
              coding sheets, AI mock interviews, and learning resources.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/register" className="hover:text-white">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white">
                  Log In
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-white">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Modules</h4>
            <ul className="space-y-2 text-sm">
              <li>CRT Preparation</li>
              <li>Coding Sheets &amp; Patterns</li>
              <li>AI Interviews</li>
              <li>Learning Resources</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} InterviewBuddy. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
