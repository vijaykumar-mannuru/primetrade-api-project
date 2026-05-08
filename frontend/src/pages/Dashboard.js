import React, { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: 10, ...filter };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await getTasks(params);
      setTasks(res.data.data);
      setPagination((p) => ({ ...p, totalPages: res.data.totalPages, total: res.data.total }));
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const openCreate = () => { setEditTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditTask(task); setModalOpen(true); };

  const handleSave = async (form) => {
    try {
      if (editTask) {
        await updateTask(editTask._id, form);
        toast.success('Task updated!');
      } else {
        await createTask(form);
        toast.success('Task created!');
      }
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      fetchTasks();
    } catch {
      toast.error('Delete failed');
    }
  };

  const statusClass = (s) => `badge badge-${s}`;
  const priorityClass = (p) => `badge badge-${p}`;

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Tasks</h1>
            <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
              {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
            </p>
          </div>
          <button className="btn-primary" onClick={openCreate}>+ New Task</button>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} style={{ width: 'auto' }}>
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select value={filter.priority} onChange={(e) => setFilter({ ...filter, priority: e.target.value })} style={{ width: 'auto' }}>
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {(filter.status || filter.priority) && (
            <button className="btn-outline" onClick={() => setFilter({ status: '', priority: '' })} style={{ padding: '8px 14px' }}>Clear</button>
          )}
        </div>

        {/* Task list */}
        {loading ? (
          <div style={styles.empty}>Loading tasks…</div>
        ) : tasks.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
            <p>No tasks yet. Click <b>+ New Task</b> to get started.</p>
          </div>
        ) : (
          <div style={styles.taskList}>
            {tasks.map((task) => (
              <div key={task._id} className="card" style={styles.taskCard}>
                <div style={styles.taskTop}>
                  <div>
                    <h3 style={styles.taskTitle}>{task.title}</h3>
                    {task.description && <p style={styles.taskDesc}>{task.description}</p>}
                  </div>
                  <div style={styles.taskActions}>
                    <button className="btn-outline" onClick={() => openEdit(task)} style={{ padding: '6px 14px', fontSize: '13px' }}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(task._id)} style={{ fontSize: '13px' }}>Delete</button>
                  </div>
                </div>
                <div style={styles.taskMeta}>
                  <span className={statusClass(task.status)}>{task.status}</span>
                  <span className={priorityClass(task.priority)}>{task.priority}</span>
                  {task.dueDate && (
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {user?.role === 'admin' && task.user && (
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      by {task.user.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={styles.pagination}>
            <button className="btn-outline" onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} disabled={pagination.page === 1}>
              ← Prev
            </button>
            <span style={{ color: 'var(--muted)', fontSize: '14px' }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button className="btn-outline" onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} disabled={pagination.page === pagination.totalPages}>
              Next →
            </button>
          </div>
        )}
      </div>

      {modalOpen && <TaskModal task={editTask} onClose={() => setModalOpen(false)} onSave={handleSave} />}
    </>
  );
}

const styles = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '700', marginBottom: '4px' },
  filters: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
  taskList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  taskCard: { transition: 'border-color 0.15s' },
  taskTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' },
  taskTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '4px' },
  taskDesc: { color: 'var(--muted)', fontSize: '13px', lineHeight: '1.5' },
  taskActions: { display: 'flex', gap: '8px', flexShrink: 0 },
  taskMeta: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' },
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '28px' },
};
