import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function AuditLog() {
    const [logs, setLogs] = useState([]);
    
    useEffect(() => {
        fetchLogs();
    }, []);
    
    const fetchLogs = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/tasks/audit-logs/all', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(response.data);
    };
    
    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1>Activity Log</h1>
                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                            <th>Time</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id}>
                                <td>{new Date(log.created_at).toLocaleString()}</td>
                                <td>{log.user_email}</td>
                                <td>{log.action}</td>
                                <td>{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && <p style={{ textAlign: 'center', marginTop: '20px' }}>No activities yet</p>}
            </div>
        </div>
    );
}

export default AuditLog;