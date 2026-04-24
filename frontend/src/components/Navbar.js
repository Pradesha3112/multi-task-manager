import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };
    
    return (
        <nav className="navbar">
            <div className="navbar-brand">📋 TaskFlow</div>
            <div className="nav-links">
                <Link to="/dashboard" className="nav-link">📊 Dashboard</Link>
                <Link to="/tasks" className="nav-link">📝 Tasks</Link>
                <Link to="/tasks/new" className="nav-link">➕ New Task</Link>
                <Link to="/audit-log" className="nav-link">📋 Activity Log</Link>
            </div>
            <div className="nav-user">
                <span className="user-info">{user.email}</span>
                <span className="user-role">{user.role}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
