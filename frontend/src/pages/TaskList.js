import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchTasks();
    }, []);
    
    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/tasks', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data);
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Delete this task?')) {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        }
    };
    
    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Tasks</h1>
                    <button onClick={() => navigate('/tasks/new')} style={{
                        padding: '10px 20px',
                        backgroundColor: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                        + New Task
                    </button>
                </div>
                
                {tasks.length === 0 ? (
                    <p>No tasks yet. Create one!</p>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} style={{
                            backgroundColor: 'white',
                            padding: '15px',
                            marginBottom: '10px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <p>Status: {task.status} | Created by: {task.creator_email}</p>
                            <button onClick={() => navigate(`/tasks/${task.id}/edit`)} style={{
                                padding: '5px 15px',
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}>
                                Edit
                            </button>
                            <button onClick={() => handleDelete(task.id)} style={{
                                padding: '5px 15px',
                                backgroundColor: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TaskList;