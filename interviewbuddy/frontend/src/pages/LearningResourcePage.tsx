import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { learningApi } from "../api/learning";
import type { LearningResource } from "../types";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import ConfirmDialog from "../components/ConfirmDialog";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";

const LearningResourcePage: React.FC = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [resource, setResource] = useState<LearningResource | null>(null);
  const [error, setError] = useState("");
  const [marking, setMarking] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const load = () => {
    if (!resourceId) return;
    learningApi
      .getResource(Number(resourceId))
      .then(setResource)
      .catch((e) => setError(getErrorMessage(e)));
  };
  useEffect(load, [resourceId]);

  if (error) return <ErrorState message={error} />;
  if (!resource) return <LoadingState />;

  const markCompleted = async () => {
    setMarking(true);
    try {
      await learningApi.markCompleted(resource.id);
      showToast("Updated!", "success");
      load();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    } finally {
      setMarking(false);
    }
  };

  const handleDelete = async () => {
    try {
      await learningApi.deleteResource(resource.id);
      showToast("Resource deleted", "success");
      navigate(-1);
    } catch (e) {
      showToast(getErrorMessage(e), "error");
      setDeleteOpen(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-slate-500 hover:underline mb-4"
      >
        &larr; Back
      </button>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="badge bg-brand-100 text-brand-700">
            {resource.resourceType.replace(/_/g, " ")}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-3">
            {resource.title}
          </h1>
          {resource.description && (
            <p className="text-slate-500 mt-1">{resource.description}</p>
          )}
        </div>
      </div>
      <div className="card p-6 mt-6">
        {resource.contentBody && (
          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
            {resource.contentBody}
          </p>
        )}
        {resource.contentUrl && (
          <a
            href={resource.contentUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary mt-4 inline-flex"
          >
            Open Resource &rarr;
          </a>
        )}
      </div>
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={markCompleted}
          disabled={marking}
          className="btn-primary"
        >
          {resource.completedByCurrentUser
            ? "Mark as Not Completed"
            : marking
              ? "Saving..."
              : "Mark as Completed"}
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          className="text-sm text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
      <ConfirmDialog
        open={deleteOpen}
        title="Delete resource?"
        description={resource.title}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
};

export default LearningResourcePage;
