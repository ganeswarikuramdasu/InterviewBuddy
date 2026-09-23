import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { crtApi } from "../api/crt";
import type { CrtQuestionPractice, CrtPracticeResult } from "../types";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { getErrorMessage } from "../api/client";
const CrtPracticePage: React.FC = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<CrtQuestionPractice[] | null>(
    null,
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<CrtPracticeResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [score, setScore] = useState({ correct: 0, attempted: 0 });
  useEffect(() => {
    if (!topicId) return;
    crtApi
      .getPracticeQuestions(Number(topicId))
      .then(setQuestions)
      .catch((e) => setError(getErrorMessage(e)));
  }, [topicId]);
  if (error) return <ErrorState message={error} />;
  if (!questions) return <LoadingState />;
  if (questions.length === 0) {
    return (
      <EmptyState
        title="No practice questions yet"
        description="This topic doesn't have practice questions yet."
      />
    );
  }
  const current = questions[index];
  const isLast = index === questions.length - 1;
  const submit = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const res = await crtApi.submitPractice(current.id, selected);
      setResult(res);
      setScore((s) => ({
        correct: s.correct + (res.correct ? 1 : 0),
        attempted: s.attempted + 1,
      }));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };
  const next = () => {
    setResult(null);
    setSelected(null);
    if (isLast) {
      navigate(-1);
    } else {
      setIndex((i) => i + 1);
    }
  };
  const options: [string, string][] = [
    ["A", current.optionA],
    ["B", current.optionB],
    ["C", current.optionC],
    ["D", current.optionD],
  ];
  return (
    <div className="max-w-2xl">
      {" "}
      <div className="flex items-center justify-between mb-4">
        {" "}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-500 hover:underline"
        >
          &larr; Back
        </button>{" "}
        <span className="text-sm text-slate-500">
          Question {index + 1} of {questions.length} · Score {score.correct}/
          {score.attempted}
        </span>{" "}
      </div>{" "}
      <div className="card p-6">
        {" "}
        <p className="text-base font-medium text-slate-900 mb-6">
          {current.questionText}
        </p>{" "}
        <div className="space-y-3">
          {" "}
          {options.map(([key, text]) => {
            const isSelected = selected === key;
            const isCorrectAnswer = result && result.correctOption === key;
            const isWrongSelected = result && isSelected && !result.correct;
            return (
              <button
                key={key}
                disabled={!!result}
                onClick={() => setSelected(key)}
                className={`w-full text-left rounded-lg border-2 px-4 py-3 text-sm transition-colors ${isCorrectAnswer ? "border-emerald-500 bg-emerald-50" : isWrongSelected ? "border-red-500 bg-red-50" : isSelected ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:border-slate-300"} ${result ? "cursor-default" : "cursor-pointer"}`}
              >
                {" "}
                <span className="font-semibold mr-2">{key}.</span>
                {text}{" "}
              </button>
            );
          })}{" "}
        </div>{" "}
        {result && (
          <div
            className={`mt-5 rounded-lg p-4 text-sm ${result.correct ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}
          >
            {" "}
            <p className="font-semibold">
              {result.correct ? "Correct!" : "Not quite."}
            </p>{" "}
            {result.explanation && (
              <p className="mt-1">{result.explanation}</p>
            )}{" "}
          </div>
        )}{" "}
        <div className="mt-6 flex justify-end gap-3">
          {" "}
          {!result ? (
            <button
              onClick={submit}
              disabled={!selected || submitting}
              className="btn-primary"
            >
              {" "}
              {submitting ? "Checking..." : "Submit Answer"}{" "}
            </button>
          ) : (
            <button onClick={next} className="btn-primary">
              {isLast ? "Finish" : "Next Question"}
            </button>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default CrtPracticePage;
