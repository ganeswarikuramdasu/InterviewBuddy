import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { interviewsApi } from "../api/interviews";
import type { DifficultyLevel, InterviewType } from "../types";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
const ROLES = [
  "Software Engineer",
  "Java Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "ML Engineer",
];
const TOPIC_SUGGESTIONS = [
  "Data Structures",
  "Algorithms",
  "SQL",
  "System Design",
  "OOP",
  "Spring Boot",
  "Databases",
  "Problem Solving",
];
const InterviewStartPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [role, setRole] = useState(ROLES[0]);
  const [interviewType, setInterviewType] =
    useState<InterviewType>("TECHNICAL");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("MEDIUM");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [topicsText, setTopicsText] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [starting, setStarting] = useState(false);
  const handleStart = async () => {
    setStarting(true);
    try {
      const topics = topicsText
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const session = await interviewsApi.start({
        role,
        interviewType,
        difficulty,
        numberOfQuestions,
        topics: topics.length ? topics : undefined,
        durationMinutes,
      });
      navigate(`/interviews/${session.sessionId}`, {
        state: { session, videoEnabled },
      });
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    } finally {
      setStarting(false);
    }
  };
  return (
    <div className="max-w-2xl">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <h1 className="text-2xl font-bold text-slate-900">
          AI Mock Interview
        </h1>{" "}
        <Link
          to="/interviews/history"
          className="text-sm text-brand-600 hover:underline"
        >
          View History &rarr;
        </Link>{" "}
      </div>{" "}
      <p className="text-slate-500 mt-1">
        Customize your interview, then practice with live video, face, and
        speech analysis.
      </p>{" "}
      <div className="card p-6 mt-6 space-y-5">
        {" "}
        <div>
          {" "}
          <label className="label">Job Role</label>{" "}
          <select
            className="input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {" "}
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}{" "}
          </select>{" "}
        </div>{" "}
        <div>
          {" "}
          <label className="label">Interview Type</label>{" "}
          <div className="grid grid-cols-3 gap-3">
            {" "}
            {(["TECHNICAL", "HR", "MIXED"] as InterviewType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setInterviewType(t)}
                className={`rounded-lg border-2 px-4 py-2.5 text-sm font-medium ${interviewType === t ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600"}`}
              >
                {" "}
                {t.charAt(0) + t.slice(1).toLowerCase()}{" "}
              </button>
            ))}{" "}
          </div>{" "}
        </div>{" "}
        <div>
          {" "}
          <label className="label">Difficulty</label>{" "}
          <div className="grid grid-cols-3 gap-3">
            {" "}
            {(["EASY", "MEDIUM", "HARD"] as DifficultyLevel[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`rounded-lg border-2 px-4 py-2.5 text-sm font-medium ${difficulty === d ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600"}`}
              >
                {" "}
                {d.charAt(0) + d.slice(1).toLowerCase()}{" "}
              </button>
            ))}{" "}
          </div>{" "}
        </div>{" "}
        <div>
          {" "}
          <label className="label">Topics (comma separated)</label>{" "}
          <input
            className="input"
            placeholder={TOPIC_SUGGESTIONS.join(", ")}
            value={topicsText}
            onChange={(e) => setTopicsText(e.target.value)}
          />{" "}
          <div className="flex flex-wrap gap-2 mt-2">
            {" "}
            {TOPIC_SUGGESTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  const current = topicsText
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean);
                  setTopicsText(
                    current.includes(t)
                      ? current.filter((x) => x !== t).join(", ")
                      : [...current, t].join(", "),
                  );
                }}
                className="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-500 hover:border-brand-400 hover:text-brand-600"
              >
                {" "}
                {t}{" "}
              </button>
            ))}{" "}
          </div>{" "}
        </div>{" "}
        <div>
          {" "}
          <label className="label">
            Number of Questions: {numberOfQuestions}
          </label>{" "}
          <input
            type="range"
            min={1}
            max={10}
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
            className="w-full accent-brand-600"
          />{" "}
        </div>{" "}
        <div>
          {" "}
          <label className="label">
            Duration: {durationMinutes} minutes
          </label>{" "}
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className="w-full accent-brand-600"
          />{" "}
        </div>{" "}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
          {" "}
          <div>
            {" "}
            <p className="text-sm font-medium text-slate-800">
              Enable live video &amp; analysis
            </p>{" "}
            <p className="text-xs text-slate-500 mt-0.5">
              Uses your camera to gauge confidence, emotion, and speech pace.
              Voice answer input works on its own with just the microphone — you
              don't need this toggle to speak your answers. Click the mic button
              in the interview to start voice input.
            </p>{" "}
          </div>{" "}
          <button
            type="button"
            onClick={() => setVideoEnabled((v) => !v)}
            className={`relative w-12 h-7 rounded-full transition-colors ${videoEnabled ? "bg-emerald-500" : "bg-slate-300"}`}
            aria-pressed={videoEnabled}
          >
            {" "}
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${videoEnabled ? "left-[22px]" : "left-0.5"}`}
            />{" "}
          </button>{" "}
        </div>{" "}
        <button
          onClick={handleStart}
          disabled={starting}
          className="btn-primary w-full"
        >
          {" "}
          {starting ? "Starting Interview..." : "Start Interview"}{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
};
export default InterviewStartPage;
