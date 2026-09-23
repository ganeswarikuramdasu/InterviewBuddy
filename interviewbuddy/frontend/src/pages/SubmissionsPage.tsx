import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/Badge";
import { codingApi } from "../api/coding";
import { getErrorMessage } from "../api/client";
import type { ProblemProgress, CodingStatus } from "../types";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

const STATUS_LABEL: Record<CodingStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  SOLVED: "Solved",
};

const statusColor: Record<CodingStatus, string> = {
  NOT_STARTED: "text-slate-400",
  IN_PROGRESS: "text-amber-600",
  SOLVED: "text-emerald-600",
};

const MyProgressPage: React.FC = () => {
  const [data, setData] = useState<ProblemProgress[] | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    setError("");
    codingApi
      .listProgress()
      .then(setData)
      .catch((e) => setError(getErrorMessage(e)));
  };

  useEffect(load, []);

  const solved = data?.filter((d) => d.status === "SOLVED").length ?? 0;
  const inProgress =
    data?.filter((d) => d.status === "IN_PROGRESS").length ?? 0;

  return (
    <div>
      <Link to="/coding" className="text-sm text-slate-500 hover:underline">
        &larr; Back to Coding
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mt-4">My Progress</h1>
      <p className="text-slate-500 mt-1">
        Track every problem you're working through across your sheets.
      </p>

      {data && data.length > 0 && (
        <div className="flex gap-4 mt-6">
          <div className="card px-5 py-4 flex-1">
            <div className="text-3xl font-bold text-emerald-600">{solved}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">
              Solved
            </div>
          </div>
          <div className="card px-5 py-4 flex-1">
            <div className="text-3xl font-bold text-amber-600">
              {inProgress}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wide mt-1">
              In Progress
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6">
          <ErrorState message={error} onRetry={load} />
        </div>
      )}
      {!error && !data && (
        <div className="mt-6">
          <LoadingState />
        </div>
      )}
      {!error && data && data.length === 0 && (
        <div className="mt-6">
          <EmptyState
            title="No progress yet"
            description="Open a problem and mark it as in progress or solved to start tracking."
          />
        </div>
      )}

      {!error && data && data.length > 0 && (
        <div className="mt-6 card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Problem</th>
                <th className="text-left px-5 py-3">Pattern</th>
                <th className="text-left px-5 py-3">Platform</th>
                <th className="text-left px-5 py-3">Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((p) => (
                <tr key={p.problemId} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <span
                      className={`font-bold text-xs uppercase ${statusColor[p.status]}`}
                    >
                      {STATUS_LABEL[p.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      to={`/coding/problems/${p.problemSlug}`}
                      className="font-medium text-slate-900 hover:text-brand-600"
                    >
                      {p.problemTitle}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {p.patternName ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{p.platform}</td>
                  <td className="px-5 py-3">
                    <Badge label={p.difficulty} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyProgressPage;
