import React, { useEffect, useState } from "react";
import { studyPlannerApi, StudyPlanItemPayload } from "../api/studyPlanner";
import type { StudyPlan, StudyPlanItem, StudyPlanType } from "../types";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import Modal from "../components/Modal";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const TYPE_META: Record<
  StudyPlanType,
  { label: string; badge: string; bar: string }
> = {
  CODING: {
    label: "Coding",
    badge: "bg-brand-100 text-brand-700",
    bar: "bg-brand-500",
  },
  INTERVIEW: {
    label: "Interview",
    badge: "bg-violet-100 text-violet-700",
    bar: "bg-violet-500",
  },
  LEARNING: {
    label: "Learning",
    badge: "bg-emerald-100 text-emerald-700",
    bar: "bg-emerald-500",
  },
  CRT: {
    label: "CRT",
    badge: "bg-amber-100 text-amber-700",
    bar: "bg-amber-500",
  },
  OTHER: {
    label: "Other",
    badge: "bg-slate-100 text-slate-600",
    bar: "bg-slate-400",
  },
};
const EMPTY_FORM: StudyPlanItemPayload = {
  title: "",
  type: "CODING",
  dayOfWeek: 0,
  time: "",
  durationMinutes: 60,
};
const SchedulePage: React.FC = () => {
  const { showToast } = useToast();
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [goals, setGoals] = useState({
    codingPerWeek: 0,
    interviewsPerWeek: 0,
    learningPerWeek: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<StudyPlanItemPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const load = () => {
    setLoading(true);
    setError("");
    studyPlannerApi
      .getPlan()
      .then((p) => {
        setPlan(p);
        setGoals({
          codingPerWeek: p.codingPerWeek,
          interviewsPerWeek: p.interviewsPerWeek,
          learningPerWeek: p.learningPerWeek,
        });
      })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  const updatePlan = (p: StudyPlan) => {
    setPlan(p);
    setGoals({
      codingPerWeek: p.codingPerWeek,
      interviewsPerWeek: p.interviewsPerWeek,
      learningPerWeek: p.learningPerWeek,
    });
  };
  const saveGoals = () => {
    studyPlannerApi
      .updateGoals({
        codingPerWeek: goals.codingPerWeek,
        interviewsPerWeek: goals.interviewsPerWeek,
        learningPerWeek: goals.learningPerWeek,
      })
      .then((p) => {
        updatePlan(p);
        showToast("Weekly goals saved", "success");
      })
      .catch((e) => showToast(getErrorMessage(e), "error"));
  };
  const openAdd = (day: number) => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, dayOfWeek: day });
    setModalOpen(true);
  };
  const openEdit = (item: StudyPlanItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      type: item.type,
      dayOfWeek: item.dayOfWeek,
      time: item.time ?? "",
      durationMinutes: item.durationMinutes ?? 60,
    });
    setModalOpen(true);
  };
  const submitItem = () => {
    if (!form.title.trim()) {
      showToast("Please enter a title", "error");
      return;
    }
    setSaving(true);
    const payload: StudyPlanItemPayload = {
      ...form,
      title: form.title.trim(),
      time: form.time?.trim() || null,
    };
    const req =
      editingId == null
        ? studyPlannerApi.createItem(payload)
        : studyPlannerApi.updateItem(editingId, payload);
    req
      .then((p) => {
        updatePlan(p);
        setModalOpen(false);
        showToast(
          editingId == null ? "Study item added" : "Study item updated",
          "success",
        );
      })
      .catch((e) => showToast(getErrorMessage(e), "error"))
      .finally(() => setSaving(false));
  };
  const toggleItem = (item: StudyPlanItem) => {
    studyPlannerApi
      .toggleItem(item.id)
      .then((p) => updatePlan(p))
      .catch((e) => showToast(getErrorMessage(e), "error"));
  };
  const deleteItem = (item: StudyPlanItem) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    studyPlannerApi
      .deleteItem(item.id)
      .then((p) => {
        updatePlan(p);
        showToast("Item deleted", "success");
      })
      .catch((e) => showToast(getErrorMessage(e), "error"));
  };
  if (loading) return <LoadingState label="Loading your study plan..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!plan) return null;
  const itemsByDay = (day: number) =>
    plan.items.filter((i) => i.dayOfWeek === day);
  const doneCount = plan.items.filter((i) => i.done).length;
  return (
    <div>
      {" "}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl font-bold text-slate-900">
            Study Schedule
          </h1>{" "}
          <p className="text-slate-500 mt-1">
            Plan your weekly preparation and track progress.
          </p>{" "}
        </div>{" "}
        <button onClick={() => openAdd(0)} className="btn-primary">
          + Add Study Item
        </button>{" "}
      </div>{" "}
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {" "}
        <div className="card p-6 lg:col-span-1">
          {" "}
          <h2 className="font-semibold text-slate-900 mb-4">
            Weekly Goals
          </h2>{" "}
          <div className="space-y-4">
            {" "}
            <label className="block">
              {" "}
              <span className="label">Coding problems / week</span>{" "}
              <input
                type="number"
                min={0}
                max={50}
                className="input"
                value={goals.codingPerWeek}
                onChange={(e) =>
                  setGoals({ ...goals, codingPerWeek: Number(e.target.value) })
                }
              />{" "}
            </label>{" "}
            <label className="block">
              {" "}
              <span className="label">Mock interviews / week</span>{" "}
              <input
                type="number"
                min={0}
                max={20}
                className="input"
                value={goals.interviewsPerWeek}
                onChange={(e) =>
                  setGoals({
                    ...goals,
                    interviewsPerWeek: Number(e.target.value),
                  })
                }
              />{" "}
            </label>{" "}
            <label className="block">
              {" "}
              <span className="label">Learning resources / week</span>{" "}
              <input
                type="number"
                min={0}
                max={50}
                className="input"
                value={goals.learningPerWeek}
                onChange={(e) =>
                  setGoals({
                    ...goals,
                    learningPerWeek: Number(e.target.value),
                  })
                }
              />{" "}
            </label>{" "}
            <button onClick={saveGoals} className="btn-secondary w-full">
              Save Goals
            </button>{" "}
          </div>{" "}
          <div className="mt-6 pt-4 border-t border-slate-200">
            {" "}
            <p className="text-sm text-slate-500">
              {" "}
              <span className="font-semibold text-slate-900">
                {doneCount}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {plan.items.length}
              </span>{" "}
              tasks completed{" "}
            </p>{" "}
            <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
              {" "}
              <div
                className="h-full bg-brand-600 transition-all"
                style={{
                  width:
                    plan.items.length === 0
                      ? "0%"
                      : `${Math.round((doneCount / plan.items.length) * 100)}%`,
                }}
              />{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="lg:col-span-2 space-y-4">
          {" "}
          {DAYS.map((day, idx) => {
            const items = itemsByDay(idx);
            return (
              <div key={day} className="card p-4">
                {" "}
                <div className="flex items-center justify-between mb-3">
                  {" "}
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {day}
                  </h3>{" "}
                  <button
                    onClick={() => openAdd(idx)}
                    className="text-xs text-brand-600 hover:underline"
                  >
                    + Add
                  </button>{" "}
                </div>{" "}
                {items.length === 0 ? (
                  <p className="text-sm text-slate-400">No tasks scheduled.</p>
                ) : (
                  <ul className="space-y-2">
                    {" "}
                    {items.map((item) => {
                      const meta = TYPE_META[item.type] ?? TYPE_META.OTHER;
                      return (
                        <li
                          key={item.id}
                          className={`flex items-center gap-3 rounded-lg border border-slate-200 p-3 ${item.done ? "opacity-60" : ""}`}
                        >
                          {" "}
                          <input
                            type="checkbox"
                            checked={item.done}
                            onChange={() => toggleItem(item)}
                            className="h-4 w-4 rounded border-slate-300 text-brand-600 accent-brand-600"
                            aria-label={`Mark ${item.title} as ${item.done ? "not done" : "done"}`}
                          />{" "}
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${meta.bar}`}
                          />{" "}
                          <div className="min-w-0 flex-1">
                            {" "}
                            <p
                              className={`text-sm font-medium text-slate-800 ${item.done ? "line-through" : ""}`}
                            >
                              {item.title}
                            </p>{" "}
                            <p className="text-xs text-slate-400">
                              {" "}
                              {meta.label} {item.time ? ` · ${item.time}` : ""}{" "}
                              {item.durationMinutes
                                ? ` · ${item.durationMinutes} min`
                                : ""}{" "}
                            </p>{" "}
                          </div>{" "}
                          <span
                            className={`hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded-full ${meta.badge}`}
                          >
                            {meta.label}
                          </span>{" "}
                          <button
                            onClick={() => openEdit(item)}
                            className="text-slate-400 hover:text-slate-600 text-sm"
                            aria-label={`Edit ${item.title}`}
                          >
                            Edit
                          </button>{" "}
                          <button
                            onClick={() => deleteItem(item)}
                            className="text-red-500 hover:text-red-700 text-sm"
                            aria-label={`Delete ${item.title}`}
                          >
                            Delete
                          </button>{" "}
                        </li>
                      );
                    })}{" "}
                  </ul>
                )}{" "}
              </div>
            );
          })}{" "}
        </div>{" "}
      </div>{" "}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId == null ? "Add Study Item" : "Edit Study Item"}
      >
        {" "}
        <div className="space-y-4">
          {" "}
          <label className="block">
            {" "}
            <span className="label">Title</span>{" "}
            <input
              className="input"
              placeholder="e.g. Solve 2 arrays problems"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />{" "}
          </label>{" "}
          <div className="grid grid-cols-2 gap-4">
            {" "}
            <label className="block">
              {" "}
              <span className="label">Type</span>{" "}
              <select
                className="input"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as StudyPlanType })
                }
              >
                {" "}
                {(Object.keys(TYPE_META) as StudyPlanType[]).map((t) => (
                  <option key={t} value={t}>
                    {TYPE_META[t].label}
                  </option>
                ))}{" "}
              </select>{" "}
            </label>{" "}
            <label className="block">
              {" "}
              <span className="label">Day</span>{" "}
              <select
                className="input"
                value={form.dayOfWeek}
                onChange={(e) =>
                  setForm({ ...form, dayOfWeek: Number(e.target.value) })
                }
              >
                {" "}
                {DAYS.map((d, i) => (
                  <option key={d} value={i}>
                    {d}
                  </option>
                ))}{" "}
              </select>{" "}
            </label>{" "}
            <label className="block">
              {" "}
              <span className="label">Time</span>{" "}
              <input
                className="input"
                placeholder="e.g. 10:00 AM"
                value={form.time ?? ""}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />{" "}
            </label>{" "}
            <label className="block">
              {" "}
              <span className="label">Duration (min)</span>{" "}
              <input
                type="number"
                min={5}
                max={480}
                className="input"
                value={form.durationMinutes ?? ""}
                onChange={(e) =>
                  setForm({ ...form, durationMinutes: Number(e.target.value) })
                }
              />{" "}
            </label>{" "}
          </div>{" "}
          <div className="flex justify-end gap-3 pt-2">
            {" "}
            <button
              onClick={() => setModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>{" "}
            <button
              onClick={submitItem}
              disabled={saving}
              className="btn-primary"
            >
              {" "}
              {saving
                ? "Saving..."
                : editingId == null
                  ? "Add Item"
                  : "Save Changes"}{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </Modal>{" "}
    </div>
  );
};
export default SchedulePage;
