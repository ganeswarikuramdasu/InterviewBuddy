import React from "react";
import { Link } from "react-router-dom";
const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    {" "}
    <p className="text-6xl font-extrabold text-brand-600">404</p>{" "}
    <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>{" "}
    <p className="mt-2 text-slate-500">
      The page you&apos;re looking for doesn&apos;t exist.
    </p>{" "}
    <Link to="/" className="btn-primary mt-6">
      Go Home
    </Link>{" "}
  </div>
);
export default NotFoundPage;
