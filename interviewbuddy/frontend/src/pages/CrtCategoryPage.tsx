import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { crtApi } from "../api/crt";
import type { CrtTopic, CrtTest } from "../types";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
type Tab = "learn" | "practice" | "tests";
const CrtCategoryPage: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>("learn");
  const [topics, setTopics] = useState<CrtTopic[] | null>(null);
  const [tests, setTests] = useState<CrtTest[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!categoryId) return;
    setError("");
    setTopics(null);
    crtApi
      .listTopics(Number(categoryId))
      .then(setTopics)
      .catch((e) => setError(getErrorMessage(e)));
  }, [categoryId]);
  useEffect(() => {
    if (tab !== "tests" || !categoryId) return;
    crtApi
      .listTests(Number(categoryId))
      .then(setTests)
      .catch((e) => setError(getErrorMessage(e)));
  }, [tab, categoryId]);
  const startTest = async (testId: number) => {
    try {
      const attempt = await crtApi.startTest(testId);
      navigate(`/crt/attempts/${attempt.attemptId}/take`, {
        state: { attempt },
      });
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };
  if (error)
    return (
      <ErrorState message={error} onRetry={() => window.location.reload()} />
    );
  return (
    <div>
      {" "}
      <button
        onClick={() => navigate("/crt")}
        className="text-sm text-slate-500 hover:underline mb-4"
      >
        &larr; Back to CRT
      </button>{" "}
      <div className="flex gap-2 border-b border-slate-200 mb-6">
        {" "}
        {(["learn", "practice", "tests"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            {" "}
            {t}{" "}
          </button>
        ))}{" "}
      </div>{" "}
      {(tab === "learn" || tab === "practice") &&
        (!topics ? (
          <LoadingState />
        ) : topics.length === 0 ? (
          <EmptyState
            title="No topics yet"
            description="Topics for this category haven't been added yet."
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {" "}
            {topics.map((t) => (
              <Link
                key={t.id}
                to={
                  tab === "learn"
                    ? `/crt/topics/${t.id}/learn`
                    : `/crt/topics/${t.id}/practice`
                }
                className="card p-5 hover:shadow-md transition-shadow"
              >
                {" "}
                <h3 className="font-semibold text-slate-900">{t.title}</h3>{" "}
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                  {t.explanation}
                </p>{" "}
                <p className="text-xs text-slate-400 mt-3">
                  {t.questionCount} questions
                </p>{" "}
              </Link>
            ))}{" "}
          </div>
        ))}{" "}
      {tab === "tests" &&
        (!tests ? (
          <LoadingState />
        ) : tests.length === 0 ? (
          <EmptyState
            title="No tests available"
            description="Tests for this category haven't been published yet."
          />
        ) : (
          <div className="space-y-4">
            {" "}
            {tests.map((t) => (
              <div
                key={t.id}
                className="card p-5 flex items-center justify-between flex-wrap gap-4"
              >
                {" "}
                <div>
                  {" "}
                  <div className="flex items-center gap-2">
                    {" "}
                    <h3 className="font-semibold text-slate-900">
                      {t.title}
                    </h3>{" "}
                    <Badge label={t.difficulty} />{" "}
                  </div>{" "}
                  <p className="text-sm text-slate-500 mt-1">{t.description}</p>{" "}
                  <p className="text-xs text-slate-400 mt-2">
                    {t.questionCount} questions · {t.durationMinutes} minutes
                  </p>{" "}
                </div>{" "}
                <button onClick={() => startTest(t.id)} className="btn-primary">
                  Start Test
                </button>{" "}
              </div>
            ))}{" "}
          </div>
        ))}{" "}
    </div>
  );
};
export default CrtCategoryPage;
