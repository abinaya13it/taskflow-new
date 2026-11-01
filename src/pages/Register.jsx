import { useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import ThemeToggle from "../components/ThemeToggle";

function Register() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister(event) {
        event.preventDefault();
        setError("");
        setSuccessMsg("");

        if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/register", {
                fullName: fullName.trim(),
                email: email.trim(),
                password
            });

            setSuccessMsg("Account created successfully! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.error || "Registration failed. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="auth-theme-toggle">
                <ThemeToggle showLabel={true} />
            </div>
            <div className="login-card">
                <div className="brand-header">
                    <span className="brand-badge">Java Full Stack</span>
                    <h1>TaskFlow Pro</h1>
                </div>

                <h2>Create Account</h2>
                <p>Register to manage your tasks effectively.</p>

                {error && <div className="error-message">{error}</div>}
                {successMsg && <div className="success-message">{successMsg}</div>}

                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p className="register-text">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;