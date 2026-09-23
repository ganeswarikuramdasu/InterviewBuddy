import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { CrtTestResult } from "../types";
import LoadingState from "../components/LoadingState";

const StatBox: React.FC<{
  label: string;
  value: React.ReactNode;
  color?: string;
}> = ({ label, value, color }) => (
  <div className="text-center">
    <p className={`text-2xl font-bold ${color ?? "text-slate-900"}`}>{value}</p>
    <p className="text-xs text-slate-500 mt-1">{label}</p>
  </div>
);

const CrtTestResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<CrtTestResult | null>(
    (location.state as any)?.result ?? null,
  );

  useEffect(() => {
    if (!result) {
      // No state (e.g. page refresh): send the user back rather than showing a broken page.
      const t = setTimeout(() => navigate("/crt"), 50);
      return () => clearTimeout(t);
    }
  }, [result, navigate]);

  if (!result) return <LoadingState label="Redirecting..." />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">
        {result.testTitle} — Results
      </h1>

      <div className="card p-8 mt-6 text-center">
        <p className="text-5xl font-extrabold text-brand-600">
          {result.score}%
        </p>
        <p className="text-slate-500 mt-1">Overall Score</p>
        <div className="grid grid-cols-4 gap-4 mt-8">
          <StatBox
            label="Correct"
            value={result.correctCount}
            color="text-emerald-600"
          />
          <StatBox
            label="Incorrect"
            value={result.incorrectCount}
            color="text-red-600"
          />
          <StatBox
            label="Unanswered"
            value={result.unansweredCount}
            color="text-slate-400"
          />
          <StatBox label="Accuracy" value={`${result.accuracy}%`} />
        </div>
        <p className="text-xs text-slate-400 mt-6">
          Time taken: {Math.floor(result.timeTakenSeconds / 60)}m{" "}
          {result.timeTakenSeconds % 60}s
        </p>
      </div>

      {result.questionReviews.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="font-semibold text-slate-900">Question Review</h2>
          {result.questionReviews.map((q, i) => (
            <div key={q.questionId} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium text-slate-900">
                  {i + 1}. {q.questionText}
                </p>
                <span
                  className={`badge shrink-0 ${q.correct ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                >
                  {q.correct ? "Correct" : "Incorrect"}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Your answer:{" "}
                <span className="font-medium">
                  {q.selectedOption ?? "Not answered"}
                </span>{" "}
                · Correct answer:{" "}
                <span className="font-medium">{q.correctOption}</span>
              </p>
              {q.explanation && (
                <p className="text-sm text-slate-500 mt-2">{q.explanation}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <button onClick={() => navigate("/crt")} className="btn-primary mt-8">
        Back to CRT
      </button>
    </div>
  );
};

export default CrtTestResultPage;
