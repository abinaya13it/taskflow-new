import { useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Please fill in both email and password.");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/login", {
                email: email.trim(),
                password
            });

            if (response.data.user) {
                localStorage.setItem("taskflow_user", JSON.stringify(response.data.user));
            }
            if (response.data.token) {
                localStorage.setItem("taskflow_token", response.data.token);
            }

            navigate("/dashboard");
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.error || "Login failed. Check your email and password.";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="brand-header">
                    <span className="brand-badge">Java Full Stack</span>
                    <h1>TaskFlow Pro</h1>
                </div>

                <h2>Welcome Back 👋</h2>
                <p>Sign in to manage and track your projects.</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <p className="register-text">
                    Don't have an account? <Link to="/register">Create Account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;