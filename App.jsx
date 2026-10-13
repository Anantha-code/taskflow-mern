import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  }

  async function loadTasks() {
    setLoading(true);
    try {
      setTasks(await request("/tasks"));
      setMessage("");
    } catch (error) {
      setMessage(`${error.message}. Check that the backend and MongoDB are running.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const visibleTasks = useMemo(() => {
    if (filter === "completed") return tasks.filter((task) => task.completed);
    if (filter === "pending") return tasks.filter((task) => !task.completed);
    return tasks;
  }, [tasks, filter]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setMessage("Please enter a task title.");
      return;
    }

    try {
      if (editingId) {
        await request(`/tasks/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({ title: title.trim(), description }),
        });
        setMessage("Task updated.");
      } else {
        await request("/tasks", {
          method: "POST",
          body: JSON.stringify({ title: title.trim(), description }),
        });
        setMessage("Task added.");
      }
      resetForm();
      await loadTasks();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function startEdit(task) {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggleTask(id) {
    try {
      await request(`/tasks/${id}/toggle`, { method: "PATCH" });
      await loadTasks();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Delete this task?")) return;
    try {
      await request(`/tasks/${id}`, { method: "DELETE" });
      setMessage("Task deleted.");
      if (editingId === id) resetForm();
      await loadTasks();
    } catch (error) {
      setMessage(error.message);
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="TaskFlow home">
          <span className="brand-mark">✓</span>
          <span>TaskFlow</span>
        </a>
        <span className="topbar-label">A simple space to get things done</span>
      </header>

      <section className="hero">
        <p className="eyebrow">YOUR DAY, ORGANIZED</p>
        <h1>Small steps.<br /><span>Real progress.</span></h1>
        <p className="hero-copy">Capture your tasks, keep your focus, and make today count.</p>
        <div className="stats">
          <div className="stat-card"><span>Total tasks</span><strong>{tasks.length}</strong></div>
          <div className="stat-card"><span>Completed</span><strong>{completedCount}</strong></div>
          <div className="stat-card"><span>Still to do</span><strong>{tasks.length - completedCount}</strong></div>
        </div>
      </section>

      <section className="workspace">
        <form className="task-form panel" onSubmit={handleSubmit}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">{editingId ? "MAKE A CHANGE" : "START HERE"}</p>
              <h2>{editingId ? "Edit task" : "Add a task"}</h2>
            </div>
            <span className="form-icon">{editingId ? "✎" : "+"}</span>
          </div>

          <label htmlFor="task-title">Task title</label>
          <input
            id="task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Revise JavaScript basics"
            maxLength={120}
            required
          />

          <label htmlFor="task-description">Description <span>(optional)</span></label>
          <textarea
            id="task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add a little detail..."
            rows={3}
            maxLength={1000}
          />

          <div className="form-actions">
            <button className="primary-button" type="submit">
              {editingId ? "Save changes" : "Add task"} <span>→</span>
            </button>
            {editingId && <button className="quiet-button" type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>

        <section className="task-list panel">
          <div className="section-heading list-heading">
            <div>
              <p className="eyebrow">YOUR CHECKLIST</p>
              <h2>Tasks <span className="count-pill">{visibleTasks.length}</span></h2>
            </div>
            <select aria-label="Filter tasks" value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">All tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {message && <div className="message" role="status">{message}</div>}

          {loading ? (
            <div className="empty-state"><span className="empty-icon">◌</span><h3>Loading tasks...</h3></div>
          ) : visibleTasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✦</span>
              <h3>{filter === "all" ? "A clean slate." : `No ${filter} tasks.`}</h3>
              <p>{filter === "all" ? "Add your first task and get the ball rolling." : "Try another filter or add a new task."}</p>
            </div>
          ) : (
            <ul className="tasks">
              {visibleTasks.map((task) => (
                <li className={`task-item ${task.completed ? "is-complete" : ""}`} key={task._id}>
                  <button
                    className={`check-button ${task.completed ? "checked" : ""}`}
                    onClick={() => toggleTask(task._id)}
                    aria-label={task.completed ? "Mark task pending" : "Mark task completed"}
                    type="button"
                  >{task.completed ? "✓" : ""}</button>
                  <div className="task-content">
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                    <span className={`status ${task.completed ? "status-done" : "status-pending"}`}>
                      {task.completed ? "Completed" : "In progress"}
                    </span>
                  </div>
                  <div className="task-actions">
                    <button type="button" onClick={() => startEdit(task)} aria-label={`Edit ${task.title}`}>Edit</button>
                    <button className="delete-button" type="button" onClick={() => deleteTask(task._id)} aria-label={`Delete ${task.title}`}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>

      <footer><span>TaskFlow</span> · Built with the MERN stack · Keep moving forward.</footer>
    </main>
  );
}
