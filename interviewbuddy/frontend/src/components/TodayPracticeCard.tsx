import React from "react";
import type { InterviewStreakOverview } from "../types";

const TodayPracticeCard: React.FC<{
  data: InterviewStreakOverview;
  onPractice: () => void;
}> = ({ data, onPractice }) => {
  if (data.todayCompleted) {
    return (
      <section className="card p-6 flex items-center gap-4">
        <div className="h-12 w-12 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl">
          &#10003;
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">
            Today&rsquo;s practice completed
          </p>
          <p className="text-sm text-slate-500 mt-0.5">
            Come back tomorrow to extend your streak.
          </p>
        </div>
        <button
          onClick={onPractice}
          className="btn-secondary text-xs whitespace-nowrap"
        >
          Practice again
        </button>
      </section>
    );
  }

  return (
    <section className="card !border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-6">
      <p className="text-base font-bold text-slate-900">
        {data.currentStreak > 0
          ? `You're on a ${data.currentStreak}-day streak \u2014 keep it alive.`
          : "Start your interview streak today."}
      </p>
      <p className="text-sm text-slate-600 mt-1">
        Complete one AI interview session today to mark this day as practiced.
      </p>
      <button onClick={onPractice} className="btn-primary mt-4">
        Practice Today&rsquo;s Question
      </button>
    </section>
  );
};

export default TodayPracticeCard;