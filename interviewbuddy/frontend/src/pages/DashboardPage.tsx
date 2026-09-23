import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardApi } from "../api/dashboard";
import type { UserDashboard } from "../types";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";

const StatCard: React.FC<{
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent?: string;
}> = ({ label, value, sub, accent }) => (
  <div className="card p-5">
    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
      {label}
    </p>
    <p className={`mt-2 text-2xl font-bold ${accent ?? "text-slate-900"}`}>
      {value}
    </p>
    {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
  </div>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<UserDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    dashboardApi
      .getUserDashboard()
      .then(setData)
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <LoadingState label="Loading your dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return null;

  const learningPct =
    data.totalLearningResources === 0
      ? 0
      : Math.round(
          (data.learningResourcesCompleted / data.totalLearningResources) * 100,
        );

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Welcome back, {user?.fullName.split(" ")[0]}!
      </h1>
      <p className="text-slate-500 mt-1">
        Here&apos;s a snapshot of your placement preparation progress.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard
          label="CRT Accuracy"
          value={`${data.crtAccuracy}%`}
          sub={`${data.crtPracticeCorrect}/${data.crtPracticeAttempts} correct`}
        />
        <StatCard
          label="Problems Solved"
          value={data.problemsSolved}
          sub={`${data.totalSubmissions} total submissions`}
        />
        <StatCard
          label="Interview Avg Score"
          value={
            data.interviewsCompleted ? `${data.averageInterviewScore}` : "—"
          }
          sub={`${data.interviewsCompleted} completed`}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold text-slate-900 mb-4">Recent Activity</h2>
          {data.recentActivity.length === 0 ? (
            <p className="text-sm text-slate-500">
              No activity yet — start a CRT test, solve a problem, or try a mock
              interview.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.recentActivity.map((a, i) => (
                <li
                  key={i}
                  className="py-3 flex items-center justify-between text-sm"
                >
                  <span className="text-slate-700">{a.description}</span>
                  <span className="text-slate-400 text-xs">{a.timestamp}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            Learning Progress
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                <path
                  className="text-slate-100"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-brand-600"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${learningPct}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900">
                {learningPct}%
              </span>
            </div>
            <div className="text-sm text-slate-600">
              {data.learningResourcesCompleted} of {data.totalLearningResources}{" "}
              resources completed
            </div>
          </div>
          <Link to="/learning" className="btn-secondary w-full mt-4">
            Browse Resources
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <Link to="/crt" className="card p-5 hover:shadow-md transition-shadow">
          <p className="font-semibold text-slate-900">Continue CRT Prep</p>
          <p className="text-sm text-slate-500 mt-1">
            {data.crtTestsTaken} tests taken · avg score{" "}
            {data.crtAverageTestScore}%
          </p>
        </Link>
        <Link
          to="/coding"
          className="card p-5 hover:shadow-md transition-shadow"
        >
          <p className="font-semibold text-slate-900">Practice Coding</p>
          <p className="text-sm text-slate-500 mt-1">
            {data.problemsSolved} problems solved so far
          </p>
        </Link>
        <Link
          to="/interviews"
          className="card p-5 hover:shadow-md transition-shadow"
        >
          <p className="font-semibold text-slate-900">Take a Mock Interview</p>
          <p className="text-sm text-slate-500 mt-1">
            AI-evaluated Technical, HR, or Mixed rounds
          </p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
