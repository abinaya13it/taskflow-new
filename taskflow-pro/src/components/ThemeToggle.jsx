import { useTheme } from "../context/ThemeContext";
import "../styles/ThemeToggle.css";

function ThemeToggle({ showLabel = false, className = "" }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            className={`theme-toggle-btn ${isDark ? "is-dark" : "is-light"} ${className}`}
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
        >
            <div className="toggle-track">
                <span className="toggle-thumb">
                    {isDark ? "🌙" : "☀️"}
                </span>
            </div>
            {showLabel && (
                <span className="toggle-label">
                    {isDark ? "Dark Mode" : "Light Mode"}
                </span>
            )}
        </button>
    );
}

export default ThemeToggle;
