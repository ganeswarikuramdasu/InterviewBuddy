import React from "react";
import type { InterviewStreakOverview } from "../types";

const Stat: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="rounded-lg bg-slate-50 px-4 py-3 text-center">
    <p className="text-xl font-extrabold text-slate-900">{value}</p>
    <p className="text-xs text-slate-500 mt-0.5">{label}</p>
  </div>
);

const StreakSummary: React.FC<{ data: InterviewStreakOverview }> = ({
  data,
}) => {
  const { currentStreak, todayCompleted, today, lastPracticeDate } = data;

  let statusMessage = "Your previous streak ended, but you can start a new one today.";
  if (todayCompleted) {
    statusMessage = "You practiced today \u2014 keep the momentum going!";
  } else if (currentStreak > 0) {
    statusMessage = "Practice today to keep your streak alive.";
  }

  const lastPracticed = lastPracticeDate
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
      }).format(new Date(`${lastPracticeDate}T00:00:00`))
    : "No practice yet";
  const hasPracticeYet = lastPracticeDate !== null && lastPracticeDate <= today;

  return (
    <section className="card overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-8 text-center">
        <p className="text-6xl font-extrabold text-white drop-shadow-sm">
          {currentStreak}
          <span className="ml-2 text-3xl align-middle">&#x1F525;</span>
        </p>
        <p className="text-indigo-100 text-sm font-medium mt-1">
          Current Streak {currentStreak === 1 ? "Day" : "Days"}
        </p>
      </div>
      <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-3 text-center">
        <p className="text-sm text-indigo-800 font-medium">{statusMessage}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 p-6">
        <Stat label="Longest Streak" value={data.longestStreak} />
        <Stat label="Total Practice Days" value={data.totalPracticeDays} />
        <Stat
          label="Last Practiced"
          value={hasPracticeYet ? lastPracticed.split(",")[0] : lastPracticed}
        />
      </div>
    </section>
  );
};

export default StreakSummary;