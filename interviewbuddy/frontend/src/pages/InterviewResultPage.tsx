import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { InterviewSessionResult } from "../types";
import LoadingState from "../components/LoadingState";
import { interviewsApi } from "../api/interviews";
import { getErrorMessage } from "../api/client";

const ScoreBar: React.FC<{ label: string; value: number | null }> = ({
  label,
  value,
}) => (
  <div>
    <div className="flex justify-between text-xs text-slate-500 mb-1">
      <span>{label}</span>
      <span>{value ?? 0}/100</span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-brand-600 rounded-full"
        style={{ width: `${value ?? 0}%` }}
      />
    </div>
  </div>
);

const InterviewResultPage: React.FC = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<InterviewSessionResult | null>(
    (location.state as any)?.result ?? null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (result || !sessionId) return;
    interviewsApi
      .getSession(Number(sessionId))
      .then(setResult)
      .catch((e) => setError(getErrorMessage(e)));
  }, [result, sessionId]);

  if (error)
    return (
      <div className="text-center py-16 text-red-600 text-sm">{error}</div>
    );
  if (!result) return <LoadingState />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">
        {result.role} &mdash; {result.interviewType} Interview Results
      </h1>

      <div className="card p-8 mt-6 text-center">
        <p className="text-5xl font-extrabold text-brand-600">
          {result.overallScore ?? 0}
        </p>
        <p className="text-slate-500 mt-1">Overall Score / 100</p>
        <div className="grid grid-cols-2 gap-6 mt-8 max-w-md mx-auto text-left">
          <ScoreBar label="Relevance" value={result.relevanceScore} />
          <ScoreBar label="Technical" value={result.technicalScore} />
          <ScoreBar label="Communication" value={result.communicationScore} />
          <ScoreBar label="Clarity" value={result.clarityScore} />
        </div>
        {result.summaryFeedback && (
          <p className="text-sm text-slate-600 mt-8 max-w-lg mx-auto">
            {result.summaryFeedback}
          </p>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="font-semibold text-slate-900">
          Question-by-Question Feedback
        </h2>
        {result.answers.map((a, i) => (
          <div key={a.answerId} className="card p-5">
            <p className="text-sm font-medium text-slate-900">
              {i + 1}. {a.questionText}
            </p>
            <p className="text-sm text-slate-500 mt-2 italic">
              "{a.answerText || "No answer provided"}"
            </p>
            {a.evaluation && (
              <div className="mt-3 bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
                <p>{a.evaluation.feedback}</p>
                {a.evaluation.improvementSuggestions && (
                  <p className="mt-2 text-slate-500">
                    <span className="font-medium">Improve:</span>{" "}
                    {a.evaluation.improvementSuggestions}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={() => navigate("/interviews")} className="btn-primary">
          Start Another Interview
        </button>
        <button
          onClick={() => navigate("/interviews/history")}
          className="btn-secondary"
        >
          View History
        </button>
      </div>
    </div>
  );
};

export default InterviewResultPage;
