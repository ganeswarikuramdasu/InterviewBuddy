import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { codingApi } from "../api/coding";
import type { CodingProblemDetail, CodingStatus } from "../types";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import Badge from "../components/Badge";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";

const STATUS_LABEL: Record<CodingStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  SOLVED: "Solved",
};

const CodingProblemPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [problem, setProblem] = useState<CodingProblemDetail | null>(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!slug) return;
    codingApi
      .getProblem(slug)
      .then(setProblem)
      .catch((e) => setError(getErrorMessage(e)));
  }, [slug]);

  if (error)
    return <ErrorState message={error} onRetry={() => navigate("/coding")} />;
  if (!problem) return <LoadingState />;

  // Opening the external problem auto-marks it as "In Progress" and opens in a new tab.
  const openExternal = async () => {
    try {
      const updated = await codingApi.start(problem.id);
      setProblem(updated);
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    } finally {
      window.open(problem.externalUrl ?? "", "_blank", "noopener,noreferrer");
    }
  };

  // Tick to mark solved, un-tick to reset.
  const toggleSolved = async (checked: boolean) => {
    setUpdating(true);
    try {
      const status: CodingStatus = checked ? "SOLVED" : "NOT_STARTED";
      const updated = await codingApi.updateStatus(problem.id, status);
      setProblem(updated);
      showToast(
        checked ? "Marked as solved!" : "Marked as not started",
        "success",
      );
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    } finally {
      setUpdating(false);
    }
  };

  const isSolved = problem.status === "SOLVED";

  return (
    <div>
      <Link
        to="/coding"
        className="text-sm text-slate-500 hover:underline mb-4 inline-block"
      >
        &larr; All Problems
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">
              {problem.title}
            </h1>
            <Badge label={problem.difficulty} />
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
            {problem.patternName && (
              <span>
                Pattern:{" "}
                <span className="text-slate-700 font-medium">
                  {problem.patternName}
                </span>
              </span>
            )}
            {problem.sheetName && (
              <span>
                Sheet:{" "}
                <span className="text-slate-700 font-medium">
                  {problem.sheetName}
                </span>
              </span>
            )}
            <span>
              Platform:{" "}
              <span className="text-slate-700 font-medium">
                {problem.platform}
              </span>
            </span>
          </div>
        </div>
        <div className="card px-4 py-3 bg-white flex items-center gap-3">
          <span
            className={`text-sm font-semibold uppercase ${
              isSolved
                ? "text-emerald-600"
                : problem.status === "IN_PROGRESS"
                  ? "text-amber-600"
                  : "text-slate-400"
            }`}
          >
            {STATUS_LABEL[problem.status]}
          </span>
        </div>
      </div>

      {problem.externalUrl && (
        <button
          onClick={openExternal}
          className="btn-primary inline-flex mt-4"
        >
          Solve on {problem.platform.toLowerCase()} &rarr;
        </button>
      )}

      <div className="card p-6 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              {problem.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {problem.patternName ? `${problem.patternName} · ` : ""}
              {problem.platform.toLowerCase()}
            </p>
          </div>
          {problem.externalUrl && (
            <button onClick={openExternal} className="btn-primary inline-flex">
              Open on {problem.platform.toLowerCase()} &rarr;
            </button>
          )}
        </div>
        <div className="mt-4 text-sm text-slate-500">
          The problem statement, examples, and editor are on the external
          platform. Opening it will mark it as In Progress automatically. Tick
          the box below once you have solved it.
        </div>
      </div>

      <div className="card p-6 mt-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Track your progress
        </h3>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isSolved}
            disabled={updating}
            onChange={(e) => toggleSolved(e.target.checked)}
            className="h-5 w-5 rounded accent-indigo-600"
          />
          <span className="text-sm font-medium text-slate-800">
            I have solved this problem
          </span>
        </label>
        <p className="text-xs text-slate-400 mt-3">
          Opening the problem marks it as In Progress. Tick the box to mark it
          as solved once you finish it on the external platform.
        </p>
      </div>
    </div>
  );
};

export default CodingProblemPage;
