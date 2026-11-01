import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "../styles/Navbar.css";

function Navbar({ onOpenNewTask, onOpenProfile, user }) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("taskflow_user");
        localStorage.removeItem("taskflow_token");
        navigate("/login");
    }

    // Helper for initials
    const initials = user?.fullName
        ? user.fullName
              .trim()
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
        : "U";

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/dashboard" className="brand-logo">
                    <span className="logo-icon">⚡</span>
                    <h2>TaskFlow Pro</h2>
                </Link>
                <span className="backend-tag">Spring Boot 3 + JPA</span>
            </div>

            <div className="nav-actions">
                {onOpenNewTask && (
                    <button className="nav-btn-create" onClick={onOpenNewTask}>
                        + New Task
                    </button>
                )}

                {/* Theme Toggle (Sun / Moon) */}
                <div className="nav-theme-wrap" title="Toggle Theme">
                    <ThemeToggle />
                </div>

                {/* Clickable User Profile Pill to view / edit details */}
                <button
                    type="button"
                    className="user-profile-btn"
                    onClick={onOpenProfile}
                    title="Click to view User Details & Profile"
                >
                    <span className="user-nav-avatar">{initials}</span>
                    <div className="user-nav-info">
                        <span className="user-nav-name">{user?.fullName || "User"}</span>
                        <span className="user-nav-role">{user?.role || "Pro Member"}</span>
                    </div>
                    <span className="user-nav-caret">▾</span>
                </button>

                <button className="btn-logout" onClick={handleLogout} title="Sign Out">
                    Sign Out
                </button>
            </div>
        </nav>
    );
}

export default Navbar;