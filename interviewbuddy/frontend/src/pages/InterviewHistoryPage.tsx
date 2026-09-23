import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { interviewsApi } from "../api/interviews";
import type { InterviewSessionResult } from "../types";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { getErrorMessage } from "../api/client";
const InterviewHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<InterviewSessionResult[] | null>(
    null,
  );
  const [error, setError] = useState("");
  const load = () => {
    setError("");
    interviewsApi
      .history()
      .then(setSessions)
      .catch((e) => setError(getErrorMessage(e)));
  };
  useEffect(load, []);
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!sessions) return <LoadingState />;
  return (
    <div>
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <h1 className="text-2xl font-bold text-slate-900">
          Interview History
        </h1>{" "}
        <Link to="/interviews" className="btn-primary">
          New Interview
        </Link>{" "}
      </div>{" "}
      {sessions.length === 0 ? (
        <EmptyState
          title="No interviews yet"
          description="Start your first AI mock interview to see your history here."
        />
      ) : (
        <div className="mt-6 space-y-3">
          {" "}
          {sessions.map((s) => (
            <button
              key={s.sessionId}
              onClick={() => navigate(`/interviews/${s.sessionId}/result`)}
              className="card p-5 w-full text-left flex items-center justify-between hover:shadow-md transition-shadow"
            >
              {" "}
              <div>
                {" "}
                <p className="font-semibold text-slate-900">
                  {s.role} &mdash; {s.interviewType}
                </p>{" "}
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(s.startedAt).toLocaleString()} · {s.status}
                </p>{" "}
              </div>{" "}
              <span className="text-xl font-bold text-brand-600">
                {s.overallScore ?? "-"}
              </span>{" "}
            </button>
          ))}{" "}
        </div>
      )}{" "}
    </div>
  );
};
export default InterviewHistoryPage;
