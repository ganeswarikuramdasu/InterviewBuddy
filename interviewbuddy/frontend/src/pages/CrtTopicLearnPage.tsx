import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { crtApi } from "../api/crt";
import type { CrtTopic } from "../types";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { getErrorMessage } from "../api/client";
const Section: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => {
  if (!content) return null;
  return (
    <div className="mb-6">
      {" "}
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>{" "}
      <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
        {content}
      </p>{" "}
    </div>
  );
};
const CrtTopicLearnPage: React.FC = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<CrtTopic | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!topicId) return;
    crtApi
      .getTopic(Number(topicId))
      .then(setTopic)
      .catch((e) => setError(getErrorMessage(e)));
  }, [topicId]);
  if (error) return <ErrorState message={error} />;
  if (!topic) return <LoadingState />;
  return (
    <div className="max-w-3xl">
      {" "}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-slate-500 hover:underline mb-4"
      >
        &larr; Back
      </button>{" "}
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{topic.title}</h1>{" "}
      <div className="card p-6">
        {" "}
        <Section title="Explanation" content={topic.explanation} />{" "}
        <Section title="Key Concepts" content={topic.concepts} />{" "}
        <Section title="Formulas" content={topic.formulas} />{" "}
        <Section title="Examples" content={topic.examples} />{" "}
        <Section title="Tips" content={topic.tips} />{" "}
      </div>{" "}
      <button
        onClick={() => navigate(`/crt/topics/${topic.id}/practice`)}
        className="btn-primary mt-6"
      >
        {" "}
        Practice this topic &rarr;{" "}
      </button>{" "}
    </div>
  );
};
export default CrtTopicLearnPage;
