import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const navItems = [
  { to: "/admin", label: "Dashboard", icon: "\u2302", end: true },
  { to: "/admin/users", label: "Users", icon: "\u{1F465}" },
  { to: "/admin/crt", label: "CRT", icon: "\u{1F4DA}" },
  { to: "/admin/coding", label: "Coding Problems", icon: "\u2328" },
  { to: "/admin/interviews", label: "Interview Questions", icon: "\u{1F399}" },
];
const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };
  return (
    <div className="min-h-screen flex bg-slate-50">
      {" "}
      <aside className="hidden md:flex md:flex-col w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white sticky top-0 h-screen">
        {" "}
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          {" "}
          <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-sm">
            IB
          </span>{" "}
          <span className="font-extrabold">Admin Panel</span>{" "}
        </div>{" "}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {" "}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white"}`
              }
            >
              {" "}
              <span className="text-base">{item.icon}</span> {item.label}{" "}
            </NavLink>
          ))}{" "}
        </nav>{" "}
        <div className="p-4 border-t border-white/10">
          {" "}
          <div className="flex items-center gap-3 mb-3">
            {" "}
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-sm font-semibold">
              {" "}
              {user?.fullName?.charAt(0).toUpperCase()}{" "}
            </div>{" "}
            <div className="min-w-0">
              {" "}
              <p className="text-sm font-medium truncate">
                {user?.fullName}
              </p>{" "}
              <p className="text-xs text-slate-400 truncate">
                {user?.email}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg text-sm font-semibold bg-white/10 text-white hover:bg-white/20"
          >
            {" "}
            Log Out{" "}
          </button>{" "}
        </div>{" "}
      </aside>{" "}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900 to-slate-800 text-white h-14 flex items-center justify-between px-4">
        {" "}
        <div className="flex items-center gap-2 font-extrabold">
          {" "}
          <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-xs">
            IB
          </span>{" "}
          Admin{" "}
        </div>{" "}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="text-2xl leading-none"
          aria-label="Toggle menu"
        >
          &#9776;
        </button>{" "}
      </div>{" "}
      {mobileOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-40 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-lg p-3 space-y-1">
          {" "}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${isActive ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white" : "text-slate-300 hover:bg-white/10"}`
              }
            >
              {" "}
              <span>{item.icon}</span>
              {item.label}{" "}
            </NavLink>
          ))}{" "}
          <button
            onClick={handleLogout}
            className="w-full mt-2 px-4 py-2 rounded-lg text-sm font-semibold bg-white/10 text-white hover:bg-white/20"
          >
            {" "}
            Log Out{" "}
          </button>{" "}
        </div>
      )}{" "}
      <main className="flex-1 min-w-0 md:pt-0 pt-14">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {" "}
          <Outlet />{" "}
        </div>{" "}
      </main>{" "}
    </div>
  );
};
export default AdminLayout;
