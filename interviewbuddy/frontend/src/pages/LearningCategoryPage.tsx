import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { learningApi } from "../api/learning";
import type { LearningResource, ResourceType } from "../types";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";

const typeIcons: Record<string, string> = {
  ARTICLE: "\u{1F4C4}",
  VIDEO: "\u{1F3A5}",
  COURSE: "\u{1F393}",
  NOTES: "\u{1F4DD}",
  EXTERNAL_LINK: "\u{1F517}",
};

const emptyForm = {
  title: "",
  description: "",
  resourceType: "EXTERNAL_LINK" as ResourceType,
  contentUrl: "",
  contentBody: "",
};

const LearningCategoryPage: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [resources, setResources] = useState<LearningResource[] | null>(null);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LearningResource | null>(
    null,
  );

  const load = () => {
    if (!categoryId) return;
    learningApi
      .listResources(Number(categoryId))
      .then(setResources)
      .catch((e) => setError(getErrorMessage(e)));
  };
  useEffect(load, [categoryId]);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!resources) return <LoadingState />;

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (r: LearningResource) => {
    setEditingId(r.id);
    setForm({
      title: r.title,
      description: r.description ?? "",
      resourceType: r.resourceType,
      contentUrl: r.contentUrl ?? "",
      contentBody: r.contentBody ?? "",
    });
    setModalOpen(true);
  };

  const save = async () => {
    if (!categoryId) return;
    setSaving(true);
    try {
      const payload = { ...form, categoryId: Number(categoryId) };
      if (editingId != null) {
        await learningApi.updateResource(editingId, payload);
        showToast("Resource updated", "success");
      } else {
        await learningApi.createResource(payload);
        showToast("Resource added", "success");
      }
      setModalOpen(false);
      load();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await learningApi.deleteResource(deleteTarget.id);
      showToast("Resource deleted", "success");
      setDeleteTarget(null);
      load();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <button
          onClick={() => navigate("/learning")}
          className="text-sm text-slate-500 hover:underline"
        >
          &larr; Back to Learning
        </button>
        <button onClick={openAdd} className="btn-primary">
          + Add Resource
        </button>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        {resources[0]?.categoryName ?? "My Resources"}
      </h1>
      {resources.length === 0 ? (
        <EmptyState
          title="No resources yet"
          description="Add a link, video, or course that you are learning from."
        />
      ) : (
        <div className="space-y-3">
          {resources.map((r) => (
            <div
              key={r.id}
              className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">
                {typeIcons[r.resourceType] ?? "\u{1F4C4}"}
              </span>
              <Link
                to={`/learning/resources/${r.id}`}
                className="flex-1 min-w-0"
              >
                <p className="font-medium text-slate-900 truncate">
                  {r.title}
                </p>
                {r.description && (
                  <p className="text-sm text-slate-500 line-clamp-1">
                    {r.description}
                  </p>
                )}
              </Link>
              {r.completedByCurrentUser && (
                <span className="text-emerald-600 font-bold text-lg">
                  &#10003;
                </span>
              )}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(r)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(r)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId != null ? "Edit Resource" : "Add Resource"}
        wide
      >
        <div className="space-y-3">
          <input
            className="input"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="input h-16"
            placeholder="Short description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <select
            className="input"
            value={form.resourceType}
            onChange={(e) =>
              setForm({
                ...form,
                resourceType: e.target.value as ResourceType,
              })
            }
          >
            <option value="EXTERNAL_LINK">Link / Website</option>
            <option value="VIDEO">Video</option>
            <option value="COURSE">Course</option>
            <option value="ARTICLE">Article</option>
            <option value="NOTES">Notes</option>
          </select>
          <input
            className="input"
            placeholder="Link / URL (paste the website, video, or course link)"
            value={form.contentUrl}
            onChange={(e) =>
              setForm({ ...form, contentUrl: e.target.value })
            }
          />
          <textarea
            className="input h-24"
            placeholder="Notes (optional)"
            value={form.contentBody}
            onChange={(e) => setForm({ ...form, contentBody: e.target.value })}
          />
          <button onClick={save} disabled={saving} className="btn-primary w-full">
            {saving ? "Saving..." : editingId != null ? "Save Changes" : "Add Resource"}
          </button>
        </div>
      </Modal>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete resource?"
        description={deleteTarget?.title}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default LearningCategoryPage;
