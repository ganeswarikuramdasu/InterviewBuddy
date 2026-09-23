import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/admin";
import type { Page, Role, UserResponse } from "../../types";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import Pagination from "../../components/Pagination";
import ConfirmDialog from "../../components/ConfirmDialog";
import { getErrorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";

const AdminUsersPage: React.FC = () => {
  const { showToast } = useToast();
  const [data, setData] = useState<Page<UserResponse> | null>(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [page, setPage] = useState(0);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<UserResponse | null>(null);

  const load = () => {
    setError("");
    adminApi
      .searchUsers({
        search: search || undefined,
        role: (role || undefined) as Role | undefined,
        page,
        size: 15,
      })
      .then(setData)
      .catch((e) => setError(getErrorMessage(e)));
  };

  useEffect(load, [page, role]); // eslint-disable-line react-hooks/exhaustive-deps -- search is handled by the debounced effect below

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0);
      load();
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const toggleEnabled = async (u: UserResponse, enabled: boolean) => {
    try {
      await adminApi.setUserEnabled(u.id, enabled);
      showToast(`${u.fullName} ${enabled ? "enabled" : "disabled"}`, "success");
      load();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await adminApi.deleteUser(confirmDelete.id);
      showToast("User deleted", "success");
      setConfirmDelete(null);
      load();
    } catch (e) {
      showToast(getErrorMessage(e), "error");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>

      <div className="flex flex-wrap gap-3 mt-4">
        <input
          className="input max-w-xs"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input max-w-[140px]"
          value={role}
          onChange={(e) => {
            setRole(e.target.value as Role | "");
            setPage(0);
          }}
        >
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !data && <LoadingState />}

      {!error && data && (
        <div className="mt-6 card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3">College</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.content.map((u) => (
                <tr key={u.id}>
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {u.fullName}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className="badge bg-slate-100 text-slate-600">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {u.college || "—"}
                  </td>
                  <td className="px-5 py-3 flex gap-2">
                    <button
                      onClick={() => toggleEnabled(u, false)}
                      className="text-xs text-amber-600 hover:underline"
                    >
                      Disable
                    </button>
                    <button
                      onClick={() => setConfirmDelete(u)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {data.content.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-slate-400"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {data && (
        <Pagination
          page={data.number}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete user?"
        description={`This will permanently delete ${confirmDelete?.fullName}'s account.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default AdminUsersPage;
