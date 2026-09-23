import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { crtApi } from "../api/crt";
import type { CrtTestAttemptStart } from "../types";
import LoadingState from "../components/LoadingState";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "../components/ConfirmDialog";

const CrtTestAttemptPage: React.FC = () => {
  const { attemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const initial = (location.state as any)?.attempt as
    CrtTestAttemptStart | undefined;
  const [attempt] = useState<CrtTestAttemptStart | undefined>(initial);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const startTime = useRef(Date.now());
  const submittedRef = useRef(false);
  const [secondsLeft, setSecondsLeft] = useState(
    attempt ? attempt.durationMinutes * 60 : 0,
  );

  useEffect(() => {
    if (!attempt) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [attempt]);

  useEffect(() => {
    if (!attempt || submittedRef.current || secondsLeft !== 0) return;
    submittedRef.current = true;
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, attempt]);

  if (!attempt) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <p className="text-slate-600">
          This test session has expired or was opened directly. Please start the
          test again from the CRT section.
        </p>
        <button onClick={() => navigate("/crt")} className="btn-primary mt-4">
          Back to CRT
        </button>
      </div>
    );
  }

  const question = attempt.questions[current];
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const select = (option: string) =>
    setAnswers((a) => ({ ...a, [question.id]: option }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
      const payload = attempt.questions.map((q) => ({
        questionId: q.id,
        selectedOption: answers[q.id] ?? null,
      }));
      const result = await crtApi.submitTest(
        Number(attemptId),
        payload,
        timeTaken,
      );
      navigate(`/crt/results/${attemptId}`, { state: { result } });
    } catch (e) {
      showToast(getErrorMessage(e), "error");
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-slate-900">{attempt.title}</h1>
        <div
          className={`font-mono text-sm font-semibold px-3 py-1.5 rounded-lg ${
            secondsLeft < 60
              ? "bg-red-100 text-red-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {attempt.questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrent(i)}
            className={`h-8 w-8 rounded-md text-xs font-semibold ${
              i === current
                ? "bg-brand-600 text-white"
                : answers[q.id]
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="card p-6">
        <p className="text-xs text-slate-400 mb-2">
          Question {current + 1} of {attempt.questions.length}
        </p>
        <p className="text-base font-medium text-slate-900 mb-6">
          {question.questionText}
        </p>
        <div className="space-y-3">
          {(
            [
              ["A", question.optionA],
              ["B", question.optionB],
              ["C", question.optionC],
              ["D", question.optionD],
            ] as [string, string][]
          ).map(([key, text]) => (
            <button
              key={key}
              onClick={() => select(key)}
              className={`w-full text-left rounded-lg border-2 px-4 py-3 text-sm transition-colors ${
                answers[question.id] === key
                  ? "border-brand-500 bg-brand-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="font-semibold mr-2">{key}.</span>
              {text}
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <button
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
            className="btn-secondary"
          >
            Previous
          </button>
          {current < attempt.questions.length - 1 ? (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              className="btn-secondary"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={submitting}
              className="btn-primary"
            >
              Submit Test
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        {answeredCount} of {attempt.questions.length} answered
      </p>

      <ConfirmDialog
        open={confirmOpen}
        title="Submit test?"
        description={`You've answered ${answeredCount} of ${attempt.questions.length} questions. This cannot be undone.`}
        confirmLabel="Submit"
        onConfirm={() => {
          setConfirmOpen(false);
          handleSubmit();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default CrtTestAttemptPage;
