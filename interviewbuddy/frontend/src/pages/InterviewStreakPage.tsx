import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  InterviewStreakCalendar,
  InterviewStreakOverview,
} from "../types";
import { interviewStreakApi } from "../api/interviewStreak";
import { getErrorMessage } from "../api/client";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import StreakSummary from "../components/StreakSummary";
import TodayPracticeCard from "../components/TodayPracticeCard";
import PracticeCalendar from "../components/PracticeCalendar";
import PracticeHistory from "../components/PracticeHistory";

const InterviewStreakPage: React.FC = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<InterviewStreakOverview | null>(null);
  const [calendar, setCalendar] = useState<InterviewStreakCalendar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    Promise.all([interviewStreakApi.overview(), interviewStreakApi.calendar(6)])
      .then(([ov, cal]) => {
        setOverview(ov);
        setCalendar(cal);
      })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingState label="Loading your streak..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!overview || !calendar) return null;

  return (
    <div className="max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">
          Interview Streak
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Practice one AI interview every day to build a lasting routine.
        </p>
      </header>

      <TodayPracticeCard
        data={overview}
        onPractice={() => navigate("/interviews")}
      />

      <StreakSummary data={overview} />

      <PracticeCalendar data={calendar} />

      <PracticeHistory data={calendar} />
    </div>
  );
};

export default InterviewStreakPage;