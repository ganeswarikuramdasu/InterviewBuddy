import React from "react";
import { Link } from "react-router-dom";
const features = [
  {
    id: "crt",
    title: "CRT Preparation",
    desc: "Master Aptitude, Reasoning, and Verbal Ability with structured Learn, Practice, and Test modules covering every campus placement topic.",
    icon: "\u{1F4DA}",
  },
  {
    id: "coding",
    title: "Coding Sheets & Patterns",
    desc: "Practice curated sheets like Neetcode 150 and Blind 75, organized by problem patterns, with direct links to LeetCode, CodeChef, and Codeforces. Track your progress as you go.",
    icon: "\u2328",
  },
  {
    id: "interviews",
    title: "AI Interviews",
    desc: "Practice Technical, HR, and Mixed mock interviews with AI-powered evaluation across relevance, clarity, and communication.",
    icon: "\u{1F399}",
  },
  {
    id: "learning",
    title: "Learning Resources",
    desc: "Structured articles, notes, and courses covering Java, Spring Boot, DSA, SQL, DBMS, OS, Networks, OOP, and System Design.",
    icon: "\u{1F393}",
  },
  {
    id: "progress",
    title: "Progress Tracking",
    desc: "A personalized dashboard tracks your CRT accuracy, coding sheet progress, interview scores, and learning completion.",
    icon: "\u{1F4C8}",
  },
];
const LandingPage: React.FC = () => {
  return (
    <div>
      {" "}
      {/* Hero */}{" "}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          {" "}
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-semibold px-3 py-1 mb-6 shadow-md shadow-indigo-500/25">
            {" "}
            AI-Powered Interview &amp; Placement Preparation{" "}
          </span>{" "}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            {" "}
            <span className="bg-gradient-to-r from-indigo-600 via-brand-500 to-violet-500 bg-clip-text text-transparent">
              Prepare Smarter.
            </span>
            <br /> Perform Better.{" "}
          </h1>{" "}
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600">
            {" "}
            InterviewBuddy helps students prepare for placement aptitude,
            reasoning, verbal ability, coding interviews, technical interviews,
            HR interviews, and coding sheets - all in one platform.{" "}
          </p>{" "}
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            {" "}
            <Link to="/register" className="btn-primary text-base px-6 py-3">
              Start Preparing
            </Link>{" "}
            <a href="#features" className="btn-secondary text-base px-6 py-3">
              Explore Features
            </a>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Feature cards */}{" "}
      <section
        id="features"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        {" "}
        <div className="text-center mb-12">
          {" "}
          <h2 className="text-3xl font-bold text-slate-900">
            Everything you need to get placement-ready
          </h2>{" "}
          <p className="mt-3 text-slate-600">
            Six focused modules, one connected platform.
          </p>{" "}
        </div>{" "}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {" "}
          {features.map((f) => (
            <div
              key={f.id}
              id={f.id}
              className="card p-6 hover:shadow-md transition-shadow"
            >
              {" "}
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-brand-100 to-violet-100 text-brand-600 flex items-center justify-center text-2xl mb-4">
                {f.icon}
              </div>{" "}
              <h3 className="font-semibold text-slate-900 text-lg">
                {f.title}
              </h3>{" "}
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* Detail sections */}{" "}
      <section className="bg-white border-y border-slate-200 py-20">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          {" "}
          <div>
            {" "}
            <span className="inline-flex items-center rounded-full bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 mb-4">
              CRT MODULE
            </span>{" "}
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Structured CRT preparation, topic by topic
            </h2>{" "}
            <p className="text-slate-600 mb-6">
              {" "}
              Every Aptitude, Reasoning, and Verbal topic follows a consistent
              Learn &rarr; Practice &rarr; Test flow, so you build concepts
              before testing yourself under timed conditions.{" "}
            </p>{" "}
            <ul className="space-y-3 text-sm text-slate-700">
              {" "}
              <li className="flex gap-2">
                <span className="text-brand-500">&#10003;</span> Concept
                explanations with formulas and examples
              </li>{" "}
              <li className="flex gap-2">
                <span className="text-brand-500">&#10003;</span> Instant
                feedback practice questions
              </li>{" "}
              <li className="flex gap-2">
                <span className="text-brand-500">&#10003;</span> Timed tests
                with detailed topic-wise results
              </li>{" "}
            </ul>{" "}
          </div>{" "}
          <div className="card p-6">
            {" "}
            <div className="flex items-center justify-between mb-4">
              {" "}
              <span className="font-semibold text-slate-900">
                Percentages &mdash; Aptitude
              </span>{" "}
              <span className="badge bg-emerald-100 text-emerald-700">
                EASY
              </span>{" "}
            </div>{" "}
            <p className="text-sm text-slate-600 mb-4">What is 25% of 480?</p>{" "}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {" "}
              <div className="rounded-lg border border-slate-200 px-3 py-2">
                A. 100
              </div>{" "}
              <div className="rounded-lg border-2 border-brand-500 bg-brand-50 px-3 py-2 font-medium">
                B. 120
              </div>{" "}
              <div className="rounded-lg border border-slate-200 px-3 py-2">
                C. 110
              </div>{" "}
              <div className="rounded-lg border border-slate-200 px-3 py-2">
                D. 90
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* CTA */}{" "}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {" "}
        <h2 className="text-3xl font-bold text-slate-900">
          Ready to start preparing?
        </h2>{" "}
        <p className="mt-3 text-slate-600 max-w-xl mx-auto">
          {" "}
          Create your free account and get instant access to CRT, coding sheets
          & patterns, AI interviews, and learning resources.{" "}
        </p>{" "}
        <Link
          to="/register"
          className="btn-primary text-base px-6 py-3 mt-8 inline-flex"
        >
          Create Free Account
        </Link>{" "}
      </section>{" "}
    </div>
  );
};
export default LandingPage;
