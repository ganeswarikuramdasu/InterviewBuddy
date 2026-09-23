import React, { useEffect, useState } from "react";
import { crtApi } from "../../api/crt";
import type {
  CrtCategory,
  CrtTopic,
  CrtQuestionAdmin,
  CrtTest,
  DifficultyLevel,
} from "../../types";
import LoadingState from "../../components/LoadingState";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { getErrorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";

type Tab = "topics" | "questions" | "tests";

const emptyTopicForm = {
  title: "",
  explanation: "",
  concepts: "",
  formulas: "",
  examples: "",
  tips: "",
  displayOrder: 0,
};

const emptyQuestionForm = {
  questionText: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "A",
  explanation: "",
  difficulty: "MEDIUM" as DifficultyLevel,
};

const emptyTestForm = {
  title: "",
  description: "",
  durationMinutes: 15,
  difficulty: "MEDIUM" as DifficultyLevel,
  questionIds: [] as number[],
  isPublished: true,
};

const AdminCrtPage: React.FC = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<CrtCategory[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [tab, setTab] = useState<Tab>("topics");
  const [topics, setTopics] = useState<CrtTopic[]>([]);
  const [topicId, setTopicId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<CrtQuestionAdmin[]>([]);
  const [tests, setTests] = useState<CrtTest[]>([]);

  const [topicModal, setTopicModal] = useState<{
    open: boolean;
    editing?: CrtTopic;
  }>({ open: false });
  const [topicForm, setTopicForm] = useState(emptyTopicForm);
  const [questionModal, setQuestionModal] = useState<{
    open: boolean;
    editing?: CrtQuestionAdmin;
  }>({ open: false });
  const [questionForm, setQuestionForm] = useState(emptyQuestionForm);
  const [testModal, setTestModal] = useState(false);
  const [testForm, setTestForm] = useState(emptyTestForm);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "topic" | "question" | "test";
    id: number;
    label: string;
  } | null>(null);

  useEffect(() => {
    crtApi
      .listCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].id);
      })
      .catch((e) => showToast(getErrorMessage(e), "error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTopics = () => {
    if (!categoryId) return;
    crtApi
      .listTopics(categoryId)
      .then((t) => {
        setTopics(t);
        if (t.length > 0 && !topicId) setTopicId(t[0].id);
      })
      .catch((e) => showToast(getErrorMessage(e), "error"));
  };
  useEffect(loadTopics, [categoryId]); // eslint-disable-line react-hooks/exhaustive-deps -- categoryId is the trigger; showToast is stable for the effect's lifetime

  const loadQuestions = () => {
    if (!topicId) {
      setQuestions([]);
      return;
    }
    crtApi
      .listQuestionsAdmin(topicId)
      .then(setQuestions)
      .catch((e) => showToast(getErrorMessage(e), "error"));
  };
  useEffect(loadQuestions, [topicId]); // eslint-disable-line react-hooks/exhaustive-deps -- topicId is the trigger; showToast is stable for the effect's lifetime

  const loadTests = () => {
    if (!categoryId) return;
    crtApi
      .listTests(categoryId)
      .then(setTests)
      .catch((e) => showToast(getErrorMessage(e), "error"));
  };
  useEffect(() => {
    if (tab === "tests") loadTests();
  }, [tab, categoryId]); // eslint-disable-line react-hooks/exhaustive-deps -- loadTests is intentionally re-created per render

  // --- Topics ---
  const openTopicModal = (t?: CrtTopic) => {
    setTopicForm(
      t
        ? {
            title: t.title,
            explanation: t.explanation,
            concepts: t.concepts,
            formulas: t.formulas,
            examples: t.examples,
            tips: t.tips,
            displayOrder: t.displayOrder,
          }
        : emptyTopicForm,
    );
    setTopicModal({ open: true, editing: t });
  };

  const saveTopic = async () => {
    if (!categoryId) return;
    try {
      const payload = { ...topicForm, categoryId };
      if (topicModal.editing)
        await crtApi.updateTopic(topicModal.editing.id, payload);
      else await crtApi.createTopic(payload);
      showToast("Topic saved", "success");
      setTopicModal({ open: false });
      loadTopics();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  // --- Questions ---
  const openQuestionModal = (q?: CrtQuestionAdmin) => {
    setQuestionForm(
      q
        ? {
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            explanation: q.explanation,
            difficulty: q.difficulty,
          }
        : emptyQuestionForm,
    );
    setQuestionModal({ open: true, editing: q });
  };

  const saveQuestion = async () => {
    if (!topicId) return;
    try {
      const payload = { ...questionForm, topicId };
      if (questionModal.editing)
        await crtApi.updateQuestion(questionModal.editing.id, payload);
      else await crtApi.createQuestion(payload);
      showToast("Question saved", "success");
      setQuestionModal({ open: false });
      loadQuestions();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  // --- Tests ---
  const saveTest = async () => {
    if (!categoryId) return;
    try {
      await crtApi.createTest({ ...testForm, categoryId });
      showToast("Test created", "success");
      setTestModal(false);
      setTestForm(emptyTestForm);
      loadTests();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "topic") {
        await crtApi.deleteTopic(deleteTarget.id);
        loadTopics();
      }
      if (deleteTarget.type === "question") {
        await crtApi.deleteQuestion(deleteTarget.id);
        loadQuestions();
      }
      if (deleteTarget.type === "test") {
        await crtApi.deleteTest(deleteTarget.id);
        loadTests();
      }
      showToast("Deleted successfully", "success");
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
    setDeleteTarget(null);
  };

  const toggleQuestionInTest = (id: number) => {
    setTestForm((f) => ({
      ...f,
      questionIds: f.questionIds.includes(id)
        ? f.questionIds.filter((x) => x !== id)
        : [...f.questionIds, id],
    }));
  };

  if (categories.length === 0) return <LoadingState />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Manage CRT Content</h1>

      <div className="flex flex-wrap gap-3 mt-4 items-center">
        <select
          className="input max-w-[220px]"
          value={categoryId ?? ""}
          onChange={(e) => {
            setCategoryId(Number(e.target.value));
            setTopicId(null);
          }}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.displayName}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 border-b border-slate-200 my-6">
        {(["topics", "questions", "tests"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 ${
              tab === t
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-slate-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "topics" && (
        <div>
          <button onClick={() => openTopicModal()} className="btn-primary mb-4">
            + New Topic
          </button>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-5 py-3">Title</th>
                  <th className="text-left px-5 py-3">Questions</th>
                  <th className="text-left px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topics.map((t) => (
                  <tr key={t.id}>
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {t.title}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {t.questionCount}
                    </td>
                    <td className="px-5 py-3 flex gap-3">
                      <button
                        onClick={() => openTopicModal(t)}
                        className="text-xs text-brand-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            type: "topic",
                            id: t.id,
                            label: t.title,
                          })
                        }
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {topics.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-8 text-center text-slate-400"
                    >
                      No topics yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "questions" && (
        <div>
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            <select
              className="input max-w-[260px]"
              value={topicId ?? ""}
              onChange={(e) => setTopicId(Number(e.target.value))}
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
            <button onClick={() => openQuestionModal()} className="btn-primary">
              + New Question
            </button>
          </div>
          <div className="space-y-3">
            {questions.map((q) => (
              <div
                key={q.id}
                className="card p-4 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {q.questionText}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Correct: {q.correctOption} · {q.difficulty}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => openQuestionModal(q)}
                    className="text-xs text-brand-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setDeleteTarget({
                        type: "question",
                        id: q.id,
                        label: q.questionText,
                      })
                    }
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {questions.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">
                No questions for this topic yet.
              </p>
            )}
          </div>
        </div>
      )}

      {tab === "tests" && (
        <div>
          <button
            onClick={() => setTestModal(true)}
            className="btn-primary mb-4"
          >
            + New Test
          </button>
          <div className="space-y-3">
            {tests.map((t) => (
              <div
                key={t.id}
                className="card p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900">{t.title}</p>
                  <p className="text-xs text-slate-400">
                    {t.questionCount} questions · {t.durationMinutes} min
                  </p>
                </div>
                <button
                  onClick={() =>
                    setDeleteTarget({ type: "test", id: t.id, label: t.title })
                  }
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
            {tests.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">
                No tests yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Topic Modal */}
      <Modal
        open={topicModal.open}
        onClose={() => setTopicModal({ open: false })}
        title={topicModal.editing ? "Edit Topic" : "New Topic"}
        wide
      >
        <div className="space-y-3">
          <input
            className="input"
            placeholder="Title"
            value={topicForm.title}
            onChange={(e) =>
              setTopicForm({ ...topicForm, title: e.target.value })
            }
          />
          <textarea
            className="input h-20"
            placeholder="Explanation"
            value={topicForm.explanation}
            onChange={(e) =>
              setTopicForm({ ...topicForm, explanation: e.target.value })
            }
          />
          <textarea
            className="input h-16"
            placeholder="Concepts"
            value={topicForm.concepts}
            onChange={(e) =>
              setTopicForm({ ...topicForm, concepts: e.target.value })
            }
          />
          <textarea
            className="input h-16"
            placeholder="Formulas"
            value={topicForm.formulas}
            onChange={(e) =>
              setTopicForm({ ...topicForm, formulas: e.target.value })
            }
          />
          <textarea
            className="input h-16"
            placeholder="Examples"
            value={topicForm.examples}
            onChange={(e) =>
              setTopicForm({ ...topicForm, examples: e.target.value })
            }
          />
          <textarea
            className="input h-16"
            placeholder="Tips"
            value={topicForm.tips}
            onChange={(e) =>
              setTopicForm({ ...topicForm, tips: e.target.value })
            }
          />
          <button onClick={saveTopic} className="btn-primary w-full">
            Save Topic
          </button>
        </div>
      </Modal>

      {/* Question Modal */}
      <Modal
        open={questionModal.open}
        onClose={() => setQuestionModal({ open: false })}
        title={questionModal.editing ? "Edit Question" : "New Question"}
        wide
      >
        <div className="space-y-3">
          <textarea
            className="input h-20"
            placeholder="Question text"
            value={questionForm.questionText}
            onChange={(e) =>
              setQuestionForm({ ...questionForm, questionText: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="Option A"
              value={questionForm.optionA}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, optionA: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Option B"
              value={questionForm.optionB}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, optionB: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Option C"
              value={questionForm.optionC}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, optionC: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Option D"
              value={questionForm.optionD}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, optionD: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              className="input"
              value={questionForm.correctOption}
              onChange={(e) =>
                setQuestionForm({
                  ...questionForm,
                  correctOption: e.target.value,
                })
              }
            >
              <option value="A">Correct: A</option>
              <option value="B">Correct: B</option>
              <option value="C">Correct: C</option>
              <option value="D">Correct: D</option>
            </select>
            <select
              className="input"
              value={questionForm.difficulty}
              onChange={(e) =>
                setQuestionForm({
                  ...questionForm,
                  difficulty: e.target.value as DifficultyLevel,
                })
              }
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <textarea
            className="input h-16"
            placeholder="Explanation"
            value={questionForm.explanation}
            onChange={(e) =>
              setQuestionForm({ ...questionForm, explanation: e.target.value })
            }
          />
          <button onClick={saveQuestion} className="btn-primary w-full">
            Save Question
          </button>
        </div>
      </Modal>

      {/* Test Modal */}
      <Modal
        open={testModal}
        onClose={() => setTestModal(false)}
        title="New Test"
        wide
      >
        <div className="space-y-3">
          <input
            className="input"
            placeholder="Title"
            value={testForm.title}
            onChange={(e) =>
              setTestForm({ ...testForm, title: e.target.value })
            }
          />
          <textarea
            className="input h-16"
            placeholder="Description"
            value={testForm.description}
            onChange={(e) =>
              setTestForm({ ...testForm, description: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              className="input"
              placeholder="Duration (minutes)"
              value={testForm.durationMinutes}
              onChange={(e) =>
                setTestForm({
                  ...testForm,
                  durationMinutes: Number(e.target.value),
                })
              }
            />
            <select
              className="input"
              value={testForm.difficulty}
              onChange={(e) =>
                setTestForm({
                  ...testForm,
                  difficulty: e.target.value as DifficultyLevel,
                })
              }
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <div>
            <p className="label">
              Select Questions (from{" "}
              {topics.find((t) => t.id === topicId)?.title ?? "current topic"})
            </p>
            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1">
              {questions.map((q) => (
                <label
                  key={q.id}
                  className="flex items-center gap-2 text-sm px-2 py-1.5 hover:bg-slate-50 rounded"
                >
                  <input
                    type="checkbox"
                    checked={testForm.questionIds.includes(q.id)}
                    onChange={() => toggleQuestionInTest(q.id)}
                  />
                  {q.questionText.slice(0, 60)}
                </label>
              ))}
              {questions.length === 0 && (
                <p className="text-xs text-slate-400 px-2 py-1">
                  Switch to the Questions tab and pick a topic with questions
                  first.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={saveTest}
            disabled={testForm.questionIds.length === 0}
            className="btn-primary w-full"
          >
            Create Test
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete this ${deleteTarget?.type}?`}
        description={deleteTarget?.label}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminCrtPage;
