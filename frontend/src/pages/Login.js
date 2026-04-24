import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };
    
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>👋 Welcome Back</h2>
                <p className="subtitle">Sign in to manage your tasks</p>
                
                {error && <div className="alert-error">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>📧 Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email" required />
                    </div>
                    <div className="form-group">
                        <label>🔒 Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password" required />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
                <p className="auth-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
