import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

function EditTask() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchTask();
    }, []);
    
    const fetchTask = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const task = response.data;
        setTitle(task.title);
        setDescription(task.description || '');
        setStatus(task.status);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            await axios.put(`/api/tasks/${id}`,
                { title, description, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/tasks');
        } catch (error) {
            alert('Failed to update task');
        }
    };
    
    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <h1>Edit Task</h1>
                <form onSubmit={handleSubmit} style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Title *</label><br />
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }} required />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Description</label><br />
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                            rows="4" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Status</label><br />
                        <select value={status} onChange={(e) => setStatus(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => navigate('/tasks')} style={{
                            padding: '10px 20px',
                            backgroundColor: '#95a5a6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Cancel
                        </button>
                        <button type="submit" style={{
                            padding: '10px 20px',
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Update Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditTask;