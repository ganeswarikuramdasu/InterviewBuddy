import React, { useEffect, useState } from "react";
import { dashboardApi } from "../../api/dashboard";
import type { AdminDashboard } from "../../types";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { getErrorMessage } from "../../api/client";

const StatCard: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="card p-5">
    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
      {label}
    </p>
    <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    setError("");
    dashboardApi
      .getAdminDashboard()
      .then(setData)
      .catch((e) => setError(getErrorMessage(e)));
  };

  useEffect(load, []);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return <LoadingState />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="text-slate-500 mt-1">
        Platform-wide statistics and recent activity.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard label="Total Users" value={data.totalUsers} />
        <StatCard label="Admins" value={data.totalAdmins} />
        <StatCard label="Coding Problems" value={data.totalCodingProblems} />
        <StatCard label="CRT Questions" value={data.totalCrtQuestions} />
        <StatCard
          label="Interview Sessions"
          value={data.totalInterviewSessions}
        />
        <StatCard
          label="Learning Resources"
          value={data.totalLearningResources}
        />
        <StatCard label="Total Submissions" value={data.totalSubmissions} />
      </div>

      <div className="card p-6 mt-8">
        <h2 className="font-semibold text-slate-900 mb-4">
          Recent Registrations
        </h2>
        {data.recentRegistrations.length === 0 ? (
          <p className="text-sm text-slate-500">No registrations yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.recentRegistrations.map((u) => (
              <li
                key={u.id}
                className="py-3 flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">{u.fullName}</p>
                  <p className="text-slate-500 text-xs">{u.email}</p>
                </div>
                <span className="text-xs text-slate-400">{u.createdAt}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
