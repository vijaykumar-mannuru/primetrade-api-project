import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.logo}>⚡ PrimeTrade</Link>
      <div style={styles.links}>
        <Link to="/dashboard" style={{ ...styles.link, ...(isActive('/dashboard') ? styles.active : {}) }}>Dashboard</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" style={{ ...styles.link, ...(isActive('/admin') ? styles.active : {}) }}>Admin</Link>
        )}
        <span style={styles.userTag}>{user?.name} · <span style={{ color: 'var(--accent2)' }}>{user?.role}</span></span>
        <button onClick={handleLogout} className="btn-outline" style={{ padding: '6px 16px', fontSize: '13px' }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    padding: '0 32px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: { fontSize: '18px', fontWeight: '700', color: 'var(--accent)', textDecoration: 'none', fontFamily: "'Space Mono', monospace" },
  links: { display: 'flex', alignItems: 'center', gap: '20px' },
  link: { color: 'var(--muted)', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.15s' },
  active: { color: 'var(--text)' },
  userTag: { fontSize: '13px', color: 'var(--muted)' },
};
