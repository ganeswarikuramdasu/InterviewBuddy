import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { authApi } from "../api/auth";
import { getErrorMessage } from "../api/client";

const ProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    phone: user?.phone ?? "",
    college: user?.college ?? "",
    branch: user?.branch ?? "",
    graduationYear: user?.graduationYear?.toString() ?? "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await authApi.updateProfile({
        fullName: form.fullName,
        phone: form.phone,
        college: form.college,
        branch: form.branch,
        graduationYear: form.graduationYear
          ? Number(form.graduationYear)
          : undefined,
      } as any);
      await refreshProfile();
      showToast("Profile updated successfully", "success");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    if (pwForm.newPassword.length < 8) {
      showToast("New password must be at least 8 characters", "error");
      return;
    }
    setSavingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      showToast("Password changed successfully", "success");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
      <p className="text-slate-500 mt-1">
        Manage your personal information and account security.
      </p>

      <form onSubmit={handleProfileSubmit} className="card p-6 mt-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Personal Information</h2>
        <div>
          <label className="label">Email</label>
          <input className="input bg-slate-50" value={user?.email} disabled />
        </div>
        <div>
          <label className="label" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            className="input"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="graduationYear">
              Graduation Year
            </label>
            <input
              id="graduationYear"
              type="number"
              className="input"
              value={form.graduationYear}
              onChange={(e) =>
                setForm({ ...form, graduationYear: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="college">
              College
            </label>
            <input
              id="college"
              className="input"
              value={form.college}
              onChange={(e) => setForm({ ...form, college: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="branch">
              Branch
            </label>
            <input
              id="branch"
              className="input"
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
            />
          </div>
        </div>
        <button type="submit" disabled={savingProfile} className="btn-primary">
          {savingProfile ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="card p-6 mt-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Change Password</h2>
        <div>
          <label className="label" htmlFor="currentPassword">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            required
            className="input"
            value={pwForm.currentPassword}
            onChange={(e) =>
              setPwForm({ ...pwForm, currentPassword: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              minLength={8}
              className="input"
              value={pwForm.newPassword}
              onChange={(e) =>
                setPwForm({ ...pwForm, newPassword: e.target.value })
              }
            />
          </div>
          <div>
            <label className="label" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              className="input"
              value={pwForm.confirmPassword}
              onChange={(e) =>
                setPwForm({ ...pwForm, confirmPassword: e.target.value })
              }
            />
          </div>
        </div>
        <button type="submit" disabled={savingPassword} className="btn-primary">
          {savingPassword ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
