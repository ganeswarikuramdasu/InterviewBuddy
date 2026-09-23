import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/admin";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { getErrorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import type { DifficultyLevel, InterviewType } from "../../types";
interface AdminInterviewQuestion {
  id: number;
  role: string;
  interviewType: InterviewType;
  difficulty: DifficultyLevel;
  questionText: string;
  modelAnswerNotes: string;
}
const emptyForm = {
  role: "",
  interviewType: "TECHNICAL" as InterviewType,
  difficulty: "MEDIUM" as DifficultyLevel,
  questionText: "",
  modelAnswerNotes: "",
};
const AdminInterviewsPage: React.FC = () => {
  const { showToast } = useToast();
  const [questions, setQuestions] = useState<AdminInterviewQuestion[] | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] =
    useState<AdminInterviewQuestion | null>(null);
  const [error, setError] = useState("");
  const load = () => {
    setError("");
    adminApi
      .listInterviewQuestions()
      .then((q: any) => setQuestions(q))
      .catch((e) => setError(getErrorMessage(e)));
  };
  useEffect(load, []);
  const save = async () => {
    try {
      await adminApi.createInterviewQuestion(form);
      showToast("Question added", "success");
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteInterviewQuestion(deleteTarget.id);
      showToast("Question deleted", "success");
      setDeleteTarget(null);
      load();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!questions) return <LoadingState />;
  return (
    <div>
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <h1 className="text-2xl font-bold text-slate-900">
          Manage Interview Question Bank
        </h1>{" "}
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          + New Question
        </button>{" "}
      </div>{" "}
      <div className="space-y-3 mt-6">
        {" "}
        {questions.map((q) => (
          <div
            key={q.id}
            className="card p-4 flex items-start justify-between gap-4"
          >
            {" "}
            <div>
              {" "}
              <p className="text-xs text-slate-400">
                {q.role} · {q.interviewType} · {q.difficulty}
              </p>{" "}
              <p className="text-sm font-medium text-slate-900 mt-1">
                {q.questionText}
              </p>{" "}
            </div>{" "}
            <button
              onClick={() => setDeleteTarget(q)}
              className="text-xs text-red-600 hover:underline shrink-0"
            >
              Delete
            </button>{" "}
          </div>
        ))}{" "}
        {questions.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">
            No interview questions yet.
          </p>
        )}{" "}
      </div>{" "}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Interview Question"
      >
        {" "}
        <div className="space-y-3">
          {" "}
          <input
            className="input"
            placeholder="Role (e.g. Software Engineer)"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />{" "}
          <div className="grid grid-cols-2 gap-3">
            {" "}
            <select
              className="input"
              value={form.interviewType}
              onChange={(e) =>
                setForm({
                  ...form,
                  interviewType: e.target.value as InterviewType,
                })
              }
            >
              {" "}
              <option value="TECHNICAL">Technical</option>
              <option value="HR">HR</option>
              <option value="MIXED">Mixed</option>{" "}
            </select>{" "}
            <select
              className="input"
              value={form.difficulty}
              onChange={(e) =>
                setForm({
                  ...form,
                  difficulty: e.target.value as DifficultyLevel,
                })
              }
            >
              {" "}
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>{" "}
            </select>{" "}
          </div>{" "}
          <textarea
            className="input h-20"
            placeholder="Question text"
            value={form.questionText}
            onChange={(e) => setForm({ ...form, questionText: e.target.value })}
          />{" "}
          <textarea
            className="input h-16"
            placeholder="Model answer notes (for evaluators)"
            value={form.modelAnswerNotes}
            onChange={(e) =>
              setForm({ ...form, modelAnswerNotes: e.target.value })
            }
          />{" "}
          <button onClick={save} className="btn-primary w-full">
            Save Question
          </button>{" "}
        </div>{" "}
      </Modal>{" "}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete question?"
        description={deleteTarget?.questionText}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />{" "}
    </div>
  );
};
export default AdminInterviewsPage;
