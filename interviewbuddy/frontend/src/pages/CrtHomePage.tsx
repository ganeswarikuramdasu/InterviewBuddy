import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { crtApi } from "../api/crt";
import type { CrtCategory } from "../types";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { getErrorMessage } from "../api/client";
const icons: Record<string, string> = {
  APTITUDE: "\u{1F522}",
  REASONING: "\u{1F9E9}",
  VERBAL: "\u{1F4AC}",
};
const CrtHomePage: React.FC = () => {
  const [categories, setCategories] = useState<CrtCategory[] | null>(null);
  const [error, setError] = useState("");
  const load = () => {
    setError("");
    crtApi
      .listCategories()
      .then(setCategories)
      .catch((e) => setError(getErrorMessage(e)));
  };
  useEffect(load, []);
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!categories) return <LoadingState label="Loading CRT categories..." />;
  return (
    <div>
      {" "}
      <h1 className="text-2xl font-bold text-slate-900">
        Campus Recruitment Training (CRT)
      </h1>{" "}
      <p className="text-slate-500 mt-1">
        Master Aptitude, Reasoning, and Verbal Ability through Learn, Practice,
        and Tests.
      </p>{" "}
      <div className="grid sm:grid-cols-3 gap-6 mt-8">
        {" "}
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/crt/categories/${c.id}`}
            className="card p-6 hover:shadow-md transition-shadow"
          >
            {" "}
            <div className="h-12 w-12 rounded-lg bg-brand-50 flex items-center justify-center text-2xl mb-4">
              {icons[c.name] ?? "\u{1F4DA}"}
            </div>{" "}
            <h2 className="font-semibold text-lg text-slate-900">
              {c.displayName}
            </h2>{" "}
            <p className="text-sm text-slate-500 mt-2">{c.description}</p>{" "}
            <div className="mt-4 flex gap-4 text-xs text-slate-400">
              {" "}
              <span>{c.topicCount} topics</span>{" "}
              <span>{c.questionCount} questions</span>{" "}
            </div>{" "}
          </Link>
        ))}{" "}
      </div>{" "}
    </div>
  );
};
export default CrtHomePage;
