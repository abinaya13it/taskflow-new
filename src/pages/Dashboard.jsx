import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const [currentUser] = useState(() => {
        try {
            const stored = localStorage.getItem("taskflow_user");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");

    // Modal state for Add/Edit
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: ""
    });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState("");

    // Check login state and load initial data
    useEffect(() => {
        if (!currentUser) {
            navigate("/login");
            return;
        }
        fetchTasks();
        fetchStats();
    }, [currentUser, navigate]);

    function showToast(message) {
        setToast(message);
        setTimeout(() => setToast(""), 3000);
    }

    async function fetchTasks() {
        try {
            setLoading(true);
            const response = await api.get("/api/tasks");
            setTasks(response.data);
            setError("");
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
            setError("Could not load tasks from Spring Boot backend.");
        } finally {
            setLoading(false);
        }
    }

    async function fetchStats() {
        try {
            const response = await api.get("/api/tasks/stats");
            setStats(response.data);
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        }
    }

    function openCreateModal() {
        setEditingTask(null);
        setFormData({
            title: "",
            description: "",
            status: "TODO",
            priority: "MEDIUM",
            dueDate: new Date().toISOString().split("T")[0]
        });
        setModalOpen(true);
    }

    function openEditModal(task) {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description || "",
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate || ""
        });
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditingTask(null);
    }

    async function handleSubmitTask(e) {
        e.preventDefault();
        if (!formData.title.trim()) return;

        setSaving(true);
        try {
            const payload = {
                title: formData.title.trim(),
                description: formData.description,
                status: formData.status,
                priority: formData.priority,
                dueDate: formData.dueDate ? formData.dueDate : null,
                userId: currentUser?.id
            };

            if (editingTask) {
                await api.put(`/api/tasks/${editingTask.id}`, payload);
                showToast("Task updated successfully!");
            } else {
                await api.post("/api/tasks", payload);
                showToast("Task created successfully!");
            }

            closeModal();
            fetchTasks();
            fetchStats();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save task.");
        } finally {
            setSaving(false);
        }
    }

    async function handleStatusChange(taskId, newStatus) {
        try {
            await api.patch(`/api/tasks/${taskId}/status`, { status: newStatus });
            showToast(`Status updated to ${newStatus.replace("_", " ")}`);
            fetchTasks();
            fetchStats();
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update task status.");
        }
    }

    async function handleDeleteTask(taskId) {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            await api.delete(`/api/tasks/${taskId}`);
            showToast("Task deleted successfully.");
            fetchTasks();
            fetchStats();
        } catch (err) {
            console.error("Failed to delete task:", err);
            alert("Failed to delete task.");
        }
    }

    // Filtered tasks
    const filteredTasks = useMemo(() => {
        return tasks.filter((t) => {
            const matchesSearch =
                t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
            const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tasks, searchQuery, statusFilter, priorityFilter]);

    return (
        <div className="dashboard-page">
            <Navbar onOpenNewTask={openCreateModal} />

            {toast && <div className="toast-notification">{toast}</div>}

            <main className="dashboard-content">
                {/* Header Banner */}
                <div className="dashboard-header">
                    <div>
                        <h1>Welcome back, {currentUser?.fullName || "User"}! 👋</h1>
                        <p className="subtitle">
                            Here is an overview of your projects and deliverables.
                        </p>
                    </div>
                    <button className="btn-create-task" onClick={openCreateModal}>
                        + Add New Task
                    </button>
                </div>

                {/* Metrics Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card total" onClick={() => setStatusFilter("ALL")}>
                        <div className="stat-icon">📋</div>
                        <div className="stat-info">
                            <span className="stat-label">Total Tasks</span>
                            <span className="stat-value">{stats.total}</span>
                        </div>
                    </div>
                    <div className="stat-card todo" onClick={() => setStatusFilter("TODO")}>
                        <div className="stat-icon">⏳</div>
                        <div className="stat-info">
                            <span className="stat-label">To Do</span>
                            <span className="stat-value">{stats.todo}</span>
                        </div>
                    </div>
                    <div className="stat-card in-progress" onClick={() => setStatusFilter("IN_PROGRESS")}>
                        <div className="stat-icon">🚀</div>
                        <div className="stat-info">
                            <span className="stat-label">In Progress</span>
                            <span className="stat-value">{stats.inProgress}</span>
                        </div>
                    </div>
                    <div className="stat-card completed" onClick={() => setStatusFilter("COMPLETED")}>
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <span className="stat-label">Completed</span>
                            <span className="stat-value">{stats.completed}</span>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="controls-bar">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search tasks by title or details..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="ALL">All Priorities</option>
                            <option value="HIGH">High Priority</option>
                            <option value="MEDIUM">Medium Priority</option>
                            <option value="LOW">Low Priority</option>
                        </select>
                    </div>
                </div>

                {/* Tasks Content */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading your tasks from Java Spring Boot...</p>
                    </div>
                ) : error ? (
                    <div className="error-banner">
                        <p>{error}</p>
                        <button onClick={fetchTasks} className="btn-retry">Retry Connection</button>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📝</div>
                        <h3>No tasks found</h3>
                        <p>Get started by creating your first task in TaskFlow Pro.</p>
                        <button className="btn-create-task" onClick={openCreateModal}>
                            + Create a Task
                        </button>
                    </div>
                ) : (
                    <div className="tasks-grid">
                        {filteredTasks.map((task) => (
                            <div key={task.id} className={`task-card status-${task.status.toLowerCase()}`}>
                                <div className="task-card-header">
                                    <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                                        {task.priority}
                                    </span>
                                    <div className="task-actions">
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => openEditModal(task)}
                                            title="Edit Task"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => handleDeleteTask(task.id)}
                                            title="Delete Task"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                <h3 className="task-title">{task.title}</h3>
                                {task.description && (
                                    <p className="task-desc">{task.description}</p>
                                )}

                                <div className="task-footer">
                                    <div className="due-date">
                                        📅 {task.dueDate ? task.dueDate : "No due date"}
                                    </div>

                                    <div className="status-selector">
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            className={`status-select status-${task.status.toLowerCase()}`}
                                        >
                                            <option value="TODO">To Do</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create/Edit Task Modal */}
            {modalOpen && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingTask ? "Edit Task" : "Create New Task"}</h2>
                            <button className="modal-close" onClick={closeModal}>✕</button>
                        </div>

                        <form onSubmit={handleSubmitTask}>
                            <div className="form-group">
                                <label>Task Title *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Design Spring Boot architecture"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    rows="3"
                                    placeholder="Enter task details, notes or instructions..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Due Date</label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={closeModal} disabled={saving}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save" disabled={saving}>
                                    {saving ? "Saving..." : editingTask ? "Update Task" : "Create Task"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
