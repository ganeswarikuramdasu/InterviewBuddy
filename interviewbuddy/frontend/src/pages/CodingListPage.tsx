import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { codingApi } from "../api/coding";
import type {
  CodingProblemSummary,
  CodingSheet,
  CodingPattern,
  DifficultyLevel,
  Page,
  CodingStatus,
} from "../types";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge";
import Pagination from "../components/Pagination";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";

const STATUS_LABEL: Record<CodingStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  SOLVED: "Solved",
};

const statusColor: Record<CodingStatus, string> = {
  NOT_STARTED: "text-slate-300",
  IN_PROGRESS: "text-amber-600",
  SOLVED: "text-emerald-600",
};

const CodingListPage: React.FC = () => {
  const { showToast } = useToast();
  const [sheets, setSheets] = useState<CodingSheet[] | null>(null);
  const [patterns, setPatterns] = useState<CodingPattern[] | null>(null);
  const [data, setData] = useState<Page<CodingProblemSummary> | null>(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel | "">("");
  const [sheetId, setSheetId] = useState<number | null>(null);
  const [patternId, setPatternId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState<number | null>(null);

  // Tick/untick a checkbox in the list to mark a problem solved without opening it.
  const toggleSolved = async (p: CodingProblemSummary, checked: boolean) => {
    setToggling(p.id);
    try {
      const status: CodingStatus = checked ? "SOLVED" : "NOT_STARTED";
      await codingApi.updateStatus(p.id, status);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: prev.content.map((item) =>
            item.id === p.id ? { ...item, status } : item,
          ),
        };
      });
      showToast(
        checked ? "Marked as solved!" : "Marked as not started",
        "success",
      );
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    } finally {
      setToggling(null);
    }
  };

  const loadProblems = (reset = false) => {
    setError("");
    const p = reset ? 0 : page;
    if (reset) setPage(0);
    codingApi
      .listProblems({
        search: search || undefined,
        difficulty: (difficulty || undefined) as DifficultyLevel | undefined,
        sheetId: sheetId ?? undefined,
        patternId: patternId ?? undefined,
        page: p,
        size: 12,
      })
      .then(setData)
      .catch((e) => setError(getErrorMessage(e)));
  };

  useEffect(() => {
    codingApi
      .listSheets()
      .then(setSheets)
      .catch(() => setSheets([]));
    codingApi
      .listPatterns()
      .then(setPatterns)
      .catch(() => setPatterns([]));
  }, []);

  useEffect(() => {
    loadProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, difficulty, sheetId, patternId]);

  useEffect(() => {
    const t = setTimeout(() => loadProblems(true), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  if (!sheets || !patterns) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Coding Sheets &amp; Patterns
          </h1>
          <p className="text-slate-500 mt-1">
            Pick a sheet, filter by pattern, solve problems on external
            platforms, and track your progress.
          </p>
        </div>
        <Link to="/coding/my-progress" className="btn-secondary">
          My Progress
        </Link>
      </div>

      {/* Sheets */}
      {sheets.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Select a Sheet
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sheets.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSheetId(sheetId === s.id ? null : s.id);
                  setPage(0);
                }}
                className={`text-left card p-5 transition-shadow ${
                  sheetId === s.id
                    ? "ring-2 ring-brand-500 border-brand-500"
                    : "hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{s.name}</span>
                  <span className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-full">
                    {s.problemCount} problems
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-2">{s.description}</p>
              </button>
            ))}
            {sheetId !== null && (
              <button
                onClick={() => {
                  setSheetId(null);
                  setPage(0);
                }}
                className="text-left card p-5 border-dashed border-2 border-slate-200 hover:border-slate-300"
              >
                <span className="font-semibold text-slate-400">
                  Clear sheet filter
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mt-6 items-center">
        <input
          className="input max-w-xs"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input max-w-[140px]"
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value as DifficultyLevel | "");
            setPage(0);
          }}
        >
          <option value="">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        {patterns.length > 0 && (
          <select
            className="input max-w-[200px]"
            value={patternId ?? ""}
            onChange={(e) => {
              setPatternId(e.target.value ? Number(e.target.value) : null);
              setPage(0);
            }}
          >
            <option value="">All Patterns</option>
            {patterns.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <div className="mt-6">
          <ErrorState message={error} onRetry={() => loadProblems()} />
        </div>
      )}
      {!error && !data && (
        <div className="mt-6">
          <LoadingState />
        </div>
      )}
      {!error && data && data.content.length === 0 && (
        <div className="mt-6">
          <EmptyState
            title="No problems found"
            description="Try a different sheet, pattern, or filter."
          />
        </div>
      )}

      {!error && data && data.content.length > 0 && (
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
              {data.content.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={p.status === "SOLVED"}
                        disabled={toggling !== null && toggling !== p.id}
                        onChange={(e) => toggleSolved(p, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        title={
                          p.status === "SOLVED"
                            ? "Solved - uncheck to reset"
                            : "Mark as solved"
                        }
                        className="h-4 w-4 rounded accent-emerald-600 cursor-pointer"
                      />
                      <span
                        className={`font-bold text-xs ${statusColor[p.status]} uppercase`}
                      >
                        {STATUS_LABEL[p.status]}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/coding/problems/${p.slug}`}
                        className="font-medium text-slate-900 hover:text-brand-600"
                      >
                        {p.title}
                      </Link>
                      {p.externalUrl && (
                        <a
                          href={p.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Open on ${(p.platform || "").toLowerCase()}`}
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-brand-600 hover:bg-brand-50"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M7 17L17 7" />
                            <path d="M7 7h10v10" />
                          </svg>
                        </a>
                      )}
                    </div>
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

      {data && (
        <div className="mt-4">
          <Pagination
            page={data.number}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default CodingListPage;
