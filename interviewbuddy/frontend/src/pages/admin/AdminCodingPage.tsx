import React, { useEffect, useState } from "react";
import { codingApi } from "../../api/coding";
import type {
  CodingProblemSummary,
  CodingSheet,
  CodingPattern,
  DifficultyLevel,
  CodingPlatform,
} from "../../types";
import LoadingState from "../../components/LoadingState";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import Badge from "../../components/Badge";
import { getErrorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";

type Tab = "problems" | "sheets" | "patterns";

const DIFFICULTIES: DifficultyLevel[] = ["EASY", "MEDIUM", "HARD"];
const PLATFORMS: CodingPlatform[] = [
  "LEETCODE",
  "CODECHEF",
  "CODEFORCES",
  "OTHER",
];
const TOPICS = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Stack",
  "Queue",
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Trees",
  "Tries",
  "Heaps",
  "Graphs",
  "Dynamic Programming",
  "Greedy",
  "Recursion",
  "Backtracking",
  "Intervals",
  "Math",
  "Bit Manipulation",
  "Hashing",
];

interface ProblemForm {
  id?: number;
  title: string;
  description: string;
  constraintsText: string;
  difficulty: DifficultyLevel;
  topic: string;
  sheetIds: number[];
  patternId: string;
  externalUrl: string;
  platform: CodingPlatform;
  examples: { inputText: string; outputText: string; explanation: string }[];
}

const emptyProblem: ProblemForm = {
  title: "",
  description: "",
  constraintsText: "",
  difficulty: "EASY",
  topic: TOPICS[0],
  sheetIds: [],
  patternId: "",
  externalUrl: "",
  platform: "LEETCODE",
  examples: [{ inputText: "", outputText: "", explanation: "" }],
};

interface SheetForm {
  id?: number;
  name: string;
  description: string;
  position: number;
}
const emptySheet: SheetForm = { name: "", description: "", position: 0 };

interface PatternForm {
  id?: number;
  name: string;
  description: string;
  position: number;
}
const emptyPattern: PatternForm = { name: "", description: "", position: 0 };

const AdminCodingPage: React.FC = () => {
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>("problems");
  const [problems, setProblems] = useState<CodingProblemSummary[] | null>(null);
  const [sheets, setSheets] = useState<CodingSheet[]>([]);
  const [patterns, setPatterns] = useState<CodingPattern[]>([]);

  const [problemModal, setProblemModal] = useState(false);
  const [problemForm, setProblemForm] = useState<ProblemForm>(emptyProblem);
  const [deleteProblem, setDeleteProblem] =
    useState<CodingProblemSummary | null>(null);

  const [sheetModal, setSheetModal] = useState(false);
  const [sheetForm, setSheetForm] = useState<SheetForm>(emptySheet);
  const [deleteSheet, setDeleteSheet] = useState<CodingSheet | null>(null);

  const [patternModal, setPatternModal] = useState(false);
  const [patternForm, setPatternForm] = useState<PatternForm>(emptyPattern);
  const [deletePattern, setDeletePattern] = useState<CodingPattern | null>(
    null,
  );

  const loadMeta = () => {
    codingApi
      .listSheets()
      .then(setSheets)
      .catch(() => setSheets([]));
    codingApi
      .listPatterns()
      .then(setPatterns)
      .catch(() => setPatterns([]));
  };

  const loadProblems = () => {
    codingApi
      .listProblems({ page: 0, size: 200 })
      .then((p) => setProblems(p.content))
      .catch((e) => showToast(getErrorMessage(e), "error"));
  };

  useEffect(() => {
    loadMeta();
    loadProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= Problems =================
  const saveProblem = async () => {
    const payload = {
      ...problemForm,
      sheetIds: problemForm.sheetIds,
      patternId: problemForm.patternId ? Number(problemForm.patternId) : null,
    };
    try {
      if (problemForm.id) {
        await codingApi.updateProblem(problemForm.id, payload);
        showToast("Problem updated", "success");
      } else {
        await codingApi.createProblem(payload);
        showToast("Problem created", "success");
      }
      setProblemModal(false);
      setProblemForm(emptyProblem);
      loadProblems();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  const confirmDeleteProblem = async () => {
    if (!deleteProblem) return;
    try {
      await codingApi.deleteProblem(deleteProblem.id);
      showToast("Problem deleted", "success");
      setDeleteProblem(null);
      loadProblems();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  // ================= Sheets =================
  const saveSheet = async () => {
    const payload = {
      name: sheetForm.name,
      description: sheetForm.description,
      position: sheetForm.position,
    };
    try {
      if (sheetForm.id) {
        await codingApi.updateSheet(sheetForm.id, payload);
        showToast("Sheet updated", "success");
      } else {
        await codingApi.createSheet(payload);
        showToast("Sheet created", "success");
      }
      setSheetModal(false);
      setSheetForm(emptySheet);
      loadMeta();
      loadProblems();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  const confirmDeleteSheet = async () => {
    if (!deleteSheet) return;
    try {
      await codingApi.deleteSheet(deleteSheet.id);
      showToast("Sheet deleted", "success");
      setDeleteSheet(null);
      loadMeta();
      loadProblems();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  // ================= Patterns =================
  const savePattern = async () => {
    const payload = {
      name: patternForm.name,
      description: patternForm.description,
      position: patternForm.position,
    };
    try {
      if (patternForm.id) {
        await codingApi.updatePattern(patternForm.id, payload);
        showToast("Pattern updated", "success");
      } else {
        await codingApi.createPattern(payload);
        showToast("Pattern created", "success");
      }
      setPatternModal(false);
      setPatternForm(emptyPattern);
      loadMeta();
      loadProblems();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  const confirmDeletePattern = async () => {
    if (!deletePattern) return;
    try {
      await codingApi.deletePattern(deletePattern.id);
      showToast("Pattern deleted", "success");
      setDeletePattern(null);
      loadMeta();
      loadProblems();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  if (!problems) return <LoadingState />;

  const tabCls = (t: Tab) =>
    `px-4 py-2 rounded-lg text-sm font-medium ${tab === t ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"}`;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Coding Management</h1>
      <div className="flex items-center gap-2 mt-5">
        <button
          className={tabCls("problems")}
          onClick={() => setTab("problems")}
        >
          Problems
        </button>
        <button className={tabCls("sheets")} onClick={() => setTab("sheets")}>
          Sheets
        </button>
        <button
          className={tabCls("patterns")}
          onClick={() => setTab("patterns")}
        >
          Patterns
        </button>
      </div>

      {/* ==================== PROBLEMS TAB ==================== */}
      {tab === "problems" && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Coding Problems
            </h2>
            <button
              onClick={() => {
                setProblemForm(emptyProblem);
                setProblemModal(true);
              }}
              className="btn-primary"
            >
              + New Problem
            </button>
          </div>
          <div className="card overflow-hidden mt-4">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-5 py-3">Title</th>
                  <th className="text-left px-5 py-3">Sheet</th>
                  <th className="text-left px-5 py-3">Pattern</th>
                  <th className="text-left px-5 py-3">Platform</th>
                  <th className="text-left px-5 py-3">Difficulty</th>
                  <th className="text-left px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {problems.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {p.title}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {p.sheetName ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {p.patternName ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{p.platform}</td>
                    <td className="px-5 py-3">
                      <Badge label={p.difficulty} />
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setDeleteProblem(p)}
                        className="text-xs text-red-600 hover:underline mr-3"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {problems.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-slate-400"
                    >
                      No problems yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Modal
            open={problemModal}
            onClose={() => setProblemModal(false)}
            title={problemForm.id ? "Edit Problem" : "New Problem"}
            wide
          >
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <input
                className="input"
                placeholder="Title"
                value={problemForm.title}
                onChange={(e) =>
                  setProblemForm({ ...problemForm, title: e.target.value })
                }
              />
              <textarea
                className="input h-20"
                placeholder="Description / note"
                value={problemForm.description}
                onChange={(e) =>
                  setProblemForm({
                    ...problemForm,
                    description: e.target.value,
                  })
                }
              />
              <textarea
                className="input h-14"
                placeholder="Constraints"
                value={problemForm.constraintsText}
                onChange={(e) =>
                  setProblemForm({
                    ...problemForm,
                    constraintsText: e.target.value,
                  })
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="input"
                  value={problemForm.difficulty}
                  onChange={(e) =>
                    setProblemForm({
                      ...problemForm,
                      difficulty: e.target.value as DifficultyLevel,
                    })
                  }
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  className="input"
                  value={problemForm.topic}
                  onChange={(e) =>
                    setProblemForm({ ...problemForm, topic: e.target.value })
                  }
                >
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="label">Sheets</p>
                  <div className="space-y-1 max-h-24 overflow-y-auto border rounded-lg p-2">
                    {sheets.map((s) => (
                      <label
                        key={s.id}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={problemForm.sheetIds.includes(s.id)}
                          onChange={(e) => {
                            const ids = e.target.checked
                              ? [...problemForm.sheetIds, s.id]
                              : problemForm.sheetIds.filter((x) => x !== s.id);
                            setProblemForm({ ...problemForm, sheetIds: ids });
                          }}
                          className="h-4 w-4 rounded accent-brand-600 cursor-pointer"
                        />
                        {s.name}
                      </label>
                    ))}
                    {sheets.length === 0 && (
                      <p className="text-xs text-slate-400">No sheets yet.</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="label">Pattern</p>
                  <select
                    className="input"
                    value={problemForm.patternId}
                    onChange={(e) =>
                      setProblemForm({
                        ...problemForm,
                        patternId: e.target.value,
                      })
                    }
                  >
                    <option value="">No pattern</option>
                    {patterns.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="input"
                  placeholder="External URL (LeetCode/CodeChef/Codeforces)"
                  value={problemForm.externalUrl}
                  onChange={(e) =>
                    setProblemForm({
                      ...problemForm,
                      externalUrl: e.target.value,
                    })
                  }
                />
                <select
                  className="input"
                  value={problemForm.platform}
                  onChange={(e) =>
                    setProblemForm({
                      ...problemForm,
                      platform: e.target.value as CodingPlatform,
                    })
                  }
                >
                  {PLATFORMS.map((pl) => (
                    <option key={pl} value={pl}>
                      {pl}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="label">Example</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="input"
                    placeholder="Input"
                    value={problemForm.examples[0]?.inputText ?? ""}
                    onChange={(e) => {
                      const ex = [...problemForm.examples];
                      ex[0] = { ...ex[0], inputText: e.target.value };
                      setProblemForm({ ...problemForm, examples: ex });
                    }}
                  />
                  <input
                    className="input"
                    placeholder="Output"
                    value={problemForm.examples[0]?.outputText ?? ""}
                    onChange={(e) => {
                      const ex = [...problemForm.examples];
                      ex[0] = { ...ex[0], outputText: e.target.value };
                      setProblemForm({ ...problemForm, examples: ex });
                    }}
                  />
                </div>
                <input
                  className="input mt-2"
                  placeholder="Explanation"
                  value={problemForm.examples[0]?.explanation ?? ""}
                  onChange={(e) => {
                    const ex = [...problemForm.examples];
                    ex[0] = { ...ex[0], explanation: e.target.value };
                    setProblemForm({ ...problemForm, examples: ex });
                  }}
                />
              </div>
              <button onClick={saveProblem} className="btn-primary w-full">
                {problemForm.id ? "Save Changes" : "Create Problem"}
              </button>
            </div>
          </Modal>
        </div>
      )}

      {/* ==================== SHEETS TAB ==================== */}
      {tab === "sheets" && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Coding Sheets
            </h2>
            <button
              onClick={() => {
                setSheetForm(emptySheet);
                setSheetModal(true);
              }}
              className="btn-primary"
            >
              + New Sheet
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {sheets.map((s) => (
              <div key={s.id} className="card p-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{s.name}</span>
                  <span className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-full">
                    {s.problemCount} problems
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-2">{s.description}</p>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => {
                      setSheetForm({
                        id: s.id,
                        name: s.name,
                        description: s.description,
                        position: s.position,
                      });
                      setSheetModal(true);
                    }}
                    className="text-xs text-brand-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteSheet(s)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {sheets.length === 0 && (
              <div className="col-span-full card p-8 text-center text-slate-400">
                No sheets yet.
              </div>
            )}
          </div>
          <Modal
            open={sheetModal}
            onClose={() => setSheetModal(false)}
            title={sheetForm.id ? "Edit Sheet" : "New Sheet"}
          >
            <div className="space-y-3">
              <input
                className="input"
                placeholder="Sheet name (e.g. Neetcode 150)"
                value={sheetForm.name}
                onChange={(e) =>
                  setSheetForm({ ...sheetForm, name: e.target.value })
                }
              />
              <textarea
                className="input h-20"
                placeholder="Description"
                value={sheetForm.description}
                onChange={(e) =>
                  setSheetForm({ ...sheetForm, description: e.target.value })
                }
              />
              <input
                className="input"
                type="number"
                placeholder="Position"
                value={sheetForm.position}
                onChange={(e) =>
                  setSheetForm({
                    ...sheetForm,
                    position: Number(e.target.value),
                  })
                }
              />
              <button onClick={saveSheet} className="btn-primary w-full">
                {sheetForm.id ? "Save Changes" : "Create Sheet"}
              </button>
            </div>
          </Modal>
        </div>
      )}

      {/* ==================== PATTERNS TAB ==================== */}
      {tab === "patterns" && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Coding Patterns
            </h2>
            <button
              onClick={() => {
                setPatternForm(emptyPattern);
                setPatternModal(true);
              }}
              className="btn-primary"
            >
              + New Pattern
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {patterns.map((p) => (
              <div key={p.id} className="card p-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{p.name}</span>
                  <span className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-full">
                    {p.problemCount} problems
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-2">{p.description}</p>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => {
                      setPatternForm({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                        position: p.position,
                      });
                      setPatternModal(true);
                    }}
                    className="text-xs text-brand-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletePattern(p)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {patterns.length === 0 && (
              <div className="col-span-full card p-8 text-center text-slate-400">
                No patterns yet.
              </div>
            )}
          </div>
          <Modal
            open={patternModal}
            onClose={() => setPatternModal(false)}
            title={patternForm.id ? "Edit Pattern" : "New Pattern"}
          >
            <div className="space-y-3">
              <input
                className="input"
                placeholder="Pattern name (e.g. Arrays & Hashing)"
                value={patternForm.name}
                onChange={(e) =>
                  setPatternForm({ ...patternForm, name: e.target.value })
                }
              />
              <textarea
                className="input h-20"
                placeholder="Description"
                value={patternForm.description}
                onChange={(e) =>
                  setPatternForm({
                    ...patternForm,
                    description: e.target.value,
                  })
                }
              />
              <input
                className="input"
                type="number"
                placeholder="Position"
                value={patternForm.position}
                onChange={(e) =>
                  setPatternForm({
                    ...patternForm,
                    position: Number(e.target.value),
                  })
                }
              />
              <button onClick={savePattern} className="btn-primary w-full">
                {patternForm.id ? "Save Changes" : "Create Pattern"}
              </button>
            </div>
          </Modal>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteProblem}
        title="Delete problem?"
        description={deleteProblem?.title}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDeleteProblem}
        onCancel={() => setDeleteProblem(null)}
      />
      <ConfirmDialog
        open={!!deleteSheet}
        title="Delete sheet?"
        description={deleteSheet?.name}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDeleteSheet}
        onCancel={() => setDeleteSheet(null)}
      />
      <ConfirmDialog
        open={!!deletePattern}
        title="Delete pattern?"
        description={deletePattern?.name}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDeletePattern}
        onCancel={() => setDeletePattern(null)}
      />
    </div>
  );
};

export default AdminCodingPage;
