import React from "react";
import type { InterviewStreakCalendar } from "../types";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

const pad = (n: number) => String(n).padStart(2, "0");
const dayKey = (y: number, m: number, d: number) =>
  `${y}-${pad(m + 1)}-${pad(d)}`;

const MonthPanel: React.FC<{
  year: number;
  month: number;
  today: string;
  practiced: Set<string>;
}> = ({ year, month, today, practiced }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
  const monthLabel = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(new Date(year, month, 1));

  return (
    <div className="card p-4">
      <p className="text-sm font-semibold text-slate-800 mb-3">{monthLabel}</p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="text-[10px] font-medium text-slate-400 py-1"
          >
            {w}
          </span>
        ))}
        {Array.from({ length: totalCells }, (_, i) => {
          const day = i - offset + 1;
          if (day < 1 || day > daysInMonth) return <span key={i} />;
          const key = dayKey(year, month, day);
          const isPracticed = practiced.has(key);
          const isToday = key === today;
          return (
            <span
              key={key}
              className={`h-7 flex items-center justify-center rounded-md text-[11px] font-medium ${
                isPracticed
                  ? "bg-emerald-500 text-white shadow-sm"
                  : isToday
                    ? "ring-2 ring-inset ring-indigo-500 text-indigo-600 font-bold"
                    : "text-slate-400"
              }`}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const PracticeCalendar: React.FC<{ data: InterviewStreakCalendar }> = ({
  data,
}) => {
  const practiced = new Set(data.practiceDays.map((p) => p.date));
  const [todayDate, monthsToShow] = (() => {
    const t = new Date(`${data.today}T00:00:00`);
    return [t, 6];
  })();

  const panels = Array.from({ length: monthsToShow }, (_, i) => {
    const dt = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth() - (monthsToShow - 1 - i),
      1,
    );
    return { year: dt.getFullYear(), month: dt.getMonth() };
  });

  return (
    <section>
      <h2 className="font-semibold text-slate-900 mb-3">Practice Activity</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {panels.map((p) => (
          <MonthPanel
            key={`${p.year}-${p.month}`}
            year={p.year}
            month={p.month}
            today={data.today}
            practiced={practiced}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-500 inline-block" />
          Practiced
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded ring-2 ring-inset ring-indigo-500 inline-block" />
          Today
        </span>
      </div>
    </section>
  );
};

export default PracticeCalendar;