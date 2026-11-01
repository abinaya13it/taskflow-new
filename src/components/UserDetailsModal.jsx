import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";
import "../styles/UserDetails.css";

function UserDetailsModal({ isOpen, onClose, user, stats, onUserUpdated, onLogout }) {
    const { theme, setTheme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [role, setRole] = useState(user?.role || "Full Stack Developer");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

    if (!isOpen || !user) return null;

    // Helper to extract initials
    function getInitials(name) {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    // Helper to format date
    function formatDate(dateStr) {
        if (!dateStr) return "Active Member";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        } catch {
            return "Active Member";
        }
    }

    async function handleSaveProfile(e) {
        e.preventDefault();
        setStatusMsg({ type: "", text: "" });

        if (!fullName.trim()) {
            setStatusMsg({ type: "error", text: "Full name cannot be blank." });
            return;
        }

        try {
            setSaving(true);
            const payload = {
                fullName: fullName.trim(),
                role: role.trim()
            };

            if (newPassword) {
                if (newPassword.length < 6) {
                    setStatusMsg({ type: "error", text: "New password must be at least 6 characters." });
                    setSaving(false);
                    return;
                }
                payload.currentPassword = currentPassword;
                payload.newPassword = newPassword;
            }

            const response = await api.put(`/api/auth/profile/${user.id}`, payload);
            const updatedUser = response.data;

            // Sync updated info into localStorage
            const stored = JSON.parse(localStorage.getItem("taskflow_user") || "{}");
            const merged = { ...stored, ...updatedUser };
            localStorage.setItem("taskflow_user", JSON.stringify(merged));

            if (onUserUpdated) {
                onUserUpdated(merged);
            }

            setStatusMsg({ type: "success", text: "Profile updated successfully!" });
            setCurrentPassword("");
            setNewPassword("");
            setTimeout(() => {
                setIsEditing(false);
                setStatusMsg({ type: "", text: "" });
            }, 1200);
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to update profile.";
            setStatusMsg({ type: "error", text: msg });
        } finally {
            setSaving(false);
        }
    }

    const initials = getInitials(user.fullName);
    const completionRate = stats?.total > 0
        ? Math.round((stats.completed / stats.total) * 100)
        : 0;

    return (
        <div className="user-modal-backdrop" onClick={onClose}>
            <div className="user-modal-card" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="user-modal-header">
                    <div className="header-title-wrap">
                        <span className="badge-pill">Account Profile</span>
                        <h2>User Details</h2>
                    </div>
                    <button className="user-modal-close" onClick={onClose} title="Close">
                        ✕
                    </button>
                </div>

                {/* Hero Profile Header */}
                <div className="user-hero-card">
                    <div className="user-avatar-large">
                        <span>{initials}</span>
                    </div>
                    <div className="user-hero-info">
                        <div className="user-name-row">
                            <h3>{user.fullName || "User"}</h3>
                            <span className="user-role-badge">{user.role || "Pro Member"}</span>
                        </div>
                        <p className="user-email-text">
                            📧 {user.email} <span className="verified-tag">✓ Verified</span>
                        </p>
                        <div className="user-meta-pills">
                            <span className="meta-pill">ID: #{user.id}</span>
                            <span className="meta-pill">Member since: {formatDate(user.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Status message */}
                {statusMsg.text && (
                    <div className={`status-banner ${statusMsg.type}`}>
                        {statusMsg.type === "success" ? "✓ " : "⚠️ "}
                        {statusMsg.text}
                    </div>
                )}

                {/* Modal Body */}
                <div className="user-modal-body">
                    {/* Productivity Stats Grid */}
                    <div className="section-title">Productivity Overview</div>
                    <div className="user-stats-row">
                        <div className="user-stat-box">
                            <span className="stat-num">{stats?.total || 0}</span>
                            <span className="stat-txt">Total Tasks</span>
                        </div>
                        <div className="user-stat-box in-prog">
                            <span className="stat-num">{stats?.inProgress || 0}</span>
                            <span className="stat-txt">In Progress</span>
                        </div>
                        <div className="user-stat-box comp">
                            <span className="stat-num">{stats?.completed || 0}</span>
                            <span className="stat-txt">Completed</span>
                        </div>
                        <div className="user-stat-box rate">
                            <span className="stat-num">{completionRate}%</span>
                            <span className="stat-txt">Completion</span>
                        </div>
                    </div>

                    {/* Theme Preference Option */}
                    <div className="section-title">Theme Preference</div>
                    <div className="theme-selector-grid">
                        <button
                            type="button"
                            className={`theme-option-card ${theme === "light" ? "active" : ""}`}
                            onClick={() => setTheme("light")}
                        >
                            <span className="theme-icon">☀️</span>
                            <div className="theme-info">
                                <strong>Light Mode</strong>
                                <span>Crisp & Clean daylight contrast</span>
                            </div>
                            {theme === "light" && <span className="theme-check">✓</span>}
                        </button>

                        <button
                            type="button"
                            className={`theme-option-card ${theme === "dark" ? "active" : ""}`}
                            onClick={() => setTheme("dark")}
                        >
                            <span className="theme-icon">🌙</span>
                            <div className="theme-info">
                                <strong>Dark Mode</strong>
                                <span>Sleek midnight palette</span>
                            </div>
                            {theme === "dark" && <span className="theme-check">✓</span>}
                        </button>
                    </div>

                    {/* Profile Information / Edit Form */}
                    <div className="profile-edit-header">
                        <div className="section-title" style={{ margin: 0 }}>Account Information</div>
                        <button
                            type="button"
                            className="btn-toggle-edit"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? "Cancel Editing" : "✏️ Edit Profile"}
                        </button>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSaveProfile} className="profile-edit-form">
                            <div className="profile-form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Your Full Name"
                                    required
                                />
                            </div>

                            <div className="profile-form-group">
                                <label>Role / Job Title</label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g. Full Stack Developer, Tech Lead"
                                />
                            </div>

                            <div className="profile-password-section">
                                <span className="section-subtext">Optional: Change Password</span>
                                <div className="profile-form-group">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password to change"
                                    />
                                </div>
                                <div className="profile-form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min 6 characters"
                                    />
                                </div>
                            </div>

                            <div className="profile-form-actions">
                                <button
                                    type="button"
                                    className="btn-cancel-edit"
                                    onClick={() => setIsEditing(false)}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save-profile" disabled={saving}>
                                    {saving ? "Saving Changes..." : "Save Profile Details"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-readonly-grid">
                            <div className="readonly-item">
                                <span className="item-label">Full Name</span>
                                <span className="item-value">{user.fullName}</span>
                            </div>
                            <div className="readonly-item">
                                <span className="item-label">Email Address</span>
                                <span className="item-value">{user.email}</span>
                            </div>
                            <div className="readonly-item">
                                <span className="item-label">Account Role</span>
                                <span className="item-value">{user.role || "Full Stack Developer"}</span>
                            </div>
                            <div className="readonly-item">
                                <span className="item-label">Backend Database</span>
                                <span className="item-value">Spring Data JPA / H2 / MySQL</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="user-modal-footer">
                    <button className="btn-modal-logout" onClick={onLogout}>
                        🚪 Sign Out
                    </button>
                    <button className="btn-modal-done" onClick={onClose}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserDetailsModal;
