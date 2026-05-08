import React, { useState, useEffect } from 'react';
import { getAdminStats, getAllUsers, toggleUser } from '../api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([getAdminStats(), getAllUsers()]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleToggle = async (id) => {
    try {
      const res = await toggleUser(id);
      toast.success(res.data.message);
      fetchData();
    } catch {
      toast.error('Failed to toggle user');
    }
  };

  const getStatusCount = (status) =>
    stats?.tasksByStatus?.find((s) => s._id === status)?.count || 0;

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h1 style={styles.title}>Admin Dashboard</h1>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Loading…</p>
        ) : (
          <>
            {/* Stats */}
            <div style={styles.statsGrid}>
              {[
                { label: 'Total Users', value: stats?.totalUsers, color: 'var(--accent)' },
                { label: 'Total Tasks', value: stats?.totalTasks, color: 'var(--accent2)' },
                { label: 'To Do', value: getStatusCount('todo'), color: 'var(--muted)' },
                { label: 'In Progress', value: getStatusCount('in-progress'), color: 'var(--warning)' },
                { label: 'Done', value: getStatusCount('done'), color: 'var(--accent2)' },
              ].map(({ label, value, color }) => (
                <div key={label} className="card" style={styles.statCard}>
                  <div style={{ ...styles.statNum, color }}>{value ?? 0}</div>
                  <div style={styles.statLabel}>{label}</div>
                </div>
              ))}
            </div>

            {/* Users table */}
            <div className="card" style={{ marginTop: '32px' }}>
              <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}>All Users</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Joined</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} style={styles.tr}>
                        <td style={styles.td}>{u.name}</td>
                        <td style={styles.td}>{u.email}</td>
                        <td style={styles.td}>
                          <span className="badge" style={{ background: u.role === 'admin' ? 'rgba(108,99,255,0.15)' : 'rgba(0,212,170,0.1)', color: u.role === 'admin' ? 'var(--accent)' : 'var(--accent2)' }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span className="badge" style={{ background: u.isActive ? 'rgba(0,212,170,0.1)' : 'rgba(255,71,87,0.1)', color: u.isActive ? 'var(--accent2)' : 'var(--danger)' }}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td style={styles.td}>
                          <button
                            className={u.isActive ? 'btn-danger' : 'btn-outline'}
                            onClick={() => handleToggle(u._id)}
                            style={{ padding: '5px 14px', fontSize: '12px' }}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

const styles = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: '28px', fontWeight: '700', marginBottom: '24px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' },
  statCard: { textAlign: 'center' },
  statNum: { fontSize: '36px', fontWeight: '700', fontFamily: "'Space Mono', monospace" },
  statLabel: { color: 'var(--muted)', fontSize: '13px', marginTop: '4px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { borderBottom: '1px solid var(--border)' },
  th: { textAlign: 'left', padding: '10px 14px', fontSize: '12px', fontWeight: '600', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tr: { borderBottom: '1px solid var(--border)' },
  td: { padding: '12px 14px', fontSize: '14px' },
};
