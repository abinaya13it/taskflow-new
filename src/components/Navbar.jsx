import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ onOpenNewTask }) {
    const navigate = useNavigate();
    const user = useMemo(() => {
        try {
            const storedUser = localStorage.getItem("taskflow_user");
            return storedUser ? JSON.parse(storedUser) : { fullName: "User" };
        } catch {
            return { fullName: "User" };
        }
    }, []);

    function handleLogout() {
        localStorage.removeItem("taskflow_user");
        localStorage.removeItem("taskflow_token");
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/dashboard" className="brand-logo">
                    <span className="logo-icon">⚡</span>
                    <h2>TaskFlow Pro</h2>
                </Link>
                <span className="backend-tag">Spring Boot 3 + MySQL</span>
            </div>

            <div className="nav-actions">
                {onOpenNewTask && (
                    <button className="nav-btn-create" onClick={onOpenNewTask}>
                        + New Task
                    </button>
                )}

                <div className="user-profile">
                    <span className="avatar">👤</span>
                    <span className="user-name">{user.fullName || "User"}</span>
                </div>

                <button className="btn-logout" onClick={handleLogout} title="Logout">
                    Sign Out
                </button>
            </div>
        </nav>
    );
}

export default Navbar;