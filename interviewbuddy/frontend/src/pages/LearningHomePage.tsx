import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { learningApi } from "../api/learning";
import type { LearningCategory } from "../types";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";

const emptyForm = { name: "", description: "" };

const LearningHomePage: React.FC = () => {
  const [categories, setCategories] = useState<LearningCategory[] | null>(null);
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LearningCategory | null>(
    null,
  );

  const load = () => {
    setError("");
    learningApi
      .listCategories()
      .then(setCategories)
      .catch((e) => setError(getErrorMessage(e)));
  };
  useEffect(load, []);
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!categories) return <LoadingState />;

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (c: LearningCategory) => {
    setEditingId(c.id);
    setForm({ name: c.name, description: c.description ?? "" });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      showToast("Topic name is required", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), description: form.description.trim() };
      if (editingId != null) {
        await learningApi.updateCategory(editingId, payload);
        showToast("Topic updated", "success");
      } else {
        await learningApi.createCategory(payload);
        showToast("Topic added", "success");
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
      await learningApi.deleteCategory(deleteTarget.id);
      showToast("Topic deleted", "success");
      setDeleteTarget(null);
      load();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Learning</h1>
          <p className="text-slate-500 mt-1">
            Create your own topics and save links, videos, courses, and notes
            under each one.
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          + Add Topic
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {categories.length === 0 ? (
          <p className="text-slate-500 col-span-full">
            You have no topics yet. Click "+ Add Topic" to get started.
          </p>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="card p-6 hover:shadow-md transition-shadow flex flex-col">
              <Link to={`/learning/categories/${c.id}`} className="block flex-1">
                <h2 className="font-semibold text-lg text-slate-900">
                  {c.name}
                </h2>
                {c.description && (
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                    {c.description}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-3">
                  {c.resourceCount} resources
                </p>
              </Link>
              <div className="mt-3 flex items-center gap-3 shrink-0">
                <button
                  onClick={() => openEdit(c)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Rename
                </button>
                <button
                  onClick={() => setDeleteTarget(c)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId != null ? "Rename Topic" : "Add Topic"}
      >
        <div className="space-y-3">
          <input
            className="input"
            placeholder="Topic name (e.g. SQL, Computer Networks)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="input h-20"
            placeholder="Short description (optional)"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <button onClick={save} disabled={saving} className="btn-primary w-full">
            {saving ? "Saving..." : editingId != null ? "Save Changes" : "Add Topic"}
          </button>
        </div>
      </Modal>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete topic?"
        description={`This will also delete all resources inside "${deleteTarget?.name}".`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
export default LearningHomePage;
