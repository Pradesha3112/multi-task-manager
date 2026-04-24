import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function CreateTask() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            await axios.post('/api/tasks',
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/tasks');
        } catch (error) {
            alert('Failed to create task');
        }
    };
    
    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <h1>Create New Task</h1>
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
                            backgroundColor: '#27ae60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTask;