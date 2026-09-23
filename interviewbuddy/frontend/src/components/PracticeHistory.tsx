import React from "react";
import { Link } from "react-router-dom";
import type { InterviewStreakCalendar } from "../types";

const PracticeHistory: React.FC<{ data: InterviewStreakCalendar }> = ({
  data,
}) => {
  const practiced = new Map(
    data.practiceDays.map((p) => [p.date, p.referenceId]),
  );
  const today = new Date(`${data.today}T00:00:00`);

  const last14 = Array.from({ length: 14 }, (_, i) => {
    const dt = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (13 - i),
    );
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(dt.getDate()).padStart(2, "0")}`;
    const label = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(dt);
    const isToday = key === data.today;
    return { key, label, isToday };
  });

  return (
    <section>
      <h2 className="font-semibold text-slate-900 mb-3">Recent Practice</h2>
      <div className="card divide-y divide-slate-100">
        {last14.map((d) => {
          const referenceId = practiced.get(d.key) ?? null;
          return (
            <div
              key={d.key}
              className="flex items-center gap-3 px-4 py-2.5"
            >
              <span className="text-sm text-slate-600 w-36 shrink-0">
                {d.isToday ? `${d.label} \u00b7 Today` : d.label}
              </span>
              {referenceId !== null ? (
                <Link
                  to={`/interviews/${referenceId}/result`}
                  className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                  Completed AI Interview
                </Link>
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 text-sm ${
                    d.isToday ? "text-slate-400 font-medium" : "text-slate-300"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full inline-block ${
                      d.isToday ? "bg-slate-300" : "bg-slate-200"
                    }`}
                  />
                  {d.isToday ? "No practice yet today" : "Missed"}
                </span>
              )}
            </div>
          );
        })}
        {data.practiceDays.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-slate-400">
            No practice days yet \u2014 complete your first AI interview to see
            activity here.
          </div>
        )}
      </div>
    </section>
  );
};

export default PracticeHistory;