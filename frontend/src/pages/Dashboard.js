import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Dashboard() {
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
    
    useEffect(() => {
        fetchStats();
    }, []);
    
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const tasks = response.data;
            setStats({
                total: tasks.length,
                pending: tasks.filter(t => t.status === 'pending').length,
                inProgress: tasks.filter(t => t.status === 'in-progress').length,
                completed: tasks.filter(t => t.status === 'completed').length
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1>Dashboard</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '30px' }}>
                    <div style={{ padding: '20px', backgroundColor: '#3498db', color: 'white', borderRadius: '8px' }}>
                        <h3>Total Tasks</h3>
                        <h2>{stats.total}</h2>
                    </div>
                    <div style={{ padding: '20px', backgroundColor: '#f39c12', color: 'white', borderRadius: '8px' }}>
                        <h3>Pending</h3>
                        <h2>{stats.pending}</h2>
                    </div>
                    <div style={{ padding: '20px', backgroundColor: '#9b59b6', color: 'white', borderRadius: '8px' }}>
                        <h3>In Progress</h3>
                        <h2>{stats.inProgress}</h2>
                    </div>
                    <div style={{ padding: '20px', backgroundColor: '#27ae60', color: 'white', borderRadius: '8px' }}>
                        <h3>Completed</h3>
                        <h2>{stats.completed}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;